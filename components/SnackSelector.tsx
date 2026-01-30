import React, { useState } from 'react';
import { Snack } from '../types';
import { SNACKS } from '../constants';
import { Button } from './Button';
import { Plus, Minus, UtensilsCrossed } from 'lucide-react';

interface SnackSelectorProps {
  currentSelection: Record<string, number>;
  onConfirm: (snacks: Record<string, number>) => void;
  onSkip: () => void;
}

export const SnackSelector: React.FC<SnackSelectorProps> = ({ currentSelection, onConfirm, onSkip }) => {
  const [selection, setSelection] = useState<Record<string, number>>(currentSelection);

  const updateQuantity = (id: string, delta: number) => {
    setSelection(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newSelection = { ...prev };
      if (newQty === 0) {
        delete newSelection[id];
      } else {
        newSelection[id] = newQty;
      }
      return newSelection;
    });
  };

  const totalItems = (Object.values(selection) as number[]).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(selection).reduce((sum, [id, qty]) => {
    const snack = SNACKS.find(s => s.id === id);
    return sum + (snack ? snack.price * (qty as number) : 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UtensilsCrossed size={20} className="text-brand-500" />
          Grab a Bite?
        </h2>
        <p className="text-gray-400 text-sm">Pre-order snacks and save time.</p>
      </div>

      <div className="space-y-4 pb-24">
        {SNACKS.map((snack) => {
          const qty = selection[snack.id] || 0;
          return (
            <div key={snack.id} className="flex gap-4 bg-dark-surface p-3 rounded-xl border border-white/5">
              <img 
                src={snack.imageUrl} 
                alt={snack.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white">{snack.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{snack.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-brand-400">${snack.price.toFixed(2)}</span>
                  
                  <div className="flex items-center gap-3 bg-dark-bg px-2 py-1 rounded-lg border border-white/10">
                    <button 
                      onClick={() => updateQuantity(snack.id, -1)}
                      disabled={qty === 0}
                      className="w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{qty}</span>
                    <button 
                      onClick={() => updateQuantity(snack.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-brand-600 hover:bg-brand-500 text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-xl border-t border-white/10 p-4 max-w-lg mx-auto z-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-400 text-xs block">Snacks Total</span>
            <span className="text-xl font-bold text-white">${totalPrice.toFixed(2)}</span>
          </div>
          <button 
            onClick={onSkip} 
            className={`text-sm text-gray-400 hover:text-white underline decoration-gray-600 underline-offset-4 transition-colors ${totalItems > 0 ? 'hidden' : 'block'}`}
          >
            Skip Snacks
          </button>
        </div>
        <Button onClick={() => onConfirm(selection)} fullWidth>
          {totalItems > 0 ? `Proceed to Pay` : 'Skip to Payment'}
        </Button>
      </div>
    </div>
  );
};