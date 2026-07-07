import React from 'react';
import { Review } from '../types';
import { CheckCircle } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-[#FFF8F2]/40 rounded-xl p-5 border border-[#E8DEC9]/20 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm font-sans font-medium text-[#222222]">{review.user}</span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <div className="flex text-[#D4AF37] text-xs">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            {review.verified && (
              <span className="text-[10px] text-green-700 flex items-center font-sans tracking-wide">
                <CheckCircle size={10} className="mr-0.5" /> Verified Buyer
              </span>
            )}
          </div>
        </div>
        <span className="text-[10px] text-[#222222]/40 font-sans">{review.date}</span>
      </div>
      <p className="text-xs text-[#222222]/80 leading-relaxed font-sans font-light italic">
        "{review.comment}"
      </p>
    </div>
  );
};
