export interface SeoData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  slug: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface ValidationErrors {
  title?: string;
  description?: string;
  slug?: string;
}

// SEO validation limits
export const seoLimits = {
  title: { min: 30, max: 60, optimal: 55 },
  description: { min: 120, max: 160, optimal: 155 },
  slug: { max: 75 },
};

export const getCharacterCountColor = (
  field: 'title' | 'description',
  length: number
) => {
  const limit = seoLimits[field];
  if (length < limit.min) return 'text-red-500';
  if (length > limit.optimal) return 'text-yellow-500';
  if (length > limit.max) return 'text-red-500';
  return 'text-green-500';
};
