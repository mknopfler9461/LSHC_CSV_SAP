import React, { useState, useEffect } from 'react';

const Flashcard = ({ question, answer, category }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="group h-64 w-full [perspective:1000px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-slate-100 px-8 text-center text-slate-900 [backface-visibility:hidden] flex flex-col justify-center items-center border-2 border-blue-500">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{category}</span>
          <p className="text-lg font-semibold leading-tight">{question}</p>
          <p className="mt-4 text-sm text-slate-400">Click to reveal answer</p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-blue-600 px-8 text-center text-white [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center items-center">
          <p className="text-base font-medium leading-relaxed">{answer}</p>
          <p className="mt-4 text-xs opacity-75 italic">Click to flip back</p>
        </div>

      </div>
    </div>
  );
};

export default function FlashcardApp() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Replace this with a fetch to your /data/flashcards.json
    import('./data/flashcards.json').then((data) => {
      // Flatten the categories for easier mapping
      const flattened = data.default.flatMap(cat => 
        cat.cards.map(card => ({ ...card, category: cat.category }))
      );
      setCards(flattened);
    });
  }, []);

  const filteredCards = filter === 'All' 
    ? cards 
    : cards.filter(c => c.category.includes(filter));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            SAP CSV Mastery Portal
          </h1>
          <p className="mt-3 text-xl text-slate-500">
            Interactive Flashcards for Life Sciences Compliance
          </p>
          
          {/* Category Tabs */}
          <div className="mt-8 flex justify-center space-x-4">
            {['All', 'Global', 'Cloud', 'China'].map((cat) => {
              const count = cat === 'All' ? cards.length : cards.filter(c => c.category.includes(cat)).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
      {cat} <span className={`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${filter === cat ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
    </button>
  );
})}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <Flashcard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
