import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage,
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Update description
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
      updateMetaTag('twitter:description', description);
    }

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update Open Graph tags
    if (title) {
      updateMetaTag('og:title', title, true);
      updateMetaTag('twitter:title', title);
    }

    if (ogType) {
      updateMetaTag('og:type', ogType, true);
    }

    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
      updateMetaTag('twitter:image', ogImage);
    }

    // Update canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.rel = 'canonical';
        document.head.appendChild(linkElement);
      }
      
      linkElement.href = canonical;
    }

    // Handle noindex for player and details pages
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Add structured data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"][data-dynamic]') as HTMLScriptElement;
      
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.setAttribute('data-dynamic', 'true');
        document.head.appendChild(scriptElement);
      }
      
      scriptElement.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Remove dynamic structured data on unmount
      const dynamicScript = document.querySelector('script[type="application/ld+json"][data-dynamic]');
      if (dynamicScript) {
        dynamicScript.remove();
      }
    };
  }, [title, description, keywords, ogType, ogImage, canonical, noindex, structuredData]);
};
