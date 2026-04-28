import authoritySources from '../data/authority-sources.json';

export const STOP_WORDS = new Set([
  'about',
  'after',
  'against',
  'also',
  'and',
  'are',
  'can',
  'card',
  'does',
  'for',
  'from',
  'have',
  'how',
  'into',
  'its',
  'the',
  'this',
  'what',
  'when',
  'where',
  'which',
  'why',
  'with',
  'you',
  'your',
]);

export const AUTHORITY_KEYWORDS = [
  '国家药监局',
  '医疗器械',
  '独立软件',
  '现场检查',
  '质量管理',
  '中国',
  '监管',
  '验证',
  '确认',
  '软件',
  'NMPA',
  'FDA',
  'EMA',
  'ICH',
  'GAMP',
  'PIC/S',
];

export const normalizeSearchText = (value) => (
  String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
);

export const localizedValue = (value, locale, fallbackLocale = 'en') => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return value;

  return value[locale] || value[fallbackLocale] || Object.values(value)[0];
};

export const localizedArray = (value, locale) => {
  const localized = localizedValue(value, locale);
  return Array.isArray(localized) ? localized : [localized].filter(Boolean);
};

export const sourceUrlEntries = (source, locale) => {
  if (!source.url || typeof source.url !== 'object') {
    return [{ locale, url: source.url }];
  }

  const preferredLocales = locale === 'zh' ? ['zh', 'en'] : ['en', 'zh'];
  return preferredLocales
    .filter(option => source.url[option])
    .map(option => ({ locale: option, url: source.url[option] }));
};

export const sourceDisplay = (source, locale) => ({
  sourceType: localizedValue(source.sourceType, locale),
  title: localizedValue(source.title, locale),
  status: localizedValue(source.status, locale),
  date: localizedValue(source.date, locale),
  notes: localizedArray(source.notes, locale),
  urls: sourceUrlEntries(source, locale),
});

export const getSearchTerms = (value) => {
  const rawValue = String(value);
  const normalizedValue = normalizeSearchText(rawValue);
  const terms = normalizedValue
    .split(' ')
    .filter(term => term.length > 2 && !STOP_WORDS.has(term));

  AUTHORITY_KEYWORDS.forEach((keyword) => {
    if (rawValue.toLowerCase().includes(keyword.toLowerCase())) {
      terms.push(normalizeSearchText(keyword));
    }
  });

  return [...new Set(terms)];
};

export const scoreAuthoritySource = (source, terms) => {
  const sourceText = normalizeSearchText([
    source.issuer,
    localizedValue(source.sourceType, 'en'),
    localizedValue(source.sourceType, 'zh'),
    localizedValue(source.title, 'en'),
    localizedValue(source.title, 'zh'),
    localizedValue(source.status, 'en'),
    localizedValue(source.status, 'zh'),
    source.tags.join(' '),
    localizedArray(source.notes, 'en').join(' '),
    localizedArray(source.notes, 'zh').join(' '),
  ].join(' '));

  return terms.reduce((score, term) => {
    if (source.tags.some(tag => normalizeSearchText(tag).split(' ').includes(term))) {
      return score + 4;
    }

    return sourceText.includes(term) ? score + 1 : score;
  }, 0);
};

export const findAuthoritySources = ({ question, card }) => {
  const terms = getSearchTerms([
    question,
    card?.question,
    card?.answer,
    card?.category,
    card?.categoryKey,
  ].filter(Boolean).join(' '));

  if (terms.length === 0) return [];

  return authoritySources
    .map(source => ({
      ...source,
      score: scoreAuthoritySource(source, terms),
    }))
    .filter(source => source.score > 0)
    .sort((a, b) => b.score - a.score || a.issuer.localeCompare(b.issuer))
    .slice(0, 3);
};

export const buildGroundedReply = ({ question, card, ui, locale }) => {
  const matches = findAuthoritySources({ question, card });

  if (matches.length === 0) {
    return {
      text: ui.helperUnsupported,
      sources: [],
      mode: 'local',
    };
  }

  const bullets = matches.map((source) => {
    const display = sourceDisplay(source, locale);
    return `${source.issuer} (${display.sourceType}): ${display.notes[0]}`;
  });

  return {
    text: [ui.helperGroundedLead, ...bullets].join('\n- '),
    sources: matches,
    mode: 'local',
  };
};

export const buildSourceContext = (sources, locale) => (
  sources.map((source, index) => {
    const display = sourceDisplay(source, locale);
    const urlText = display.urls.map(entry => `${entry.locale}: ${entry.url}`).join('; ');

    return [
      `SOURCE ${index + 1}`,
      `Issuer: ${source.issuer}`,
      `Type: ${display.sourceType}`,
      `Title: ${display.title}`,
      `Date/status: ${display.date}; ${display.status}`,
      `URL: ${urlText}`,
      `Notes: ${display.notes.join(' ')}`,
    ].join('\n');
  }).join('\n\n')
);
