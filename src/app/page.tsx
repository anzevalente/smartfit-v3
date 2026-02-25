"use client";
import React, { useState, useEffect } from 'react';
import { Upload, Sparkles, Trash2, LayoutGrid } from 'lucide-react';

export default function SmartWardrobe() {
  const [wardrobe, setWardrobe] = useState<any[]>([]);
  const [outfit, setOutfit] = useState<any[]>([]);
  const [mood, setMood] = useState('');

  // Shranjevanje v brskalnik
  useEffect(() => {
    const saved = localStorage.getItem('my-wardrobe');
    if (saved) setWardrobe(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('my-wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const cat = prompt("Kategorija? (top / bottom / shoes)");
        const stl = prompt("Stil? (casual / formal)");
        if (cat) {
          setWardrobe([...wardrobe, { id: Date.now(), url: reader.result, category: cat, style: stl }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFit = () => {
    const tops = wardrobe.filter(i => i.category === 'top');
    const bottoms = wardrobe.filter(i => i.category === 'bottom');
    if (tops.length > 0 && bottoms.length > 0) {
      const selectedTop = tops.find(t => t.style === mood) || tops[0];
      const selectedBottom = bottoms.find(b => b.style === mood) || bottoms[0];
      setOutfit([selectedTop, selectedBottom]);
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
              <img key={i} src={item.url} className="w-full h-48 object-cover rounded-2xl border" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-4 flex gap-2 items-center"><LayoutGrid size={18} /> Moja Omara</h2>
          <div className="grid grid-cols-2 gap-2">
            {wardrobe.map(item => (
              <div key={item.id} className="relative">
                <img src={item.url} className="w-full h-32 object-cover rounded-xl border" />
                <button onClick={() => setWardrobe(wardrobe.filter(i => i.id !== item.id))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}