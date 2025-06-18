import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
  '#795548', // Brown
  '#607d8b', // Blue Grey
  // Add your brand colors
  '#0c2340', // Navy Blue (Progress Accountants main color)
  '#ff6b35', // Burnt Orange (Progress Accountants accent color)
];

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export function ColorPicker({ 
  value = '#000000', 
  onChange, 
  presetColors = PRESET_COLORS 
}: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setColor(value);
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-10"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded border border-input"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="color-picker">Color</Label>
            <Input
              id="color-picker"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor) => (
                <div
                  key={presetColor}
                  className={cn(
                    "h-6 w-6 cursor-pointer rounded-md border border-input",
                    color === presetColor && "ring-2 ring-offset-2 ring-ring"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetClick(presetColor)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hex">Hex</Label>
            <Input
              id="hex"
              value={color}
              onChange={handleColorChange}
              className="h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}