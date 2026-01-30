import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, Booking } from '../services/bookingService';
import { Header } from '../components/Header';
import { Step } from '../types';
import { Ticket, Calendar, MapPin, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export default function MyBookings() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const userBookings = await getUserBookings(user.uid);
                setBookings(userBookings);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-dark-bg border-x border-dark-highlight shadow-2xl">
            <Header currentStep={Step.SELECT_MOVIE} onBack={() => navigate('/')} />

            <main className="flex-1 p-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Ticket className="text-brand-400" />
                    My Bookings
                </h2>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="text-center py-12">
                        <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No bookings yet</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Start booking movies to see them here
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Browse Movies
                        </button>
                    </div>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id || booking.bookingRef}
                                className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden"
                            >
                                {/* Booking Header */}
                                <div className="p-4 border-b border-white/5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white">{booking.movieTitle}</h3>
                                            <p className="text-xs text-gray-500">Ref: {booking.bookingRef}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                                                ? 'bg-green-500/20 text-green-400'
                                                : booking.status === 'cancelled'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="p-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={14} />
                                        <span>{formatDate(booking.date)} at {booking.showtime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin size={14} />
                                        <span>{booking.theater}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Ticket size={14} />
                                        <span>Seats: {booking.seats.join(', ')}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 bg-white/5 flex justify-between items-center">
                                    <span className="text-brand-400 font-bold">
                                        ${booking.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                    <ChevronRight size={18} className="text-gray-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
