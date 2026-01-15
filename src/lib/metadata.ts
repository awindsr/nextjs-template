import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface MetadataParams {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  restaurantName?: string;
  cuisine?: string;
  location?: string;
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = `${siteConfig.url}${siteConfig.ogImage}`,
  noIndex = false,
  canonical,
  restaurantName,
  cuisine,
  location,
}: MetadataParams = {}): Metadata {
  const enhancedDescription = restaurantName
    ? `${restaurantName}${cuisine ? ` - ${cuisine} cuisine` : ''}${location ? ` in ${location}` : ''}. ${description}`
    : description;

  const enhancedKeywords = [
    ...siteConfig.keywords,
    ...(restaurantName ? [restaurantName] : []),
    ...(cuisine ? [`${cuisine} restaurant`, `${cuisine} food`, `${cuisine} cuisine`] : []),
    ...(location ? [`restaurant ${location}`, `food ${location}`, `dining ${location}`] : []),
  ];

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: enhancedDescription,
    keywords: enhancedKeywords,
    authors: [
      {
        name: siteConfig.creator,
        url: siteConfig.url,
      },
    ],
    creator: siteConfig.creator,
    category: 'Food & Dining',
    classification: 'Restaurant Website',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical || siteConfig.url,
      title,
      description: enhancedDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - Restaurant Website`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: enhancedDescription,
      images: [image],
      creator: '@foodo',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || siteConfig.url,
    },
    other: {
      'application-name': siteConfig.shortName,
      'apple-mobile-web-app-title': siteConfig.shortName,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=yes',
      'mobile-web-app-capable': 'yes',
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function constructMenuMetadata(restaurantName: string, menuCategory?: string): Metadata {
  const title = menuCategory
    ? `${menuCategory} Menu - ${restaurantName}`
    : `Menu - ${restaurantName}`;

  return constructMetadata({
    title,
    description: `Browse ${restaurantName}'s ${menuCategory || 'full'} menu. Order online for delivery or pickup, or reserve a table.`,
    restaurantName,
  });
}

export function constructReservationMetadata(restaurantName: string): Metadata {
  return constructMetadata({
    title: `Reserve a Table - ${restaurantName}`,
    description: `Book a table at ${restaurantName}. Easy online reservation system for the best dining experience.`,
    restaurantName,
  });
}

export function constructOrderingMetadata(restaurantName: string): Metadata {
  return constructMetadata({
    title: `Order Online - ${restaurantName}`,
    description: `Order food online from ${restaurantName}. Fast delivery and easy pickup. Browse our menu and order now.`,
    restaurantName,
  });
}
