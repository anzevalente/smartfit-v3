"use client";
import React, { useState, useEffect } from 'react';
import { Upload, Sparkles, Trash2, LayoutGrid } from 'lucide-react';

export default function SmartWardrobe() {
  const [wardrobe, setWardrobe] = useState<any[]>([]);
  const [outfit, setOutfit] = useState<any[]>([]);
  const [mood, setMood] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newItemCategory, setNewItemCategory] = useState<string>('top');
  const [newItemStyle, setNewItemStyle] = useState<string>('casual');

  // Shranjevanje v brskalnik
  useEffect(() => {
    const saved = localStorage.getItem('my-wardrobe');
    if (saved) setWardrobe(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('my-wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setUploadModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Ponastavimo vrednost, da lahko uporabnik še enkrat izbere isto datoteko
    e.target.value = '';
  };

  const confirmUpload = () => {
    if (previewUrl) {
      setWardrobe([...wardrobe, { id: Date.now(), url: previewUrl, category: newItemCategory, style: newItemStyle }]);
    }
    setUploadModalOpen(false);
    setPreviewUrl(null);
    setNewItemCategory('top');
    setNewItemStyle('casual');
  };

  const generateFit = () => {
    let tops = wardrobe.filter(i => i.category === 'top');
    let bottoms = wardrobe.filter(i => i.category === 'bottom');
    let shoes = wardrobe.filter(i => i.category === 'shoes');

    if (mood) {
      const styleTops = tops.filter(t => t.style === mood);
      if (styleTops.length > 0) tops = styleTops;

      const styleBottoms = bottoms.filter(b => b.style === mood);
      if (styleBottoms.length > 0) bottoms = styleBottoms;

      const styleShoes = shoes.filter(s => s.style === mood);
      if (styleShoes.length > 0) shoes = styleShoes;
    }

    if (tops.length > 0 && bottoms.length > 0) {
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

      const newOutfit = [randomTop, randomBottom];

      if (shoes.length > 0) {
        const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];
        newOutfit.push(randomShoes);
      }

      setOutfit(newOutfit);
    } else {
      alert("Naloži vsaj en 'top' in en 'bottom'!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-black">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold">SmartFit AI</h1>
        <label className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer flex gap-2 items-center">
          <Upload size={18} /> Dodaj
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </header>

      <main className="space-y-6">
        <section className="bg-white p-6 rounded-[2rem] shadow-sm">
          <h2 className="font-bold mb-4">Današnji Fit</h2>
          <select onChange={(e) => setMood(e.target.value)} className="w-full p-3 bg-gray-100 rounded-xl mb-4">
            <option value="">Izberi mood...</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
          <button onClick={generateFit} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center gap-2">
            <Sparkles size={20} /> Sestavi Fit
          </button>
          <div className="mt-6 flex flex-col gap-2">
            {outfit.map((item, i) => (
              <div key={i} className="w-full h-56 rounded-2xl border bg-gray-100 p-2 flex items-center justify-center overflow-hidden">
                <img src={item.url} className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-4 flex gap-2 items-center"><LayoutGrid size={18} /> Moja Omara</h2>
          <div className="grid grid-cols-2 gap-2">
            {wardrobe.map(item => (
              <div key={item.id} className="relative bg-gray-100 rounded-xl border p-2 w-full h-36 flex items-center justify-center overflow-hidden">
                <img src={item.url} className="w-full h-full object-contain mix-blend-multiply" />
                <button onClick={() => setWardrobe(wardrobe.filter(i => i.id !== item.id))} className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Nastavitve slike / Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="font-bold text-xl text-center">Dodaj v omaro</h2>

            {previewUrl && (
              <div className="w-full h-48 bg-gray-100 rounded-2xl border p-3 flex items-center justify-center">
                <img src={previewUrl} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm text-gray-600">Kaj si naložil/a?</label>
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                {[
                  { id: 'top', label: 'Zgoraj' },
                  { id: 'bottom', label: 'Spodaj' },
                  { id: 'shoes', label: 'Obutev' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setNewItemCategory(c.id)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${newItemCategory === c.id ? 'bg-white shadow-sm text-black border border-gray-200/60' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm text-gray-600">Kakšen je stil?</label>
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                {[
                  { id: 'casual', label: 'Casual' },
                  { id: 'formal', label: 'Formal' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setNewItemStyle(s.id)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${newItemStyle === s.id ? 'bg-white shadow-sm text-black border border-gray-200/60' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setPreviewUrl(null);
                }}
                className="flex-1 py-3.5 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Prekliči
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 py-3.5 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
              >
                <Sparkles size={18} /> Dodaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}