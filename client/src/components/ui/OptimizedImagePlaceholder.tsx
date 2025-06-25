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

// Gold Standard v2 Image Components - Perfect aspect ratios, zero letterboxing
export const OptimizedPodcastStudio = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900">
    <OptimizedImage 
      src={podcastStudioImg} 
      alt="Professional broadcast-quality podcast and video studio featuring acoustic treatment and professional equipment"
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out"
      style={{
        aspectRatio: '3/2',
        objectPosition: 'center 40%',
        filter: 'contrast(1.08) saturate(1.15) brightness(1.02)'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5"></div>
  </div>
);

export const OptimizedDashboardMockup = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900">
    <OptimizedImage 
      src={teamPhotoImg} 
      alt="Real-time financial dashboard showing business analytics, KPIs, and performance metrics for data-driven decisions"
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out"
      style={{
        aspectRatio: '3/2',
        objectPosition: 'center 35%',
        filter: 'contrast(1.08) saturate(1.15) brightness(1.02)'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5"></div>
  </div>
);

export const OptimizedStrategySession = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900">
    <OptimizedImage 
      src={strategySessionImg} 
      alt="Strategic business planning session with Virtual Finance Director providing expert financial guidance and growth strategies"
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out"
      style={{
        aspectRatio: '3/2',
        objectPosition: 'center 30%',
        filter: 'contrast(1.08) saturate(1.15) brightness(1.02)'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5"></div>
  </div>
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