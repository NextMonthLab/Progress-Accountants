import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value || '#000000');
  const [isOpen, setIsOpen] = useState(false);
  const presetColors = [
    '#000000', '#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4',
    '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
  ];

  useEffect(() => {
    setColor(value || '#000000');
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (presetColor: string) => {
    setColor(presetColor);
    onChange(presetColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-sm border"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div>
            <Label htmlFor="color-input">Color</Label>
            <Input
              id="color-input"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-full h-10 p-1"
            />
          </div>
          <div>
            <Label htmlFor="hex-input">Hex</Label>
            <Input
              id="hex-input"
              type="text"
              value={color}
              onChange={handleColorChange}
              className="font-mono"
            />
          </div>
          <div className="pt-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-8 gap-1 mt-1.5">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className="w-5 h-5 rounded-sm border"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetClick(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}