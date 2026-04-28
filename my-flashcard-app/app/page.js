"use client";
import React, { useEffect, useMemo, useState } from 'react';
import flashcardData from '../data/flashcards.json';
import authoritySources from '../data/authority-sources.json';

const COMMENTS_STORAGE_KEY = 'lshc-flashcard-comments-v1';

const UI_TEXT = {
  en: {
    languageName: 'English',
    viewAll: 'View All',
    coverEyebrow: 'Life Sciences & Healthcare · SAP Consulting',
    coverTitleTop: 'SAP CSV & GxP',
    coverTitleAccent: 'Compliance',
    coverStats: (cards, domains) => `${cards} knowledge cards across ${domains} compliance domains`,
    begin: 'Begin ->',
    prepared: 'Prepared by Mark & Xincheng · April 2026',
    pageTitle: 'SAP CSV & GxP in LSHC',
    pageSubtitle: 'Project Wiki for Regulatory Compliance prepared by Mark & Xincheng, April 2026',
    searchPlaceholder: 'Search GxP, CSV, FDA, NMPA...',
    searchLabel: 'Search flashcards',
    revealed: 'revealed',
    clickReveal: 'Click to Reveal',
    clickBack: 'Click to Flip Back',
    comments: 'Comments',
    addComment: 'Add comment',
    closeComments: 'Close comments',
    nickname: 'Nickname',
    comment: 'Comment',
    nicknamePlaceholder: 'Your nickname',
    commentPlaceholder: 'Share a note, question, or field observation...',
    saveComment: 'Save comment',
    noComments: 'No comments yet.',
    commentsFor: 'Comments for this card',
    helperTitle: 'Authority Helper',
    helperBadge: 'Local source cache',
    helperOpen: 'Open authority helper',
    helperClose: 'Close authority helper',
    helperContext: 'Current card',
    helperNoCard: 'No card selected',
    helperPlaceholder: 'Ask about this card...',
    helperSend: 'Ask',
    helperSources: 'Sources',
    helperEmpty: 'Open a revealed card, then ask a focused compliance question.',
    helperUnsupported: 'I do not have enough support in the local authority cache for that question yet.',
    helperGroundedLead: 'From the local authority cache:',
    noCardsTitle: 'No flashcards found',
    noCardsBody: 'Try another business keyword or switch category.',
    categoryJoiner: ' · ',
  },
  zh: {
    languageName: '简体中文',
    viewAll: '查看全部',
    coverEyebrow: '生命科学与医疗健康 · SAP 咨询',
    coverTitleTop: 'SAP CSV & GxP',
    coverTitleAccent: '合规知识卡',
    coverStats: (cards, domains) => `${cards} 张知识卡，覆盖 ${domains} 个合规领域`,
    begin: '开始 ->',
    prepared: 'Mark 与 Xincheng 准备 · 2026年4月',
    pageTitle: '生命科学医疗行业 SAP CSV & GxP',
    pageSubtitle: '监管合规项目 Wiki，由 Mark 与 Xincheng 准备，2026年4月',
    searchPlaceholder: '搜索 GxP、CSV、FDA、NMPA、验证...',
    searchLabel: '搜索知识卡',
    revealed: '已揭示',
    clickReveal: '点击查看答案',
    clickBack: '点击翻回问题',
    comments: '评论',
    addComment: '添加评论',
    closeComments: '关闭评论',
    nickname: '昵称',
    comment: '评论',
    nicknamePlaceholder: '你的昵称',
    commentPlaceholder: '留下备注、问题或项目观察...',
    saveComment: '保存评论',
    noComments: '暂无评论。',
    commentsFor: '此卡片评论',
    helperTitle: '权威来源助手',
    helperBadge: '本地来源库',
    helperOpen: '打开权威来源助手',
    helperClose: '关闭权威来源助手',
    helperContext: '当前卡片',
    helperNoCard: '未选择卡片',
    helperPlaceholder: '围绕此卡片提问...',
    helperSend: '提问',
    helperSources: '来源',
    helperEmpty: '先翻开一张卡片，再提出聚焦的合规问题。',
    helperUnsupported: '本地权威来源库暂时没有足够依据回答这个问题。',
    helperGroundedLead: '基于本地权威来源库：',
    noCardsTitle: '没有找到知识卡',
    noCardsBody: '请尝试其他业务关键词，或切换分类。',
    categoryJoiner: ' · ',
  },
};

