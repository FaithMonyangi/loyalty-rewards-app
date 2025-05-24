
import { Star } from 'lucide-react';

interface StarRatingProps {
  current: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating = ({ current, total, size = 'md' }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {[...Array(total)].map((_, index) => (
        <Star
          key={index}
          className={`${iconSize} ${
            index < current
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {current}/{total}
      </span>
    </div>
  );
};
