import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ImagePlaceholder } from '../../assets/imagePlaceholders';
import podcastStudioImage from '../../assets/images/podcast_studio.jpg';
import strategySessionImage from '../../assets/images/strategy_session.jpg';
import teamPhotoImage from '../../assets/images/team_photo.jpg';
import filmIndustryImage from '../../assets/images/film_industry.png';
import musicIndustryImage from '../../assets/images/music_industry.png';
import constructionIndustryImage from '../../assets/images/construction_industry.png';
import financialDashboardImage from '../../assets/images/new_financial_dashboard.png';

// Import available assets
import podcastStudioImg from "@assets/Podcast Studio.jpg";
import strategySessionImg from "@assets/Strategy Session.jpg";
import teamPhotoImg from "@assets/Team Photo.jpg";

// Optimized version of image placeholders
export const OptimizedPodcastStudio = () => (
  <OptimizedImage 
    src={podcastStudioImg} 
    alt="Podcast and Video Studio"
    width={400}
    height={240}
    className="w-full h-full object-cover object-center"
  />
);

export const OptimizedDashboardMockup = () => (
  <OptimizedImage 
    src={teamPhotoImg} 
    alt="Financial Dashboard with Revenue Analytics"
    width={400}
    height={240}
    className="w-full h-full object-cover object-center"
  />
);

export const OptimizedStrategySession = () => (
  <OptimizedImage 
    src={strategySessionImg} 
    alt="Strategy Session with Financial Advisors"
    width={400}
    height={240}
    className="w-full h-full object-cover object-center"
  />
);

export const OptimizedTeamPhoto = () => (
  <OptimizedImage 
    src={teamPhotoImage} 
    alt="Progress Accountants Team"
    width={800}
    height={400}
    className="w-full h-full object-cover"
    priority={true}
  />
);

export const OptimizedFilmIndustry = () => (
  <OptimizedImage 
    src={filmIndustryImage} 
    alt="Film Industry"
    width={320}
    height={160}
    className="w-full h-full object-cover"
  />
);

export const OptimizedMusicIndustry = () => (
  <OptimizedImage 
    src={musicIndustryImage} 
    alt="Music Industry"
    width={320}
    height={160}
    className="w-full h-full object-cover"
  />
);

export const OptimizedConstructionIndustry = () => (
  <OptimizedImage 
    src={constructionIndustryImage} 
    alt="Construction Industry"
    width={320}
    height={160}
    className="w-full h-full object-cover"
  />
);