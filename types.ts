export enum Step {
  SELECT_MOVIE = 1,
  SELECT_SHOWTIME = 2,
  SELECT_SEATS = 3,
  SELECT_SNACKS = 4,
  PAYMENT = 5,
  CONFIRMATION = 6,
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string; // e.g. "2h 15m"
  rating: string;   // e.g. "8.5"
  imageUrl: string;
  description: string;
}

export interface Showtime {
  id: string;
  time: string;     // e.g. "19:30"
  experience: string; // e.g. "IMAX", "2D"
  date: string;     // e.g. "Today"
  theater: string;  // e.g. "Grand Cinema - Hall 1"
}

export enum SeatStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  SELECTED = 'selected',
  VIP = 'vip', // Just a visual distinction variant
}

export interface Seat {
  id: string;
  row: string;
  col: number;
  status: SeatStatus;
  price: number;
}

export interface Snack {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export interface Offer {
  id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
}

export interface BookingState {
  step: Step;
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  selectedSnacks: Record<string, number>; // Snack ID -> Quantity
  appliedOffer: Offer | null;
  bookingId: string | null;
}