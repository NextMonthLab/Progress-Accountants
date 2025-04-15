import React from 'react';

// SVG Placeholder Template
interface PlaceholderProps {
  width?: string;
  height?: string;
  text: string;
  color?: string;
  bgColor?: string;
}

export const ImagePlaceholder: React.FC<PlaceholderProps> = ({
  width = '100%',
  height = '100%',
  text,
  color = '#ffffff',
  bgColor = '#1a365d' // Navy blue
}) => {
  return (
    <div 
      style={{
        width,
        height,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '4px',
        backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
        backgroundSize: '50px 50px',
      }}
    >
      {text}
    </div>
  );
};

// Create specific image placeholders
export const heroTeamPhoto = () => (
  <ImagePlaceholder height="300px" text="Team Photo" />
);

export const toolsPodcastStudio = () => (
  <ImagePlaceholder height="200px" text="Podcast Studio" />
);

export const toolsDashboardMockup = () => (
  <ImagePlaceholder height="200px" text="Financial Dashboard" bgColor="#f27030" /> // Burnt orange
);

export const toolsStrategySession = () => (
  <ImagePlaceholder height="200px" text="Strategy Session" />
);

export const industryFilm = () => (
  <ImagePlaceholder height="160px" text="Film Industry" />
);

export const industryMusic = () => (
  <ImagePlaceholder height="160px" text="Music Industry" bgColor="#f27030" /> // Burnt orange
);

export const industryConstruction = () => (
  <ImagePlaceholder height="160px" text="Construction Industry" />
);

export const testimonialClient = () => (
  <ImagePlaceholder height="120px" width="120px" text="Client" />
);

export const footerBanburyTown = () => (
  <ImagePlaceholder height="180px" text="Banbury Town" />
);

export const footerOfficeFront = () => (
  <ImagePlaceholder height="180px" text="Office Front" bgColor="#f27030" /> // Burnt orange
);