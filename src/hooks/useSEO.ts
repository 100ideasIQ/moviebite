
import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update document title
    document.title = config.title;

    // Create or update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Standard meta tags
    updateMetaTag('description', config.description);
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', config.title, true);
    updateMetaTag('og:description', config.description, true);
    updateMetaTag('og:type', config.ogType || 'website', true);
    if (config.ogImage) {
      updateMetaTag('og:image', config.ogImage, true);
    }

    // Twitter tags
    updateMetaTag('twitter:title', config.title);
    updateMetaTag('twitter:description', config.description);
    if (config.ogImage) {
      updateMetaTag('twitter:image', config.ogImage);
    }

    // Canonical URL
    if (config.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = config.canonical;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'CinemaStream - Watch Movies & TV Shows';
    };
  }, [config]);
};
