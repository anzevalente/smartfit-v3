'use client';

import React from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { Trash2 } from 'lucide-react';

export default function WardrobeGrid() {
    const { clothes, removeClothingItem } = useWardrobe();

    if (clothes.length === 0) {
        return (
            <div className="w-full text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-neutral-400">Your wardrobe is empty. Start by uploading some clothes!</p>
            </div>
        );
    }

    return (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {clothes.map((item) => (
                <div
                    key={item.id}
                    className="group relative bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 aspect-square"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.category} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <span className="text-white font-medium text-sm drop-shadow-md">{item.category}</span>
                        <span className="text-neutral-300 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full border border-white/50" style={{ backgroundColor: item.color }} />
                            {item.style}
                        </span>

                        <button
                            onClick={() => removeClothingItem(item.id)}
                            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-md transition-colors"
                            title="Delete item"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
