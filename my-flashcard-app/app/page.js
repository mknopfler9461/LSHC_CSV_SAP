"use client";
import React, { useState } from 'react';
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

export default function FlashcardApp() {
  const [showCover, setShowCover] = useState(true);
  const [filter, setFilter] = useState('all');
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

  const filteredCards = filter === 'all'
    ? allCards
    : allCards.filter(c => c.categoryKey === filter);

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
              {CATS.filter(({ key }) => key === 'all').map(({ key, label, activeBg, activeShadow, activeBadge, icon }) => {
                const isActive = filter === key;
                const count = allCards.filter(c => key === 'all' || c.categoryKey === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                      isActive
                        ? `${activeBg} shadow-md ${activeShadow}`
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex-shrink-0">{icon}</span>
                    {label}
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? activeBadge : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
              <div className="flex flex-wrap justify-center gap-2">
                {CATS.filter(({ key }) => key !== 'all').map(({ key, label, activeBg, activeShadow, activeBadge, icon }) => {
                  const isActive = filter === key;
                  const count = allCards.filter(c => c.categoryKey === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                        isActive
                          ? `${activeBg} shadow-md ${activeShadow}`
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex-shrink-0">{icon}</span>
                      {label}
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? activeBadge : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* ── Progress Dashboard ── */}
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CATS.filter(c => c.key !== 'All').map(({ key, label, icon, barBg }) => {
              const total = allCards.filter(c => c.categoryKey === key).length;
              const revealed = allCards.filter(c => c.categoryKey === key && revealedCards.has(c.id)).length;
              return (
                <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                    <span className="flex-shrink-0">{icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide truncate">{label}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2.5">
                    <span className="text-2xl font-extrabold text-slate-800">{revealed}</span>
                    <span className="text-sm text-slate-400">/ {total} revealed</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${Math.round((revealed / total) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Card Grid ── */}
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
        </div>
      </div>
    </>
  );
}
