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

// Rob Hutt Production-Grade Image Components - Consistent aspect ratios, no letterboxing
export const OptimizedPodcastStudio = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900">
    <OptimizedImage 
      src={podcastStudioImg} 
      alt="Professional Podcast and Video Studio with broadcast-quality equipment and acoustic treatment"
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out"
      style={{
        aspectRatio: '3/2',
        filter: 'contrast(1.05) saturate(1.1)'
      }}
    />
    {/* Subtle gradient overlay for text legibility */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
  </div>
);

export const OptimizedDashboardMockup = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900">
    <OptimizedImage 
      src={teamPhotoImg} 
      alt="Custom Financial Dashboard displaying real-time business analytics and key performance indicators"
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out"
      style={{
        aspectRatio: '3/2',
        filter: 'contrast(1.05) saturate(1.1)'
      }}
    />
    {/* Professional overlay matching hero section */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
  </div>
);

export const OptimizedStrategySession = () => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900">
    <OptimizedImage 
      src={strategySessionImg} 
      alt="Strategic Financial Planning Session with Virtual Finance Director providing expert business guidance"
      width={600}
      height={400}
      className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out"
      style={{
        aspectRatio: '3/2',
        filter: 'contrast(1.05) saturate(1.1)'
      }}
    />
    {/* Gold Standard overlay treatment */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
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