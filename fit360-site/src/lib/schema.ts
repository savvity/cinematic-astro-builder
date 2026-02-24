// src/lib/schema.ts -- All JSON-LD schema builders. Import and use in every page.

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
        '@id': 'https://fit360.studio/#business',
        name: 'FIT360',
        description:
          'Science-backed personal training and health coaching studio in Kharadi, Pune. Specialized programs for PCOD, diabetes, back pain, and weight management.',
        url: 'https://fit360.studio/',
        telephone: '+917397951908',
        email: 'fit360kharadi@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Grant Rd, EON Free Zone',
          addressLocality: 'Kharadi',
          addressRegion: 'Pune',
          postalCode: '411014',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 18.5514,
          longitude: 73.9437,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '06:00',
            closes: '20:00',
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.6',
          reviewCount: '14',
          bestRating: '5',
          worstRating: '1',
        },
        priceRange: '$$',
        sameAs: [],
        image: 'https://fit360.studio/images/hero.webp',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://fit360.studio/#website',
        url: 'https://fit360.studio/',
        name: 'FIT360',
        publisher: { '@id': 'https://fit360.studio/#business' },
      },
    ],
  };
}

export function orgSchema(b: { name: string; url: string; logo: string; description: string }) {
  return {
    '@type': 'Organization',
    '@id': `${b.url}/#organization`,
    name: b.name,
    url: b.url,
    logo: { '@type': 'ImageObject', url: `${b.url}${b.logo}` },
    description: b.description,
    sameAs: [],
  };
}

export function homePageSchema(
  b: { name: string; description: string; url: string; logo: string },
  ogImage: string,
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${b.url}/#website`,
        url: b.url,
        name: b.name,
        description: b.description,
      },
      orgSchema(b),
      {
        '@type': 'WebPage',
        '@id': `${b.url}/#webpage`,
        url: b.url,
        name: `${b.name} | Personal Training Studio in Kharadi, Pune`,
        isPartOf: { '@id': `${b.url}/#website` },
        about: { '@id': `${b.url}/#organization` },
        description: b.description,
        inLanguage: 'en-US',
        primaryImageOfPage: { '@type': 'ImageObject', url: `${b.url}${ogImage}` },
      },
    ],
  };
}

export function servicePageSchema(
  b: { name: string; url: string; logo: string; description: string },
  service: { name: string; slug: string; description: string },
  faqs?: { question: string; answer: string }[],
) {
  const pageUrl = `${b.url}/${service.slug}/`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
      '@id': `${b.url}/#business`,
      name: b.name,
      url: b.url,
      telephone: '+917397951908',
      email: 'fit360kharadi@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Grant Rd, EON Free Zone',
        addressLocality: 'Kharadi',
        addressRegion: 'Pune',
        postalCode: '411014',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: service.name,
      description: service.description,
      provider: { '@id': `${b.url}/#business` },
      url: pageUrl,
      areaServed: {
        '@type': 'City',
        name: 'Pune',
        containedInPlace: { '@type': 'State', name: 'Maharashtra' },
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: `${service.name} — ${b.name}`,
      isPartOf: { '@id': `${b.url}/#website` },
      description: service.description,
      inLanguage: 'en-US',
    },
    breadcrumbSchema(b.url, [
      { name: 'Home', url: b.url + '/' },
      { name: service.name, url: pageUrl },
    ]),
  ];

  if (faqs && faqs.length > 0) {
    graph.push(faqSchema(faqs));
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function medicalBusinessPageSchema(
  b: { name: string; url: string; logo: string; description: string },
  page: { name: string; slug: string; description: string },
  faqs?: { question: string; answer: string }[],
) {
  const pageUrl = `${b.url}/${page.slug}/`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': ['LocalBusiness', 'MedicalBusiness'],
      '@id': `${b.url}/#business`,
      name: b.name,
      url: b.url,
      telephone: '+917397951908',
      email: 'fit360kharadi@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Grant Rd, EON Free Zone',
        addressLocality: 'Kharadi',
        addressRegion: 'Pune',
        postalCode: '411014',
        addressCountry: 'IN',
      },
      medicalSpecialty: 'PhysicalMedicine',
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: `${page.name} — ${b.name}`,
      isPartOf: { '@id': `${b.url}/#website` },
      description: page.description,
      inLanguage: 'en-US',
    },
    breadcrumbSchema(b.url, [
      { name: 'Home', url: b.url + '/' },
      { name: page.name, url: pageUrl },
    ]),
  ];

  if (faqs && faqs.length > 0) {
    graph.push(faqSchema(faqs));
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function aboutPageSchema(b: {
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingYear?: number;
}) {
  const pageUrl = `${b.url}/about/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
        '@id': `${b.url}/#business`,
        name: b.name,
        url: b.url,
        ...(b.foundingYear ? { foundingDate: String(b.foundingYear) } : {}),
        description: b.description,
        telephone: '+917397951908',
        email: 'fit360kharadi@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Grant Rd, EON Free Zone',
          addressLocality: 'Kharadi',
          addressRegion: 'Pune',
          postalCode: '411014',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `About FIT360 | Personal Training Studio in Kharadi, Pune`,
        isPartOf: { '@id': `${b.url}/#website` },
        about: { '@id': `${b.url}/#business` },
        description: `Learn about FIT360 — ${b.description}`,
        inLanguage: 'en-US',
      },
      breadcrumbSchema(b.url, [
        { name: 'Home', url: b.url + '/' },
        { name: 'About', url: pageUrl },
      ]),
    ],
  };
}

