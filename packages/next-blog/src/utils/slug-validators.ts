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

export const validateField = (field: keyof SeoData, value: string) => {
  const newErrors: ValidationErrors = {};
  switch (field) {
    case 'title':
      if (value.length < seoLimits.title.min) {
        newErrors.title = `Title too short (min ${seoLimits.title.min} characters)`;
      } else if (value.length > seoLimits.title.max) {
        newErrors.title = `Title too long (max ${seoLimits.title.max} characters)`;
      } else {
        delete newErrors.title;
      }
      break;
    case 'description':
      if (value.length < seoLimits.description.min) {
        newErrors.description = `Description too short (min ${seoLimits.description.min} characters)`;
      } else if (value.length > seoLimits.description.max) {
        newErrors.description = `Description too long (max ${seoLimits.description.max} characters)`;
      } else {
        delete newErrors.description;
      }
      break;
    case 'slug':
      if (value.length > seoLimits.slug.max) {
        newErrors.slug = `Slug too long (max ${seoLimits.slug.max} characters)`;
      } else if (value && !/^[a-z0-9-]+$/.test(value)) {
        newErrors.slug =
          'Slug can only contain lowercase letters, numbers, and hyphens';
      } else {
        delete newErrors.slug;
      }
      break;
  }
  return newErrors;
};

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