const CATEGORY_STYLES = [
  {
    key: 'all',
    activeBg: 'bg-slate-700 text-white',
    activeShadow: 'shadow-slate-300',
    activeBadge: 'bg-slate-600 text-white',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/>
        <rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>
      </svg>
    ),
  },
  {
    key: 'global',
    activeBg: 'bg-blue-600 text-white',
    activeShadow: 'shadow-blue-200',
    activeBadge: 'bg-blue-500 text-white',
    barBg: 'bg-blue-600',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6"/>
        <path d="M8 2C6 4 5 6 5 8s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6"/>
        <path d="M2.5 6h11M2.5 10h11"/>
      </svg>
    ),
  },
  {
    key: 'china',
    activeBg: 'bg-rose-600 text-white',
    activeShadow: 'shadow-rose-200',
    activeBadge: 'bg-rose-500 text-white',
    barBg: 'bg-rose-600',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14V7l6-5 6 5v7H2z"/>
        <path d="M6 14v-4h4v4"/>
      </svg>
    ),
  },
  {
    key: 'cloud',
    activeBg: 'bg-sky-500 text-white',
    activeShadow: 'shadow-sky-200',
    activeBadge: 'bg-sky-400 text-white',
    barBg: 'bg-sky-500',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12.5 10.5a2.5 2.5 0 000-5 .5.5 0 01-.5-.4 4 4 0 00-7.9.9A2.5 2.5 0 003.5 11h9z"/>
      </svg>
    ),
  },
  {
    key: 'architecture',
    activeBg: 'bg-violet-600 text-white',
    activeShadow: 'shadow-violet-200',
    activeBadge: 'bg-violet-500 text-white',
    barBg: 'bg-violet-600',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="2.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/>
      </svg>
    ),
  },
];

const SEARCH_ALIASES = {
  cvs: ['csv'],
  csv: ['cvs'],
};

