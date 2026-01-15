export const siteConfig = {
  name: 'Foodo - Restaurant Website Template',
  shortName: 'Foodo',
  description: 'Restaurant website template.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/yourusername/foodo',
  },
  creator: 'Foodo Team',
  keywords: [
    'restaurant landing page',
    'digital menu',
    'online food ordering',
    'table reservation',
    'restaurant online ordering system',
    'React restaurant website',
    'modern restaurant website',
    'QR code menu',
    'contactless ordering',
    'restaurant table booking',
    'food delivery website',
    'restaurant menu online',
    'restaurant website builder',
    'cafe website',
    'bar website',
    'food business website',
    'hospitality website',
  ],
  features: {
    onlineOrdering: true,
    tableReservation: true,
    digitalMenu: true,
    qrCodeMenu: true,
    deliveryTracking: true,
  },
  defaultBranding: {
    primaryColor: '#e11d48',
    accentColor: '#f97316',
  },
} as const;

export type SiteConfig = typeof siteConfig;
