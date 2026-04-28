import { buildGroundedReply, buildSourceContext, findAuthoritySources } from '../../../lib/authority-helper';

export const runtime = 'nodejs';

const UI_TEXT = {
  en: {
    helperUnsupported: 'I do not have enough support in the local authority cache for that question yet.',
    helperGroundedLead: 'From the local authority cache:',
  },
  zh: {
    helperUnsupported: '本地权威来源库暂时没有足够依据回答这个问题。',
    helperGroundedLead: '基于本地权威来源库：',
  },
};

const getProvider = () => {
  const requestedProvider = (process.env.AUTHORITY_CHAT_PROVIDER || '').toLowerCase();

  if (requestedProvider === 'gemini' && process.env.GEMINI_API_KEY) return 'gemini';
  if (requestedProvider === 'deepseek' && process.env.DEEPSEEK_API_KEY) return 'deepseek';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
  return 'local';
};

const systemInstruction = (locale) => (
  locale === 'zh'
    ? [
        '你是一个受限的生命科学与医疗健康合规学习助手。',
        '只允许根据提供的权威来源摘要回答。',
        '不得使用通用知识、不得编造法规、不得编造链接或出处。',
        '如果提供的来源不足以支持答案，必须明确说明本地权威来源库依据不足。',
        '回答要短，最多 3 个要点。保留来源机构名称。',
      ].join('\n')
    : [
        'You are a confined life sciences and healthcare compliance study helper.',
        'Answer only from the provided authority source excerpts.',
        'Do not use general knowledge, invent regulations, or invent citations.',
        'If the excerpts do not support the answer, say the local authority cache is insufficient.',
        'Keep the answer short, with at most 3 essential bullets. Preserve issuer names.',
      ].join('\n')
);

const buildPrompt = ({ question, card, sources, locale }) => {
  const sourceContext = buildSourceContext(sources, locale);
  const cardContext = card
    ? [
        `Category: ${card.category || card.categoryKey || 'N/A'}`,
        `Card question: ${card.question || 'N/A'}`,
        `Card answer: ${card.answer || 'N/A'}`,
      ].join('\n')
    : 'No active card context.';

  return [
    `Locale: ${locale}`,
    'Active card:',
    cardContext,
    '',
    'Authority source excerpts:',
    sourceContext,
    '',
    `User question: ${question}`,
  ].join('\n');
};

const callGemini = async ({ question, card, sources, locale }) => {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction(locale) }],
      },
      contents: [
        {
          parts: [{ text: buildPrompt({ question, card, sources, locale }) }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 320,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
};

const callDeepSeek = async ({ question, card, sources, locale }) => {
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 320,
      messages: [
        { role: 'system', content: systemInstruction(locale) },
        { role: 'user', content: buildPrompt({ question, card, sources, locale }) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed with ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
};

export async function POST(request) {
  try {
    const body = await request.json();
    const question = String(body.question || '').trim().slice(0, 600);
    const locale = body.locale === 'zh' ? 'zh' : 'en';
    const card = body.card && typeof body.card === 'object' ? body.card : null;
    const ui = UI_TEXT[locale] || UI_TEXT.en;

    if (!question) {
      return Response.json({ error: 'Question is required.' }, { status: 400 });
    }

    const sources = findAuthoritySources({ question, card });
    const localReply = buildGroundedReply({ question, card, ui, locale });

    if (sources.length === 0) {
      return Response.json(localReply);
    }

    const provider = getProvider();
    if (provider === 'local') {
      return Response.json(localReply);
    }

    try {
      const text = provider === 'gemini'
        ? await callGemini({ question, card, sources, locale })
        : await callDeepSeek({ question, card, sources, locale });

      return Response.json({
        text: text || localReply.text,
        sources,
        mode: 'ai',
        provider,
      });
    } catch {
      return Response.json({
        ...localReply,
        provider,
        warning: 'AI provider unavailable; returned local source summary.',
      });
    }
  } catch {
    return Response.json({ error: 'Invalid authority helper request.' }, { status: 400 });
  }
}
