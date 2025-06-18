import React from 'react';
import strategySessionImage from './images/strategy_session.jpg';
import podcastStudioImage from './images/podcast_studio.jpg';
import teamPhotoImage from './images/team_photo.jpg';
import filmIndustryImage from './images/film_industry.png';
import musicIndustryImage from './images/music_industry.png';
import constructionIndustryImage from './images/construction_industry.png';

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
  <img 
    src={teamPhotoImage} 
    alt="Progress Accountants Team"
    style={{ 
      height: "300px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "4px"
    }}
  />
);

export const toolsPodcastStudio = () => (
  <img 
    src={podcastStudioImage} 
    alt="Podcast and Video Studio"
    style={{ 
      height: "200px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "4px"
    }}
  />
);

export const toolsDashboardMockup = () => (
  <ImagePlaceholder height="200px" text="Financial Dashboard" bgColor="#F65C9A" /> // NextMonth Pink
);

export const toolsStrategySession = () => (
  <img 
    src={strategySessionImage} 
    alt="Strategy Session with Financial Advisors"
    style={{ 
      height: "200px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "4px"
    }}
  />
);

export const industryFilm = () => (
  <img 
    src={filmIndustryImage} 
    alt="Film Industry"
    style={{ 
      height: "160px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "4px"
    }}
  />
);

export const industryMusic = () => (
  <img 
    src={musicIndustryImage} 
    alt="Music Industry"
    style={{ 
      height: "160px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "4px"
    }}
  />
);

export const industryConstruction = () => (
  <img 
    src={constructionIndustryImage} 
    alt="Construction Industry"
    style={{ 
      height: "160px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "4px"
    }}
  />
);

export const testimonialClient = () => (
  <ImagePlaceholder height="120px" width="120px" text="Client" />
);

export const footerBanburyTown = () => (
  <ImagePlaceholder height="180px" text="Banbury Town" />
);

export const footerOfficeFront = () => (
  <ImagePlaceholder height="180px" text="Office Front" bgColor="#3CBFAE" /> // NextMonth Teal
);