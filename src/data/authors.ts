export interface Author {
  slug: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  avatar: string;
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export const AUTHORS: Record<string, Author> = {
  'mateo-silva': {
    slug: 'mateo-silva',
    name: 'Mateo Silva',
    role: 'Senior Architectural Critic & Documentary Photographer',
    location: 'Lisbon, Portugal',
    bio: 'Mateo investigates the acoustic silence and textural permanence of post-war European and Latin American brutalist structures. Contributing editor at Questo since 2024.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    socials: {
      twitter: 'https://x.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  },
  'saskia-lindqvist': {
    slug: 'saskia-lindqvist',
    name: 'Saskia Lindqvist',
    role: 'Typographic Historian & Design Systems Theorist',
    location: 'Basel, Switzerland',
    bio: 'Former fellow at the Zurich Museum of Design. Saskia specializes in Josef Müller-Brockmann’s grid methodologies and modular layout mathematics.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    socials: {
      twitter: 'https://x.com',
      github: 'https://github.com',
      website: 'https://questo-blog.netlify.app',
    },
  },
  'julian-mercer': {
    slug: 'julian-mercer',
    name: 'Julian Mercer',
    role: 'Monumental Heritage Researcher & Material Essayist',
    location: 'London, United Kingdom',
    bio: 'Lecturer in 20th-century civic architecture. Julian documents the weathering patterns and philosophical endurance of board-marked concrete across the globe.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    socials: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
    },
  },
  'tariq-mahmood': {
    slug: 'tariq-mahmood',
    name: 'Tariq Mahmood',
    role: 'Principal Systems Architect & Static Performance Engineer',
    location: 'Berlin, Germany',
    bio: 'Specialist in distributed edge systems, zero-runtime SSG pipelines, and international multilingual content graphs. Passionate about sustainable software architecture.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    socials: {
      github: 'https://github.com',
      twitter: 'https://x.com',
    },
  },
  'elena-vance': {
    slug: 'elena-vance',
    name: 'Elena Vance',
    role: 'Digital Minimalist & Software Craft Critic',
    location: 'Vancouver, Canada',
    bio: 'Advocate for intentional web design, anti-bloat engineering, and ethical user autonomy. Author of monographs on the death of ubiquitous card grid interfaces.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    socials: {
      twitter: 'https://x.com',
      github: 'https://github.com',
    },
  },
  'anne-hardy': {
    slug: 'anne-hardy',
    name: 'Anne Hardy',
    role: 'Material Culture Curator & Classical Sculpture Analyst',
    location: 'Kyoto, Japan',
    bio: 'Curator studying traditional Japanese timber joinery, Roman marble carving endurance, and tactile physical craftsmanship in our digital screen era.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    socials: {
      twitter: 'https://x.com',
      website: 'https://questo-blog.netlify.app',
    },
  },
};

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS[slug];
}

export function getAuthorByName(name: string): Author | undefined {
  const normalized = name.trim().toLowerCase();
  return Object.values(AUTHORS).find((a) => a.name.toLowerCase() === normalized);
}

export function authorNameToSlug(name: string): string {
  const match = getAuthorByName(name);
  if (match) return match.slug;
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

