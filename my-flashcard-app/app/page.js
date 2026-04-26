"use client";
import React, { useMemo, useState } from 'react';
import flashcardData from '../data/flashcards.json';

const allCards = flashcardData.flatMap(cat =>
  cat.cards.map(card => ({
    ...card,
    category: cat.category,
    categoryKey: cat.key,
  }))
);

const categoryLabels = Object.fromEntries(
  flashcardData.map(({ key, label }) => [key, label])
);

const CATS = [
  {
    key: 'all',
    label: 'View All',
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
    label: categoryLabels.global,
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
    label: categoryLabels.china,
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
    label: categoryLabels.cloud,
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
    label: categoryLabels.architecture,
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

const normalizeSearchText = (value) => (
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
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

export default function FlashcardApp() {
  const [showCover, setShowCover] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState({});
  const [revealedCards, setRevealedCards] = useState(new Set());

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
    setRevealedCards(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const filteredCards = useMemo(() => (
    allCards.filter(card => (
      (filter === 'all' || card.categoryKey === filter)
      && cardMatchesSearch(card, searchQuery)
    ))
  ), [filter, searchQuery]);

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
        {label}
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
          <span className={`text-sm ${isActive ? 'text-white/70' : 'text-slate-400'}`}>/ {total} revealed</span>
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
      {/* ── Cover Slide ── */}
      {showCover && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
          {/* radial blue glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.18) 0%, transparent 70%)',
            }}
          />
          {/* subtle grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative text-center text-white max-w-2xl px-8">
            <span className="text-xs uppercase tracking-[0.35em] text-blue-400 font-bold block mb-8">
              Life Sciences &amp; Healthcare · SAP Consulting
            </span>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              SAP CSV &amp; GxP
              <br />
              <span className="text-blue-400">Compliance</span>
            </h1>

            <p className="text-slate-300 text-lg mb-3">
              {allCards.length} knowledge cards across {flashcardData.length} compliance domains
            </p>
            <p className="text-slate-500 text-sm mb-10">
              {flashcardData.map(({ category }) => category).join(' · ')}
            </p>

            <button
              onClick={() => setShowCover(false)}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-sm uppercase tracking-widest transition-all duration-300"
              style={{ boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}
            >
              Begin &rarr;
            </button>

            <p className="mt-10 text-slate-600 text-xs tracking-wide">
              Prepared by Mark &amp; Xincheng &nbsp;·&nbsp; April 2026
            </p>
          </div>
        </div>
      )}

      {/* ── Main App ── */}
      <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              SAP CSV &amp; GxP in LSHC
            </h1>
            <p className="mt-2 text-slate-500">
              Project Wiki for Regulatory Compliance prepared by Mark &amp; Xincheng, April 2026
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
                  placeholder="Search GxP, CSV, FDA, NMPA..."
                  aria-label="Search flashcards"
                  className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="flex max-w-full flex-nowrap justify-center gap-2 overflow-x-auto pb-1">
                {CATS.map(renderThinFilterButton)}
              </div>
              <div className="flex justify-center">
                {CATS.filter(({ key }) => key === 'all').map(renderProgressFilterButton)}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {CATS.filter(({ key }) => key !== 'all').map(renderProgressFilterButton)}
              </div>
            </div>
          </header>

          {/* ── Card Grid ── */}
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="h-56 cursor-pointer perspective card-enter"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.6)}s` }}
              >
                {/* flip container */}
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front face — question */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl p-6 flex items-center justify-center text-center bg-white border-2 border-slate-100 text-slate-800 shadow-sm hover:border-blue-200 hover:-translate-y-1 transition-transform duration-200">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest block mb-3 text-blue-500">
                        {card.category}
                      </span>
                      <p className="text-base leading-snug font-semibold">{card.question}</p>
                      <p className="mt-4 text-[10px] font-bold uppercase opacity-40">
                        Click to Reveal
                      </p>
                    </div>
                  </div>

                  {/* Back face — answer */}
                  <div
                    className="absolute inset-0 backface-hidden rounded-2xl p-6 flex items-center justify-center text-center bg-blue-600 text-white shadow-xl"
                    style={{
                      transform: 'rotateY(180deg)',
                      boxShadow: '0 8px 30px rgba(37,99,235,0.25)',
                    }}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest block mb-3 text-blue-200">
                        {card.category}
                      </span>
                      <p className="text-base leading-snug font-semibold">{card.answer}</p>
                      <p className="mt-4 text-[10px] font-bold uppercase opacity-40">
                        Click to Flip Back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-lg font-bold text-slate-800">No flashcards found</p>
              <p className="mt-2 text-sm text-slate-500">Try another business keyword or switch category.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
