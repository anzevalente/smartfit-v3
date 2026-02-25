'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Category = 'Top' | 'Bottom' | 'Outerwear' | 'Shoes';
export type Style = 'Casual' | 'Formal' | 'Sport' | 'Streetwear';
export type Mood = 'I feel Professional' | 'I feel Relaxed' | 'Date Night' | 'Experimental';

export interface ClothingItem {
    id: string;
    image: string; // Base64 or object URL
    category: Category;
    color: string; // Hex or color name
    style: Style;
    timestamp: number;
}

export interface Outfit {
    Top?: ClothingItem;
    Bottom?: ClothingItem;
    Outerwear?: ClothingItem;
    Shoes?: ClothingItem;
}

interface WardrobeContextType {
    clothes: ClothingItem[];
    addClothingItem: (item: Omit<ClothingItem, 'id' | 'timestamp'>) => void;
    removeClothingItem: (id: string) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: ReactNode }) {
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedClothes = localStorage.getItem('smartfit_wardrobe');
        if (savedClothes) {
            try {
                setClothes(JSON.parse(savedClothes));
            } catch (e) {
                console.error("Failed to parse wardrobe from localStorage");
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever clothes change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('smartfit_wardrobe', JSON.stringify(clothes));
        }
    }, [clothes, isLoaded]);

    const addClothingItem = (itemData: Omit<ClothingItem, 'id' | 'timestamp'>) => {
        const newItem: ClothingItem = {
            ...itemData,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };
        setClothes(prev => [...prev, newItem]);
    };

    const removeClothingItem = (id: string) => {
        setClothes(prev => prev.filter(item => item.id !== id));
    };

    return (
        <WardrobeContext.Provider value={{ clothes, addClothingItem, removeClothingItem }}>
            {children}
        </WardrobeContext.Provider>
    );
}

export function useWardrobe() {
    const context = useContext(WardrobeContext);
    if (context === undefined) {
        throw new Error('useWardrobe must be used within a WardrobeProvider');
    }
    return context;
}
