import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowRightLeft, MessageSquare } from 'lucide-react';

interface ContentGenerationControlsProps {
  lengthValue: number[];
  setLengthValue: (value: number[]) => void;
  toneValue: number[];
  setToneValue: (value: number[]) => void;
  className?: string;
}

export function ContentGenerationControls({
  lengthValue,
  setLengthValue,
  toneValue,
  setToneValue,
  className = '',
}: ContentGenerationControlsProps) {
  // Convert tone value to readable label
  const getToneLabel = (value: number): string => {
    if (value <= 25) return 'Professional';
    if (value <= 50) return 'Neutral';
    if (value <= 75) return 'Friendly';
    return 'Casual';
  };

  // Convert length value to readable label
  const getLengthLabel = (value: number): string => {
    if (value <= 25) return 'Concise';
    if (value <= 50) return 'Moderate';
    if (value <= 75) return 'Detailed';
    return 'Comprehensive';
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#008080]" />
          Content Generation Controls
        </CardTitle>
        <CardDescription>Adjust how your content is generated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tone Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="tone-slider" className="text-sm">Tone of Voice</Label>
            <span className="text-sm text-[#008080] font-medium">
              {getToneLabel(toneValue[0])}
            </span>
          </div>
          
          <div className="relative pb-6">
            <Slider
              id="tone-slider"
              max={100}
              step={1}
              value={toneValue}
              onValueChange={setToneValue}
              className="bg-gradient-to-r from-blue-600 to-pink-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1 absolute w-full">
              <span>Professional</span>
              <span>Neutral</span>
              <span>Friendly</span>
              <span>Casual</span>
            </div>
          </div>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="length-slider" className="text-sm">Content Length</Label>
            <span className="text-sm text-[#008080] font-medium">
              {getLengthLabel(lengthValue[0])}
            </span>
          </div>
          
          <div className="relative pb-6">
            <Slider
              id="length-slider"
              max={100}
              step={1}
              value={lengthValue}
              onValueChange={setLengthValue}
              className="bg-gradient-to-r from-green-500 to-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1 absolute w-full">
              <span>Concise</span>
              <span>Moderate</span>
              <span>Detailed</span>
              <span>Comprehensive</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}