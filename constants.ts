import { Movie, Showtime, Snack, Offer } from './types';

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Interstellar Odyssey',
    genre: 'Sci-Fi / Adventure',
    duration: '2h 49m',
    rating: '9.2',
    imageUrl: 'https://picsum.photos/300/450?random=1',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  },
  {
    id: 'm2',
    title: 'Neon Nights',
    genre: 'Cyberpunk / Action',
    duration: '1h 55m',
    rating: '8.7',
    imageUrl: 'https://picsum.photos/300/450?random=2',
    description: 'In a dystopian future, a lone hacker must infiltrate the mega-corp citadel to uncover the truth.',
  },
  {
    id: 'm3',
    title: 'The Silent Forest',
    genre: 'Horror / Thriller',
    duration: '1h 32m',
    rating: '7.5',
    imageUrl: 'https://picsum.photos/300/450?random=3',
    description: 'A weekend getaway turns into a nightmare when ancient spirits awaken in the woods.',
  },
  {
    id: 'm4',
    title: 'Love in Paris',
    genre: 'Romance / Drama',
    duration: '2h 10m',
    rating: '8.1',
    imageUrl: 'https://picsum.photos/300/450?random=4',
    description: 'Two strangers meet by chance under the Eiffel Tower and spend a life-changing day together.',
  },
  {
    id: 'm5',
    title: 'Velocity X',
    genre: 'Action / Racing',
    duration: '2h 05m',
    rating: '7.9',
    imageUrl: 'https://picsum.photos/300/450?random=5',
    description: 'Underground street racers compete for the ultimate prize in a high-stakes cross-country rally.',
  },
];

export const SHOWTIMES: Showtime[] = [
  { id: 's1', time: '14:30', experience: 'Standard', date: 'Today', theater: 'Grand Cinema - Hall 3' },
  { id: 's2', time: '16:45', experience: 'IMAX', date: 'Today', theater: 'Grand Cinema - IMAX Hall' },
  { id: 's3', time: '19:00', experience: 'Dolby', date: 'Today', theater: 'Grand Cinema - Dolby Atmos' },
  { id: 's4', time: '21:30', experience: 'IMAX', date: 'Today', theater: 'Grand Cinema - IMAX Hall' },
  { id: 's5', time: '11:00', experience: 'Standard', date: 'Tomorrow', theater: 'Grand Cinema - Hall 2' },
  { id: 's6', time: '15:15', experience: 'Dolby', date: 'Tomorrow', theater: 'Grand Cinema - Dolby Atmos' },
];

export const SNACKS: Snack[] = [
  {
    id: 'sn1',
    name: 'Large Popcorn',
    price: 8.50,
    description: 'Freshly popped, buttered & salted.',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=200',
    category: 'Food'
  },
  {
    id: 'sn2',
    name: 'Cola Large',
    price: 5.00,
    description: 'Ice cold refreshing cola.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200',
    category: 'Drink'
  },
  {
    id: 'sn3',
    name: 'Nachos Deluxe',
    price: 9.75,
    description: 'Tortilla chips with hot cheese dip & jalapeños.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=200',
    category: 'Food'
  },
  {
    id: 'sn4',
    name: 'Combo Meal',
    price: 15.00,
    description: '1 Large Popcorn + 2 Medium Drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=200',
    category: 'Combo'
  },
];

export const OFFERS: Offer[] = [
  {
    id: 'o1',
    code: 'WELCOME50',
    description: 'Get 50% off up to $10 on your first booking',
    discountType: 'percent',
    discountValue: 0.5,
    minOrderValue: 20
  },
  {
    id: 'o2',
    code: 'SNACKFREE',
    description: '$5 off on snacks orders above $15',
    discountType: 'fixed',
    discountValue: 5,
    minOrderValue: 15
  }
];

// Helper to generate a seat grid
// Rows A-G, Cols 1-8
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const COLS_PER_ROW = 8;