export function contactPageSchema(b: { name: string; url: string; logo: string; description: string }) {
  const pageUrl = `${b.url}/contact/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
        '@id': `${b.url}/#business`,
        name: b.name,
        url: b.url,
        telephone: '+917397951908',
        email: 'fit360kharadi@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Grant Rd, EON Free Zone',
          addressLocality: 'Kharadi',
          addressRegion: 'Pune',
          postalCode: '411014',
          addressCountry: 'IN',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '06:00',
            closes: '20:00',
          },
        ],
      },
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Contact FIT360 | Book a Free Consultation in Kharadi, Pune`,
        isPartOf: { '@id': `${b.url}/#website` },
        description: 'Contact FIT360 in Kharadi, Pune. Book your free fitness consultation.',
        inLanguage: 'en-US',
      },
      breadcrumbSchema(b.url, [
        { name: 'Home', url: b.url + '/' },
        { name: 'Contact', url: pageUrl },
      ]),
    ],
  };
}

export function blogIndexSchema(b: { name: string; url: string; logo: string; description: string }) {
  const pageUrl = `${b.url}/blog/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `FIT360 Blog | Fitness, Nutrition, and Health Advice for Pune`,
        isPartOf: { '@id': `${b.url}/#website` },
        description: `Expert fitness and health articles from FIT360's trainers and nutritionists in Kharadi, Pune.`,
        inLanguage: 'en-US',
      },
      breadcrumbSchema(b.url, [
        { name: 'Home', url: b.url + '/' },
        { name: 'Blog', url: pageUrl },
      ]),
    ],
  };
}

export function blogPostSchema(
  b: { name: string; url: string; logo: string; description: string },
  post: {
    title: string;
    slug: string;
    description: string;
    publishDate: Date;
    updatedDate?: Date;
    author: string;
    image?: string;
  },
) {
  const pageUrl = `${b.url}/blog/${post.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      orgSchema(b),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: post.title,
        isPartOf: { '@id': `${b.url}/#website` },
        description: post.description,
        inLanguage: 'en-US',
        ...(post.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: `${b.url}${post.image}` } } : {}),
      },
      {
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: post.title,
        description: post.description,
        url: pageUrl,
        datePublished: post.publishDate.toISOString(),
        ...(post.updatedDate ? { dateModified: post.updatedDate.toISOString() } : {}),
        author: { '@type': 'Person', name: post.author },
        publisher: { '@id': `${b.url}/#organization` },
        isPartOf: { '@id': `${pageUrl}#webpage` },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        ...(post.image ? { image: { '@type': 'ImageObject', url: `${b.url}${post.image}` } } : {}),
      },
      breadcrumbSchema(b.url, [
        { name: 'Home', url: b.url + '/' },
        { name: 'Blog', url: `${b.url}/blog/` },
        { name: post.title, url: pageUrl },
      ]),
    ],
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbSchema(siteUrl: string, items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
