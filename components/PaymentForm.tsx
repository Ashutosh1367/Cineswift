import React, { useState } from 'react';
import { CreditCard, Lock, Calendar, User, Ticket, Tag, Wallet, Check, Smartphone, Circle } from 'lucide-react';
import { Button } from './Button';
import { BookingState } from '../types';
import { SNACKS, OFFERS } from '../constants';

interface PaymentFormProps {
  state: BookingState;
  onApplyOffer: (offerId: string | null) => void;
  onSubmit: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ state, onApplyOffer, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | null>(null);
  const [couponCode, setCouponCode] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { selectedMovie, selectedShowtime, selectedSeats, selectedSnacks, appliedOffer } = state;

  // Calculations
  const ticketTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const snackTotal = Object.entries(selectedSnacks).reduce((sum, [id, qty]) => {
    const snack = SNACKS.find(s => s.id === id);
    return sum + (snack ? snack.price * (qty as number) : 0);
  }, 0);
  
  const subTotal = ticketTotal + snackTotal;
  
  let discount = 0;
  if (appliedOffer) {
    if (appliedOffer.discountType === 'percent') {
      discount = Math.min(10, subTotal * appliedOffer.discountValue); // Cap at 10 for demo
    } else {
      discount = appliedOffer.discountValue;
    }
  }

  const convenienceFee = 1.50;
  const totalAmount = Math.max(0, subTotal + convenienceFee - discount);

  // Logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleApplyCoupon = (code: string) => {
    const offer = OFFERS.find(o => o.code === code);
    if (offer) {
        if (offer.minOrderValue && subTotal < offer.minOrderValue) {
            alert(`Minimum order value of $${offer.minOrderValue} required for this coupon.`);
            return;
        }
        onApplyOffer(offer.id);
        setCouponCode('');
    } else {
        alert('Invalid Coupon Code');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!formData.name) newErrors.name = "Required";
      if (formData.cardNumber.length < 19) newErrors.cardNumber = "Invalid";
      if (formData.expiry.length < 5) newErrors.expiry = "Invalid";
      if (formData.cvc.length < 3) newErrors.cvc = "Invalid";
    }

    if (paymentMethod === 'upi' && !upiApp) {
        // Visual validation for UPI
        // We could set an error here, but for now we just won't submit
        alert('Please select a UPI App');
        return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  if (!selectedMovie || !selectedShowtime) return null;

  return (
    <div className="flex flex-col h-full animate-slide-up pb-8">
      <h2 className="text-xl font-bold text-white mb-4">Payment</h2>

      {/* Bill Summary */}
      <div className="bg-dark-surface p-4 rounded-xl border border-white/5 mb-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Ticket size={16} /> Order Summary
        </h3>
        
        <div className="text-sm space-y-2 pb-3 border-b border-white/10">
            <div className="flex justify-between text-gray-400">
                <span>Tickets ({selectedSeats.length})</span>
                <span>${ticketTotal.toFixed(2)}</span>
            </div>
            {Object.keys(selectedSnacks).length > 0 && (
                <div className="flex justify-between text-gray-400">
                    <span>Snacks & Food</span>
                    <span>${snackTotal.toFixed(2)}</span>
                </div>
            )}
             <div className="flex justify-between text-gray-400">
                <span>Convenience Fee</span>
                <span>${convenienceFee.toFixed(2)}</span>
            </div>
            {appliedOffer && (
                <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedOffer.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                </div>
            )}
        </div>
        
        <div className="flex justify-between items-center">
            <span className="font-bold text-white">Total Payable</span>
            <span className="text-xl font-bold text-brand-400">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Offers & Coupons */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Tag size={16} /> Offers
        </h3>
        
        {/* Input */}
        <div className="flex gap-2 mb-3">
            <input 
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-dark-surface border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-brand-500 outline-none"
            />
            <button 
                onClick={() => handleApplyCoupon(couponCode)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
            >
                Apply
            </button>
        </div>

        {/* Available Offers List */}
        {!appliedOffer && (
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {OFFERS.map(offer => (
                    <button
                        key={offer.id}
                        onClick={() => handleApplyCoupon(offer.code)}
                        className="flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 border border-brand-500/30 p-3 rounded-lg w-56 text-left hover:border-brand-500 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-brand-400 font-bold text-xs bg-brand-900/50 px-1.5 py-0.5 rounded border border-brand-500/20">{offer.code}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-tight group-hover:text-gray-300">{offer.description}</p>
                    </button>
                ))}
            </div>
        )}
        
        {appliedOffer && (
            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span className="text-sm text-green-400">Code <b>{appliedOffer.code}</b> applied</span>
                </div>
                <button 
                    onClick={() => onApplyOffer(null)}
                    className="text-xs text-gray-500 hover:text-white"
                >
                    Remove
                </button>
            </div>
        )}
      </div>

      {/* Payment Method Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Wallet size={16} /> Payment Method
        </h3>
        <div className="grid grid-cols-3 gap-2">
            {['card', 'upi', 'wallet'].map((method) => (
                <button
                    key={method}
                    onClick={() => {
                        setPaymentMethod(method as any);
                        if(method !== 'upi') setUpiApp(null);
                    }}
                    className={`
                        py-3 px-2 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-1
                        ${paymentMethod === method 
                            ? 'bg-brand-500 text-white border-brand-400 shadow-lg shadow-brand-500/20' 
                            : 'bg-dark-surface text-gray-400 border-white/5 hover:bg-white/5'}
                    `}
                >
                    {method === 'card' && <CreditCard size={18} />}
                    {method === 'upi' && <Smartphone size={18} />}
                    {method === 'wallet' && <Wallet size={18} />}
                    <span>
                        {method === 'card' && 'Card'}
                        {method === 'upi' && 'UPI'}
                        {method === 'wallet' && 'Wallet'}
                    </span>
                </button>
            ))}
        </div>
      </div>

      {/* Dynamic Payment Content */}
      <div className="bg-dark-surface p-4 rounded-xl border border-white/5 min-h-[200px]">
          
          {/* Credit Card Form */}
          {paymentMethod === 'card' && (
            <form className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={`w-full bg-dark-bg border ${errors.cardNumber ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-colors font-mono`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full bg-dark-bg border ${errors.expiry ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-colors font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">CVC</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                      type="password"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full bg-dark-bg border ${errors.cvc ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-colors font-mono`}
                    />
                  </div>
                </div>
              </div>
              
               <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Cardholder Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full bg-dark-bg border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-colors`}
                  />
                </div>
              </div>
            </form>
          )}

          {/* UPI Apps Selection */}
          {paymentMethod === 'upi' && (
              <div className="animate-fade-in space-y-3">
                  <p className="text-xs text-gray-400 mb-3">Select UPI App to pay</p>
                  
                  {[
                      { id: 'gpay', label: 'Google Pay', color: 'text-blue-400' },
                      { id: 'phonepe', label: 'PhonePe', color: 'text-purple-400' },
                      { id: 'paytm', label: 'Paytm', color: 'text-cyan-400' }
                  ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setUpiApp(app.id as any)}
                        className={`
                            w-full flex items-center justify-between p-4 rounded-xl border transition-all
                            ${upiApp === app.id 
                                ? 'bg-brand-500/10 border-brand-500' 
                                : 'bg-dark-bg border-white/5 hover:border-white/20'}
                        `}
                      >
                          <span className={`font-bold ${app.color}`}>{app.label}</span>
                          <div className={`
                             w-5 h-5 rounded-full border flex items-center justify-center
                             ${upiApp === app.id ? 'border-brand-500' : 'border-gray-600'}
                          `}>
                              {upiApp === app.id && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                          </div>
                      </button>
                  ))}

                  <div className="mt-4 pt-4 border-t border-white/5 text-center">
                       <p className="text-xs text-gray-500">Or enter VPA ID</p>
                       <input 
                         type="text"
                         placeholder="e.g. user@okhdfcbank"
                         className="w-full mt-2 bg-dark-bg border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-brand-500 outline-none"
                       />
                  </div>
              </div>
          )}

          {/* Wallet Fallback */}
          {paymentMethod === 'wallet' && (
            <div className="flex flex-col items-center justify-center h-full py-6 text-center animate-fade-in">
                <Wallet className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">Wallets coming soon</p>
                <p className="text-xs text-gray-500 mt-1">Please use Card or UPI for now.</p>
            </div>
          )}
      </div>

      <div className="mt-8">
        <Button onClick={handleSubmit} fullWidth disabled={paymentMethod === 'wallet'}>
          {paymentMethod === 'upi' && upiApp 
             ? `Pay via ${upiApp === 'gpay' ? 'Google Pay' : upiApp === 'phonepe' ? 'PhonePe' : 'Paytm'}` 
             : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
            <Lock size={10} /> Secure SSL Transaction
        </p>
      </div>
    </div>
  );
};