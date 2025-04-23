import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Palette } from 'lucide-react';

const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#172554', // Navy (dark blue)
  '#78350F', // Brown
  '#404040', // Dark gray
  '#A3A3A3', // Medium gray
  '#E5E5E5', // Light gray
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value || '#000000');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (color: string) => {
    setCurrentColor(color);
    onChange(color);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal flex items-center space-x-2"
        >
          <div 
            className="h-4 w-4 rounded-sm border"
            style={{ backgroundColor: currentColor }}
          />
          <span className="flex-1">{currentColor}</span>
          <Palette className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="color">Color</Label>
              <div 
                className="h-4 w-4 rounded-sm border"
                style={{ backgroundColor: currentColor }}
              />
            </div>
            <Input
              ref={inputRef}
              id="color"
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              className="h-10"
            />
            <Input
              value={currentColor}
              onChange={(e) => {
                const newColor = e.target.value;
                if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor) || /^#([0-9A-F]{6})$/i.test(newColor) || newColor === '') {
                  setCurrentColor(newColor);
                  if (newColor) {
                    onChange(newColor);
                  }
                }
              }}
              placeholder="#000000"
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-8 gap-1">
              {PRESET_COLORS.map((color) => (
                <div
                  key={color}
                  className="cursor-pointer rounded-sm h-5 w-5 border"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetClick(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}