import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { MovieList } from '../components/MovieList';
import { ShowtimeSelector } from '../components/ShowtimeSelector';
import { SeatMap } from '../components/SeatMap';
import { SnackSelector } from '../components/SnackSelector';
import { PaymentForm } from '../components/PaymentForm';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { BookingState, Movie, Showtime, Step, Seat } from '../types';
import { OFFERS } from '../constants';
import { RefreshCcw } from 'lucide-react';

const INITIAL_STATE: BookingState = {
    step: Step.SELECT_MOVIE,
    selectedMovie: null,
    selectedShowtime: null,
    selectedSeats: [],
    selectedSnacks: {},
    appliedOffer: null,
    bookingId: null,
};

export default function Booking() {
    const [bookingState, setBookingState] = useState<BookingState>(INITIAL_STATE);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [bookingState.step]);

    const handleMovieSelect = (movie: Movie) => {
        setBookingState((prev) => ({
            ...prev,
            selectedMovie: movie,
            step: Step.SELECT_SHOWTIME,
        }));
    };

    const handleShowtimeSelect = (showtime: Showtime) => {
        setBookingState((prev) => ({
            ...prev,
            selectedShowtime: showtime,
            step: Step.SELECT_SEATS,
        }));
    };

    const handleSeatsConfirm = (seats: Seat[]) => {
        // Move to Snack selection
        setBookingState((prev) => ({
            ...prev,
            selectedSeats: seats,
            step: Step.SELECT_SNACKS,
        }));
    };

    const handleSnacksConfirm = (snacks: Record<string, number>) => {
        setBookingState((prev) => ({
            ...prev,
            selectedSnacks: snacks,
            step: Step.PAYMENT,
        }));
    };

    const handleApplyOffer = (offerId: string | null) => {
        const offer = OFFERS.find(o => o.id === offerId) || null;
        setBookingState(prev => ({
            ...prev,
            appliedOffer: offer
        }));
    }

    const handlePaymentSubmit = () => {
        setIsTransitioning(true);

        // Simulate payment processing
        setTimeout(() => {
            const mockId = `BK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            setBookingState((prev) => ({
                ...prev,
                bookingId: mockId,
                step: Step.CONFIRMATION,
            }));
            setIsTransitioning(false);
        }, 2000);
    };

    const handleBack = () => {
        setBookingState((prev) => {
            let prevStep = prev.step;
            if (prev.step === Step.SELECT_SHOWTIME) prevStep = Step.SELECT_MOVIE;
            if (prev.step === Step.SELECT_SEATS) prevStep = Step.SELECT_SHOWTIME;
            if (prev.step === Step.SELECT_SNACKS) prevStep = Step.SELECT_SEATS;
            if (prev.step === Step.PAYMENT) prevStep = Step.SELECT_SNACKS;
            if (prev.step === Step.CONFIRMATION) prevStep = Step.SELECT_MOVIE;

            return {
                ...prev,
                step: prevStep,
            };
        });
    };

    const handleReset = () => {
        setBookingState(INITIAL_STATE);
    };

    return (
        <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-dark-bg border-x border-dark-highlight shadow-2xl relative">

            {/* Global Header */}
            <Header
                currentStep={bookingState.step}
                onBack={bookingState.step !== Step.SELECT_MOVIE && bookingState.step !== Step.CONFIRMATION ? handleBack : undefined}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-4 pb-24 overflow-y-auto relative">

                {isTransitioning && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-dark-bg/90 backdrop-blur-sm">
                        <RefreshCcw className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                        <p className="text-gray-300 font-medium">Processing payment...</p>
                    </div>
                )}

                {bookingState.step === Step.SELECT_MOVIE && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 text-white">Now Showing</h2>
                        <MovieList onSelect={handleMovieSelect} />
                    </div>
                )}

                {bookingState.step === Step.SELECT_SHOWTIME && bookingState.selectedMovie && (
                    <div className="animate-slide-up">
                        <ShowtimeSelector
                            movie={bookingState.selectedMovie}
                            onSelect={handleShowtimeSelect}
                        />
                    </div>
                )}

                {bookingState.step === Step.SELECT_SEATS && bookingState.selectedMovie && bookingState.selectedShowtime && (
                    <div className="animate-slide-up">
                        <SeatMap
                            movie={bookingState.selectedMovie}
                            showtime={bookingState.selectedShowtime}
                            onConfirm={handleSeatsConfirm}
                        />
                    </div>
                )}

                {bookingState.step === Step.SELECT_SNACKS && (
                    <div className="animate-slide-up">
                        <SnackSelector
                            currentSelection={bookingState.selectedSnacks}
                            onConfirm={handleSnacksConfirm}
                            onSkip={() => handleSnacksConfirm(bookingState.selectedSnacks)}
                        />
                    </div>
                )}

                {bookingState.step === Step.PAYMENT && bookingState.selectedMovie && (
                    <PaymentForm
                        state={bookingState}
                        onApplyOffer={handleApplyOffer}
                        onSubmit={handlePaymentSubmit}
                    />
                )}

                {bookingState.step === Step.CONFIRMATION && bookingState.bookingId && (
                    <div className="animate-scale-in">
                        <BookingConfirmation
                            state={bookingState}
                            onHome={handleReset}
                        />
                    </div>
                )}

            </main>
        </div>
    );
}
