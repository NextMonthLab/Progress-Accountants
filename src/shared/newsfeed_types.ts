// Enum for different types of newsfeed sources
export enum NewsfeedSource {
  RSS = "rss",
  API = "api",
  CUSTOM = "custom"
}

// Industry categories for predefined newsfeeds
export enum IndustryCategory {
  ACCOUNTING = "accounting",
  LEGAL = "legal", 
  CONSTRUCTION = "construction",
  HEALTHCARE = "healthcare",
  TECHNOLOGY = "technology",
  FINANCE = "finance",
  MARKETING = "marketing",
  REALESTATE = "realestate",
  RETAIL = "retail",
  EDUCATION = "education",
  HOSPITALITY = "hospitality",
  MANUFACTURING = "manufacturing"
}

// Feed display settings
export interface FeedDisplaySettings {
  showImages: boolean;
  itemCount: number; // Number of items to display
  refreshInterval: number; // Minutes between refreshes
  showCategories: boolean;
  showPublishDate: boolean;
}

// Newsfeed configuration
export interface NewsfeedConfig {
  source: NewsfeedSource;
  url: string;
  industry?: IndustryCategory;
  customName?: string;
  apiKey?: string;
  authentication?: {
    username?: string;
    password?: string;
    token?: string;
  };
  displaySettings: FeedDisplaySettings;
  lastFetched?: Date;
  parseConfig?: {
    itemSelector?: string;
    titleSelector?: string;
    descriptionSelector?: string;
    linkSelector?: string;
    imageSelector?: string;
    dateSelector?: string;
    categorySelector?: string;
  };
}

// News item interface
export interface NewsItem {
  id: string | number;
  title: string;
  excerpt: string;
  link: string;
  category?: string;
  publishDate?: string;
  imageUrl?: string;
  source?: string;
}

// Predefined news feeds by industry
export const PREDEFINED_FEEDS: Record<IndustryCategory, NewsfeedConfig> = {
  [IndustryCategory.ACCOUNTING]: {
    source: NewsfeedSource.RSS,
    url: "https://www.accountingtoday.com/feed",
    industry: IndustryCategory.ACCOUNTING,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.LEGAL]: {
    source: NewsfeedSource.RSS,
    url: "https://www.law.com/feed/",
    industry: IndustryCategory.LEGAL,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.CONSTRUCTION]: {
    source: NewsfeedSource.RSS,
    url: "https://www.constructiondive.com/feeds/news/",
    industry: IndustryCategory.CONSTRUCTION,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.HEALTHCARE]: {
    source: NewsfeedSource.RSS,
    url: "https://www.healthcareitnews.com/news/feed",
    industry: IndustryCategory.HEALTHCARE,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.TECHNOLOGY]: {
    source: NewsfeedSource.RSS,
    url: "https://www.techrepublic.com/rssfeeds/articles/",
    industry: IndustryCategory.TECHNOLOGY,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.FINANCE]: {
    source: NewsfeedSource.RSS,
    url: "https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline",
    industry: IndustryCategory.FINANCE,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.MARKETING]: {
    source: NewsfeedSource.RSS,
    url: "https://www.marketingdive.com/feeds/news/",
    industry: IndustryCategory.MARKETING,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.REALESTATE]: {
    source: NewsfeedSource.RSS,
    url: "https://www.inman.com/feed/",
    industry: IndustryCategory.REALESTATE,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.RETAIL]: {
    source: NewsfeedSource.RSS,
    url: "https://www.retaildive.com/feeds/news/",
    industry: IndustryCategory.RETAIL,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.EDUCATION]: {
    source: NewsfeedSource.RSS,
    url: "https://www.educationdive.com/feeds/news/",
    industry: IndustryCategory.EDUCATION,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.HOSPITALITY]: {
    source: NewsfeedSource.RSS,
    url: "https://www.hotelmanagement.net/rss.xml",
    industry: IndustryCategory.HOSPITALITY,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  },
  [IndustryCategory.MANUFACTURING]: {
    source: NewsfeedSource.RSS,
    url: "https://www.industryweek.com/taxonomy/term/6711/feed",
    industry: IndustryCategory.MANUFACTURING,
    displaySettings: {
      showImages: true,
      itemCount: 5,
      refreshInterval: 60,
      showCategories: true,
      showPublishDate: true
    }
  }
};