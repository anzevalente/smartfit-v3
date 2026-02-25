'use client';

import React, { useState } from 'react';
import { useWardrobe, Mood, Outfit, ClothingItem } from '@/context/WardrobeContext';
import { Sparkles } from 'lucide-react';

const MOODS: Mood[] = [
    'I feel Professional',
    'I feel Relaxed',
    'Date Night',
    'Experimental',
];

export default function OutfitGenerator() {
    const { clothes } = useWardrobe();
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [generatedOutfit, setGeneratedOutfit] = useState<Outfit | null>(null);
    const [error, setError] = useState<string | null>(null);

    const matchOutfit = (mood: Mood) => {
        setError(null);
        setGeneratedOutfit(null);

        // 1. Filter clothes based on mood mappings
        let allowedStyles: string[] = [];
        switch (mood) {
            case 'I feel Professional':
                allowedStyles = ['Formal'];
                break;
            case 'I feel Relaxed':
                allowedStyles = ['Casual', 'Sport'];
                break;
            case 'Date Night':
                allowedStyles = ['Formal', 'Streetwear'];
                break;
            case 'Experimental':
                allowedStyles = ['Casual', 'Formal', 'Sport', 'Streetwear'];
                break;
        }

        const availableClothes = clothes.filter((item) => allowedStyles.includes(item.style));

        const tops = availableClothes.filter((i) => i.category === 'Top');
        const bottoms = availableClothes.filter((i) => i.category === 'Bottom');
        const outerwear = availableClothes.filter((i) => i.category === 'Outerwear');
        const shoes = availableClothes.filter((i) => i.category === 'Shoes');

        // Basic Validation
        if (tops.length === 0 || bottoms.length === 0) {
            setError(`Not enough clothes for "${mood}". Please upload more items!`);
            return;
        }

        // Smart Selection (Simple MVP Logic)
        // 1. Pick a Top randomly from available pool
        const selectedTop = tops[Math.floor(Math.random() * tops.length)];

        // 2. Color Cohesion Helper: Very simplified logic to avoid clashing (unless Experimental)
        // In a real app, we'd use hex proximity or predefined complementary pairs.
        // For MVP, we will try to find a bottom that isn't the exact same neon color, or just pick random if anything goes.

        let validBottoms = bottoms;
        if (mood !== 'Experimental') {
            validBottoms = bottoms.filter(b => b.color !== selectedTop.color || b.color === '#000000' || b.color === '#FFFFFF');
            if (validBottoms.length === 0) validBottoms = bottoms; // Fallback to any if strict fails
        }

        const selectedBottom = validBottoms[Math.floor(Math.random() * validBottoms.length)];

        // 3. Layering (Outerwear) - Only add if it exists and looks good (e.g. Formal prefers outerwear)
        let selectedOuterwear: ClothingItem | undefined = undefined;
        if (outerwear.length > 0) {
            // 50% chance to layer, or 100% if Formal
            if (mood === 'I feel Professional' || Math.random() > 0.5) {
                selectedOuterwear = outerwear[Math.floor(Math.random() * outerwear.length)];
            }
        }

        // 4. Shoes Check
        const selectedShoes = shoes.length > 0
            ? shoes[Math.floor(Math.random() * shoes.length)]
            : undefined;

        setGeneratedOutfit({
            Top: selectedTop,
            Bottom: selectedBottom,
            Outerwear: selectedOuterwear,
            Shoes: selectedShoes,
        });
    };

    const ClothingCard = ({ item, label }: { item: ClothingItem | undefined; label: string }) => {
        if (!item) return null;
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={label} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-neutral-400 font-medium">{label}</span>
            </div>
        );
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-white text-center flex items-center justify-center gap-2">
                <Sparkles className="text-indigo-400" />
                Smart Fit
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-8">
                {MOODS.map((mood) => (
                    <button
                        key={mood}
                        onClick={() => {
                            setSelectedMood(mood);
                            matchOutfit(mood);
                        }}
                        className={`py-4 px-2 rounded-xl text-sm font-semibold transition-all border ${selectedMood === mood
                                ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/40 text-white'
                                : 'bg-black/30 border-white/10 text-neutral-300 hover:bg-black/50 hover:border-white/30'
                            }`}
                    >
                        {mood}
                    </button>
                ))}
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300 text-center text-sm">
                    {error}
                </div>
            )}

            {generatedOutfit && !error && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-center text-neutral-200 font-medium mb-6">Your Outfit for the Day</h3>
                    <div className="flex flex-wrap justify-center gap-6">
                        <ClothingCard item={generatedOutfit.Outerwear} label="Outerwear" />
                        <ClothingCard item={generatedOutfit.Top} label="Top" />
                        <ClothingCard item={generatedOutfit.Bottom} label="Bottom" />
                        <ClothingCard item={generatedOutfit.Shoes} label="Shoes" />
                    </div>
                </div>
            )}
        </div>
    );
}
