import type { CatBreed } from '../types/cat'

// Curated design fixtures, not a live API response or a complete breed directory.
// Only used for the cover portraits while the live breed directory loads.
// Breed data and image source: https://thecatapi.com/
export const previewBreeds: CatBreed[] = [
  {
    id: 'abys', name: 'Abyssinian', origin: 'Egypt', lifeSpan: '14–17',
    temperament: ['Active', 'Energetic', 'Independent', 'Intelligent', 'Gentle', 'Curious', 'Playful'],
    description: 'An elegant, athletic cat with a distinctive ticked coat and a wonderfully curious nature. Always ready to explore, the Abyssinian brings a little adventure to everyday life.',
    image: { id: 'KWdLHmOqc', url: 'https://cdn2.thecatapi.com/images/KWdLHmOqc.jpg', width: 3114, height: 2609 },
  },
  {
    id: 'beng', name: 'Bengal', origin: 'United States', lifeSpan: '12–16',
    temperament: ['Alert', 'Agile', 'Energetic', 'Demanding', 'Intelligent'],
    description: 'A striking spotted coat meets an energetic spirit. The Bengal loves to climb, investigate, and turn the ordinary corners of home into a new adventure.',
    image: { id: 'O3btzLlsO', url: 'https://cdn2.thecatapi.com/images/O3btzLlsO.png' },
  },
  {
    id: 'bsho', name: 'British Shorthair', origin: 'United Kingdom', lifeSpan: '12–17',
    temperament: ['Affectionate', 'Easy Going', 'Gentle', 'Loyal', 'Patient', 'Calm'],
    description: 'Round cheeks, a plush coat, and a calm presence make the British Shorthair an unmistakable companion. An easygoing personality is part of this breed’s quiet charm.',
    image: { id: 's4wQfYoEk', url: 'https://cdn2.thecatapi.com/images/s4wQfYoEk.jpg' },
  },
  {
    id: 'mcoo', name: 'Maine Coon', origin: 'United States', lifeSpan: '12–15',
    temperament: ['Adaptable', 'Intelligent', 'Loving', 'Gentle', 'Independent'],
    description: 'With a flowing coat, tufted ears, and a long bushy tail, the Maine Coon has a grand appearance and a gentle reputation. A big cat with plenty of personality.',
    image: { id: 'OOD3VXAQn', url: 'https://cdn2.thecatapi.com/images/OOD3VXAQn.jpg' },
  },
  {
    id: 'ragd', name: 'Ragdoll', origin: 'United States', lifeSpan: '12–17',
    temperament: ['Affectionate', 'Friendly', 'Gentle', 'Quiet', 'Easy Going'],
    description: 'Blue eyes and a soft, silky coat give the Ragdoll a storybook look. Known for an affectionate, relaxed nature, this breed makes a lovely subject for a quiet afternoon of cat watching.',
    image: { id: 'oGefY4YoG', url: 'https://cdn2.thecatapi.com/images/oGefY4YoG.jpg' },
  },
  {
    id: 'siam', name: 'Siamese', origin: 'Thailand', lifeSpan: '12–15',
    temperament: ['Active', 'Agile', 'Clever', 'Sociable', 'Loving', 'Energetic'],
    description: 'Bright blue eyes, a sleek silhouette, and contrasting color points make the Siamese instantly recognizable. Sociable and expressive, this is a cat with something to say.',
    image: { id: 'ai6Jps4sx', url: 'https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg' },
  },
]
