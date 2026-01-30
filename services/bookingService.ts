/**
 * Booking Service
 * Handles booking creation and seat management
 */
import { createDocument, getDocuments, setDocument, getDocument } from './firestoreService';
import { Seat, Showtime, Movie } from '../types';

// Booking document interface
export interface Booking {
    id?: string;
    bookingRef: string;
    userId: string;
    movieId: string;
    movieTitle: string;
    showtime: string;
    showtimeId: string;
    date: string;
    theater: string;
    seats: string[];  // ["A1", "A2"]
    totalSeats: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    snacks?: Record<string, number>;
    offerId?: string | null;
}

// Seat availability document
export interface SeatAvailability {
    id?: string;
    movieId: string;
    date: string;
    showtimeId: string;
    occupiedSeats: string[];
}

/**
 * Generate a unique booking reference
 */
const generateBookingRef = (): string => {
    return `BK${Date.now()}`;
};

/**
 * Get occupied seats for a specific showtime
 */
export const getOccupiedSeats = async (
    movieId: string,
    date: string,
    showtimeId: string
): Promise<string[]> => {
    const docId = `${movieId}_${date}_${showtimeId}`;

    try {
        const seatDoc = await getDocument<SeatAvailability>('seats', docId);
        return seatDoc?.occupiedSeats || [];
    } catch (error) {
        console.warn('Error fetching seat availability:', error);
        // Return empty for demo - seats all available
        return [];
    }
};

/**
 * Reserve seats (mark as occupied)
 */
export const reserveSeats = async (
    movieId: string,
    date: string,
    showtimeId: string,
    seats: string[]
): Promise<boolean> => {
    const docId = `${movieId}_${date}_${showtimeId}`;

    try {
        // Get current occupied seats
        const currentDoc = await getDocument<SeatAvailability>('seats', docId);
        const currentOccupied = currentDoc?.occupiedSeats || [];

        // Check for conflicts
        const conflicts = seats.filter(seat => currentOccupied.includes(seat));
        if (conflicts.length > 0) {
            throw new Error(`Seats ${conflicts.join(', ')} are already taken`);
        }

        // Update with new seats
        await setDocument<SeatAvailability>('seats', docId, {
            movieId,
            date,
            showtimeId,
            occupiedSeats: [...currentOccupied, ...seats]
        }, true);

        return true;
    } catch (error) {
        console.error('Error reserving seats:', error);
        throw error;
    }
};

/**
 * Create a new booking
 */
export const createBooking = async (
    userId: string,
    movie: Movie,
    showtime: Showtime,
    seats: Seat[],
    totalAmount: number,
    snacks?: Record<string, number>,
    offerId?: string | null
): Promise<Booking> => {
    const seatIds = seats.map(s => `${s.row}${s.col}`);
    const dateStr = showtime.date === 'Today'
        ? new Date().toISOString().split('T')[0]
        : new Date(Date.now() + 86400000).toISOString().split('T')[0];

    try {
        // Reserve seats first
        await reserveSeats(movie.id, dateStr, showtime.id, seatIds);

        // Create booking document
        const bookingData: Omit<Booking, 'id'> = {
            bookingRef: generateBookingRef(),
            userId,
            movieId: movie.id,
            movieTitle: movie.title,
            showtime: showtime.time,
            showtimeId: showtime.id,
            date: dateStr,
            theater: showtime.theater,
            seats: seatIds,
            totalSeats: seats.length,
            totalAmount,
            status: 'confirmed',
            snacks,
            offerId
        };

        const result = await createDocument('bookings', bookingData);
        return result as Booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

/**
 * Get bookings for a user
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    try {
        const bookings = await getDocuments<Booking>(
            'bookings',
            [{ field: 'userId', operator: '==', value: userId }],
            { field: 'createdAt', direction: 'desc' }
        );
        return bookings;
    } catch (error) {
        console.warn('Error fetching bookings:', error);
        return [];
    }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (
    bookingId: string,
    userId: string
): Promise<boolean> => {
    const { updateDocument } = await import('./firestoreService');

    try {
        // Verify ownership
        const booking = await getDocument<Booking>('bookings', bookingId);
        if (!booking || booking.userId !== userId) {
            throw new Error('Booking not found or unauthorized');
        }

        // Update status
        await updateDocument('bookings', bookingId, { status: 'cancelled' });

        // Optionally: release seats (not implemented for demo)

        return true;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error;
    }
};
