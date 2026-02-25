'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { useWardrobe, Category, Style } from '@/context/WardrobeContext';
import { UploadCloud, X } from 'lucide-react';

const COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Brown', hex: '#964B00' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Pink', hex: '#FFC0CB' },
];

export default function UploadComponent() {
    const { addClothingItem } = useWardrobe();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState<string | null>(null);
    const [category, setCategory] = useState<Category>('Top');
    const [color, setColor] = useState<string>('#000000');
    const [style, setStyle] = useState<Style>('Casual');
    const [isDragging, setIsDragging] = useState(false);

    // Handle file reading
    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        addClothingItem({
            image,
            category,
            color,
            style,
        });

        // Reset form
        setImage(null);
        setCategory('Top');
        setColor('#000000');
        setStyle('Casual');
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Add New Item</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Drag & Drop Zone */}
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isDragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-neutral-500/50 hover:border-white/50 bg-black/20'
                        }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {image ? (
                        <div className="absolute inset-0 w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            <button
                                type="button"
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImage(null);
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <UploadCloud size={48} className="text-neutral-400 mb-4" />
                            <p className="text-sm text-neutral-300 text-center text-balance">
                                Drag & drop your clothing image here or click to browse
                            </p>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Details Form */}
                <div className="space-y-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Top">Top</option>
                            <option value="Bottom">Bottom</option>
                            <option value="Outerwear">Outerwear</option>
                            <option value="Shoes">Shoes</option>
                        </select>
                    </div>

                    {/* Style */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Style</label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value as Style)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Casual">Casual</option>
                            <option value="Formal">Formal</option>
                            <option value="Sport">Sport</option>
                            <option value="Streetwear">Streetwear</option>
                        </select>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    type="button"
                                    title={c.name}
                                    onClick={() => setColor(c.hex)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c.hex ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-neutral-700 hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: c.hex }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!image}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${image
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                        }`}
                >
                    Add to Digital Wardrobe
                </button>
            </form>
        </div>
    );
}
