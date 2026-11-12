import { site } from './site';

export const officialOrigin = 'https://yaya-etiabi.github.io';
export const websiteId = officialOrigin + '/#website';
export const personId = officialOrigin + '/#person';

export const person = {
  '@type': 'Person',
  '@id': personId,
  name: site.name,
  url: officialOrigin + '/about/',
  description: site.description,
  sameAs: [site.orcid, site.scholar, site.github, site.linkedin],
};

export const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  name: site.name,
  url: officialOrigin + '/',
  inLanguage: 'en',
  creator: { '@id': personId },
};

// Only facts already present in visible page content and publication metadata
// are included. JSON-LD describes the site; it does not manufacture authority.
export function homeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      {
        '@type': 'WebPage',
        '@id': officialOrigin + '/#webpage',
        name: site.heading,
        url: officialOrigin + '/',
        inLanguage: 'en',
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
      },
    ],
  };
}

export function profileStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': officialOrigin + '/about/#webpage',
    url: officialOrigin + '/about/',
    name: 'About | ' + site.name,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    mainEntity: person,
  };
}

export function publicationsStructuredData(publications) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': officialOrigin + '/publications/#webpage',
    url: officialOrigin + '/publications/',
    name: 'Publications | ' + site.name,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: publications.map((publication, index) => {
        const { title, authors, year, doi, url: publicUrl, kind } = publication.data;
        const url = doi ? 'https://doi.org/' + doi : publicUrl;
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'ScholarlyArticle',
            name: title,
            author: authors.map(name => ({ '@type': 'Person', name })),
            datePublished: String(year),
            ...(url ? { url } : {}),
            ...(doi ? { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: doi } } : {}),
            ...(kind === 'Preprint' ? { version: 'Preprint' } : {}),
          },
        };
      }),
    },
  };
}