const STOP_WORDS = new Set([
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

const AUTHORITY_KEYWORDS = [
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

const getCards = (categories) => (
  categories.flatMap(cat =>
    cat.cards.map(card => ({
      ...card,
      category: cat.category,
      categoryKey: cat.key,
    }))
  )
);

const normalizeSearchText = (value) => (
  String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
);

const hasAdjacentSwap = (source, target) => {
  if (source.length !== target.length || source.length < 3) return false;

  for (let index = 0; index < source.length - 1; index += 1) {
    const swapped = `${source.slice(0, index)}${source[index + 1]}${source[index]}${source.slice(index + 2)}`;
    if (swapped === target) return true;
  }

  return false;
};

const isCloseKeywordMatch = (term, word) => {
  if (term.length < 3 || word.length < 3) return false;
  if (word.includes(term)) return true;
  if (term.length === word.length && hasAdjacentSwap(term, word)) return true;
  if (term.length < 5 || Math.abs(term.length - word.length) > 1) return false;

  let termIndex = 0;
  let wordIndex = 0;
  let edits = 0;

  while (termIndex < term.length && wordIndex < word.length) {
    if (term[termIndex] === word[wordIndex]) {
      termIndex += 1;
      wordIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;

    if (term.length > word.length) {
      termIndex += 1;
    } else if (word.length > term.length) {
      wordIndex += 1;
    } else {
      termIndex += 1;
      wordIndex += 1;
    }
  }

  return edits + (term.length - termIndex) + (word.length - wordIndex) <= 1;
};

const cardMatchesSearch = (card, query) => {
  const terms = normalizeSearchText(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;

  const searchableText = normalizeSearchText([
    card.question,
    card.answer,
    card.category,
    card.categoryKey,
  ].join(' '));
  const searchableWords = searchableText.split(' ').filter(Boolean);

  return terms.every((term) => {
    const relatedTerms = [term, ...(SEARCH_ALIASES[term] || [])];

    return relatedTerms.some((relatedTerm) => (
      searchableText.includes(relatedTerm)
      || searchableWords.some(word => isCloseKeywordMatch(relatedTerm, word))
    ));
  });
};

const getSearchTerms = (value) => {
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

const localizedValue = (value, locale, fallbackLocale = 'en') => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return value;

  return value[locale] || value[fallbackLocale] || Object.values(value)[0];
};

const localizedArray = (value, locale) => {
  const localized = localizedValue(value, locale);
  return Array.isArray(localized) ? localized : [localized].filter(Boolean);
};

const sourceUrlEntries = (source, locale) => {
  if (!source.url || typeof source.url !== 'object') {
    return [{ locale, url: source.url }];
  }

  const preferredLocales = locale === 'zh' ? ['zh', 'en'] : ['en', 'zh'];
  return preferredLocales
    .filter(option => source.url[option])
    .map(option => ({ locale: option, url: source.url[option] }));
};

const sourceDisplay = (source, locale) => ({
  sourceType: localizedValue(source.sourceType, locale),
  title: localizedValue(source.title, locale),
  status: localizedValue(source.status, locale),
  date: localizedValue(source.date, locale),
  notes: localizedArray(source.notes, locale),
  urls: sourceUrlEntries(source, locale),
});

const scoreAuthoritySource = (source, terms) => {
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

const findAuthoritySources = ({ question, card }) => {
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

const buildGroundedReply = ({ question, card, ui, locale }) => {
  const matches = findAuthoritySources({ question, card });

  if (matches.length === 0) {
    return {
      text: ui.helperUnsupported,
      sources: [],
    };
  }

  const bullets = matches.map((source) => {
    const display = sourceDisplay(source, locale);
    return `${source.issuer} (${display.sourceType}): ${display.notes[0]}`;
  });

  return {
    text: [ui.helperGroundedLead, ...bullets].join('\n- '),
    sources: matches,
  };
};

export default function FlashcardApp() {
  const [showCover, setShowCover] = useState(true);
  const [locale, setLocale] = useState(flashcardData.defaultLocale);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState({});
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [cardComments, setCardComments] = useState(null);
  const [activeCommentCardId, setActiveCommentCardId] = useState(null);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [activeStudyCardId, setActiveStudyCardId] = useState(null);
  const [helperOpen, setHelperOpen] = useState(false);
  const [helperDraft, setHelperDraft] = useState('');
  const [helperMessages, setHelperMessages] = useState([]);

  const availableLocales = Object.keys(flashcardData.locales);
  const categories = flashcardData.locales[locale] || flashcardData.locales[flashcardData.defaultLocale];
  const ui = UI_TEXT[locale] || UI_TEXT.en;

  const allCards = useMemo(() => getCards(categories), [categories]);
  const activeCommentCard = useMemo(
    () => allCards.find(card => card.id === activeCommentCardId),
    [activeCommentCardId, allCards]
  );
  const activeStudyCard = useMemo(
    () => allCards.find(card => card.id === activeStudyCardId),
    [activeStudyCardId, allCards]
  );
  const commentsByCard = cardComments || {};
  const activeCardComments = activeCommentCardId ? commentsByCard[activeCommentCardId] || [] : [];
  const categoryLabels = useMemo(
    () => Object.fromEntries(categories.map(({ key, label }) => [key, label])),
    [categories]
  );
  const cats = useMemo(() => (
    CATEGORY_STYLES.map((category) => ({
      ...category,
      label: category.key === 'all' ? ui.viewAll : categoryLabels[category.key],
    }))
  ), [categoryLabels, ui.viewAll]);

  const switchLocale = (nextLocale) => {
    setLocale(nextLocale);
    setSearchQuery('');
    setFlippedCards({});
    setActiveCommentCardId(null);
    setActiveStudyCardId(null);
    setHelperMessages([]);
  };

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      try {
        const storedComments = window.localStorage.getItem(COMMENTS_STORAGE_KEY);
        if (!storedComments) {
          setCardComments({});
          return;
        }

        const parsedComments = JSON.parse(storedComments);
        setCardComments(
          parsedComments && typeof parsedComments === 'object' && !Array.isArray(parsedComments)
            ? parsedComments
            : {}
        );
      } catch {
        setCardComments({});
      }
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (cardComments === null) return;

    try {
      window.localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(cardComments));
    } catch {
      // Local comments remain in memory if the browser blocks storage.
    }
  }, [cardComments]);

  const toggleFlip = (id) => {
    const willReveal = !flippedCards[id];
    if (willReveal) {
      setActiveStudyCardId(id);
    }

    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
    setRevealedCards(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const openCommentDialog = (event, cardId) => {
    event.stopPropagation();
    setActiveCommentCardId(cardId);
  };

  const closeCommentDialog = () => {
    setActiveCommentCardId(null);
    setCommentDraft('');
  };

  const saveComment = (event) => {
    event.preventDefault();
    const text = commentDraft.trim();
    if (!activeCommentCardId || !text) return;

    const nickname = nicknameDraft.trim() || 'Anonymous';
    const nextComment = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      nickname: nickname.slice(0, 40),
      text: text.slice(0, 600),
      createdAt: new Date().toISOString(),
    };

    setCardComments(prev => ({
      ...(prev || {}),
      [activeCommentCardId]: [...((prev || {})[activeCommentCardId] || []), nextComment],
    }));
    setNicknameDraft(nickname.slice(0, 40));
    setCommentDraft('');
  };

  const submitHelperQuestion = (event) => {
    event.preventDefault();
    const question = helperDraft.trim();
    if (!question) return;

    const reply = buildGroundedReply({
      question,
      card: activeStudyCard,
      ui,
      locale,
    });

    setHelperMessages(prev => [
      ...prev,
      { id: `${Date.now()}-user`, role: 'user', text: question },
      { id: `${Date.now()}-assistant`, role: 'assistant', ...reply },
    ]);
    setHelperDraft('');
  };

  const filteredCards = useMemo(() => (
    allCards.filter(card => (
      (filter === 'all' || card.categoryKey === filter)
      && cardMatchesSearch(card, searchQuery)
    ))
  ), [allCards, filter, searchQuery]);

  const getCategoryTotal = (key) => (
    key === 'all'
      ? allCards.length
      : allCards.filter(card => card.categoryKey === key).length
  );

  const getCategoryRevealed = (key) => (
    key === 'all'
      ? allCards.filter(card => revealedCards.has(card.id)).length
      : allCards.filter(card => card.categoryKey === key && revealedCards.has(card.id)).length
  );

  const getProgressWidth = (revealed, total) => (
    total === 0 ? 0 : Math.round((revealed / total) * 100)
  );

  const renderLanguageSwitch = (variant = 'light') => (
    <div className={`inline-flex rounded-full border p-1 text-xs font-bold ${
      variant === 'dark'
        ? 'border-white/10 bg-white/5 text-slate-300'
        : 'border-slate-200 bg-white text-slate-500 shadow-sm'
    }`}>
      {availableLocales.map((option) => {
        const isActive = locale === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => switchLocale(option)}
            className={`h-8 rounded-full px-4 transition ${
              isActive
                ? variant === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-900 text-white'
                : variant === 'dark'
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {UI_TEXT[option]?.languageName || option}
          </button>
        );
      })}
    </div>
  );

  const renderThinFilterButton = ({ key, label, icon }) => {
    const isActive = filter === key;

    return (
      <button
        key={key}
        onClick={() => setFilter(key)}
        className={`flex h-[50px] w-[150px] items-center justify-center gap-1.5 rounded-full border text-sm font-semibold shadow-sm transition-all ${
          isActive
            ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </button>
    );
  };

  const renderProgressFilterButton = ({ key, label, activeBg, activeShadow, icon, barBg }) => {
    const isActive = filter === key;
    const total = getCategoryTotal(key);
    const revealed = getCategoryRevealed(key);

    return (
      <button
        key={key}
        onClick={() => setFilter(key)}
        className={`h-[105px] w-[275px] rounded-lg border p-4 text-left transition-all ${
          isActive
            ? `${activeBg} border-transparent shadow-md ${activeShadow}`
            : 'border-slate-100 bg-white text-slate-800 shadow-sm hover:border-blue-200 hover:bg-slate-50'
        }`}
      >
        <div className={`mb-2 flex items-center gap-1.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
          <span className="flex-shrink-0">{icon}</span>
          <span className="truncate text-xs font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <div className="mb-2.5 flex items-baseline gap-1">
          <span className={`text-2xl font-extrabold ${isActive ? 'text-white' : 'text-slate-800'}`}>{revealed}</span>
          <span className={`text-sm ${isActive ? 'text-white/70' : 'text-slate-400'}`}>/ {total} {ui.revealed}</span>
        </div>
        <div className={`h-1.5 overflow-hidden rounded-full ${isActive ? 'bg-white/25' : 'bg-slate-100'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white' : barBg || 'bg-slate-700'}`}
            style={{ width: `${getProgressWidth(revealed, total)}%` }}
          />
        </div>
      </button>
    );
  };

  return (
    <>
      {showCover && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-slate-900">
          <div className="absolute right-5 top-5 z-10">{renderLanguageSwitch('dark')}</div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.18) 0%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative max-w-2xl px-8 text-center text-white">
            <span className="mb-8 block text-xs font-bold uppercase tracking-[0.35em] text-blue-400">
              {ui.coverEyebrow}
            </span>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              {ui.coverTitleTop}
              <br />
              <span className="text-blue-400">{ui.coverTitleAccent}</span>
            </h1>

            <p className="mb-3 text-lg text-slate-300">
              {ui.coverStats(allCards.length, categories.length)}
            </p>
            <p className="mb-10 text-sm text-slate-500">
              {categories.map(({ category }) => category).join(ui.categoryJoiner)}
            </p>

            <button
              onClick={() => setShowCover(false)}
              className="rounded-full bg-blue-600 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-blue-500"
              style={{ boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}
            >
              {ui.begin}
            </button>

            <p className="mt-10 text-xs tracking-wide text-slate-600">
              {ui.prepared}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 px-4 py-12 font-sans">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center">
            <div className="mb-6 flex justify-center">{renderLanguageSwitch()}</div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {ui.pageTitle}
            </h1>
            <p className="mt-2 text-slate-500">
              {ui.pageSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="relative w-full max-w-2xl">
                <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="9" cy="9" r="5.5" />
                    <path d="M13.5 13.5L17 17" />
                  </svg>
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder={ui.searchPlaceholder}
                  aria-label={ui.searchLabel}
                  className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="flex max-w-full flex-nowrap justify-center gap-2 overflow-x-auto pb-1">
                {cats.map(renderThinFilterButton)}
              </div>
              <div className="flex justify-center">
                {cats.filter(({ key }) => key === 'all').map(renderProgressFilterButton)}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {cats.filter(({ key }) => key !== 'all').map(renderProgressFilterButton)}
              </div>
            </div>
          </header>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => toggleFlip(card.id)}
                  className="card-enter h-56 cursor-pointer perspective"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.6)}s` }}
                >
                  <div
                    className="relative h-full w-full transition-transform duration-500"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-6 text-center text-slate-800 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:border-blue-200">
                      <div>
                        <span className="mb-3 block text-[10px] font-black uppercase tracking-widest text-blue-500">
                          {card.category}
                        </span>
                        <p className="text-base font-semibold leading-snug">{card.question}</p>
                        <p className="mt-4 text-[10px] font-bold uppercase opacity-40">
                          {ui.clickReveal}
                        </p>
                      </div>
                    </div>

                    <div
                      className="backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-600 p-6 text-center text-white shadow-xl"
                      style={{
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 8px 30px rgba(37,99,235,0.25)',
                      }}
                    >
                      <div className="flex h-full flex-col items-center justify-center">
                        <span className="mb-3 block text-[10px] font-black uppercase tracking-widest text-blue-200">
                          {card.category}
                        </span>
                        <p className="line-clamp-5 text-base font-semibold leading-snug">{card.answer}</p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => openCommentDialog(event, card.id)}
                            className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
                          >
                            {ui.comments} ({(commentsByCard[card.id] || []).length})
                          </button>
                          <p className="text-[10px] font-bold uppercase opacity-40">
                            {ui.clickBack}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-lg font-bold text-slate-800">{ui.noCardsTitle}</p>
              <p className="mt-2 text-sm text-slate-500">{ui.noCardsBody}</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3">
        {helperOpen && (
          <section
            className="flex h-[520px] w-[380px] max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            aria-label={ui.helperTitle}
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-slate-900">{ui.helperTitle}</h2>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      {ui.helperBadge}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
                    {activeStudyCard ? `${ui.helperContext}: ${activeStudyCard.question}` : ui.helperNoCard}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHelperOpen(false)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  aria-label={ui.helperClose}
                >
                  x
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
              {helperMessages.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm font-medium text-slate-500">
                  {ui.helperEmpty}
                </div>
              ) : (
                helperMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-xl p-3 text-sm shadow-sm ${
                      message.role === 'user'
                        ? 'ml-8 bg-slate-900 text-white'
                        : 'mr-6 border border-slate-100 bg-white text-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    {message.sources?.length > 0 && (
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
                          {ui.helperSources}
                        </p>
                        <div className="space-y-2">
                          {message.sources.map((source) => {
                            const display = sourceDisplay(source, locale);
                            const primaryUrl = display.urls[0]?.url;

                            return (
                              <div
                                key={source.id}
                                className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs font-semibold text-slate-700"
                              >
                                <a
                                  href={primaryUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block transition hover:text-blue-700"
                                >
                                  <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                                    {source.issuer} · {display.sourceType} · {display.date}
                                  </span>
                                  {display.title}
                                </a>
                                {display.urls.length > 1 && (
                                  <div className="mt-1 flex gap-2 text-[10px] font-bold uppercase tracking-wide">
                                    {display.urls.map(entry => (
                                      <a
                                        key={entry.locale}
                                        href={entry.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        {entry.locale}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={submitHelperQuestion} className="border-t border-slate-100 bg-white p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={helperDraft}
                  onChange={event => setHelperDraft(event.target.value)}
                  placeholder={ui.helperPlaceholder}
                  className="h-10 min-w-0 flex-1 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={!helperDraft.trim()}
                  className="h-10 rounded-full bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {ui.helperSend}
                </button>
              </div>
            </form>
          </section>
        )}

        <button
          type="button"
          onClick={() => setHelperOpen(prev => !prev)}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-slate-400/40 transition hover:bg-slate-700"
          aria-label={helperOpen ? ui.helperClose : ui.helperOpen}
        >
          {ui.helperTitle}
        </button>
      </div>

      {activeCommentCard && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          onClick={closeCommentDialog}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={event => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="comment-dialog-title"
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {ui.commentsFor}
                  </p>
                  <h2 id="comment-dialog-title" className="mt-1 text-lg font-bold text-slate-900">
                    {activeCommentCard.question}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCommentDialog}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  aria-label={ui.closeComments}
                >
                  x
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-112px)] overflow-y-auto px-6 py-5">
              <div className="space-y-3">
                {activeCardComments.length > 0 ? (
                  activeCardComments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-900">{comment.nickname}</p>
                        <time className="text-xs text-slate-400">
                          {new Date(comment.createdAt).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                        </time>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-medium text-slate-500">
                    {ui.noComments}
                  </div>
                )}
              </div>

              <form onSubmit={saveComment} className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid gap-3">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    {ui.nickname}
                    <input
                      type="text"
                      value={nicknameDraft}
                      onChange={event => setNicknameDraft(event.target.value)}
                      maxLength={40}
                      placeholder={ui.nicknamePlaceholder}
                      className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                    {ui.comment}
                    <textarea
                      value={commentDraft}
                      onChange={event => setCommentDraft(event.target.value)}
                      required
                      maxLength={600}
                      rows={4}
                      placeholder={ui.commentPlaceholder}
                      className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium leading-relaxed text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                      disabled={!commentDraft.trim()}
                    >
                      {ui.saveComment}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
