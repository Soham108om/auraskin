import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`skeleton-loading rounded ${className}`}></div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="w-full aspect-[4/5] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
