/**
 * Movie Service
 * Handles movie data from Firestore with static fallback
 */
import { getDocuments } from './firestoreService';
import { Movie } from '../types';
import { MOVIES } from '../constants';

// Firestore movie type (may have additional fields)
interface FirestoreMovie extends Movie {
    isActive?: boolean;
}

/**
 * Get all currently showing movies
 * Falls back to static data if Firestore is empty or fails
 */
export const getMovies = async (): Promise<Movie[]> => {
    try {
        const firestoreMovies = await getDocuments<FirestoreMovie>(
            'movies',
            [{ field: 'isActive', operator: '==', value: true }]
        );

        // Use Firestore data if available, otherwise use static data
        if (firestoreMovies.length > 0) {
            return firestoreMovies.map(movie => ({
                id: movie.id,
                title: movie.title,
                genre: movie.genre,
                duration: movie.duration,
                rating: movie.rating,
                imageUrl: movie.imageUrl,
                description: movie.description
            }));
        }

        console.log('Using static movie data (no Firestore movies found)');
        return MOVIES;
    } catch (error) {
        console.warn('Firestore unavailable, using static movies:', error);
        return MOVIES;
    }
};

/**
 * Get a single movie by ID
 */
export const getMovieById = async (movieId: string): Promise<Movie | null> => {
    // First check static data (for quick lookup)
    const staticMovie = MOVIES.find(m => m.id === movieId);
    if (staticMovie) {
        return staticMovie;
    }

    // Try Firestore for custom movies
    try {
        const movies = await getDocuments<FirestoreMovie>(
            'movies',
            [{ field: 'isActive', operator: '==', value: true }]
        );
        const movie = movies.find(m => m.id === movieId);
        return movie || null;
    } catch (error) {
        console.warn('Error fetching movie from Firestore:', error);
        return null;
    }
};

/**
 * Seed initial movie data to Firestore (for admin use)
 * This can be used to populate Firestore with the static movies
 */
export const seedMovies = async (): Promise<void> => {
    const { setDocument } = await import('./firestoreService');

    for (const movie of MOVIES) {
        await setDocument('movies', movie.id, {
            ...movie,
            isActive: true
        }, true); // merge: true
    }

    console.log(`Seeded ${MOVIES.length} movies to Firestore`);
};
