'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites, FavoriteAnime } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  anime: Omit<FavoriteAnime, 'addedAt'>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({
  anime,
  size = 'md',
  variant = 'ghost',
  className = '',
  showText = false
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isInFavorites = isFavorite(anime.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favoriteAnime: Omit<FavoriteAnime, 'addedAt'> = {
      ...anime,
      image: anime.image || '/placeholder-anime.jpg',
    };
    toggleFavorite(favoriteAnime);
  };

  const sizeClasses = {
    sm: 'h-8 w-8 p-0',
    md: 'h-10 w-10 p-0',
    lg: 'h-12 w-12 p-0'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSize = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
  } as const;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        size={showText ? buttonSize[size] : 'icon'}
        onClick={handleClick}
        className={`
          ${!showText ? sizeClasses[size] : ''}
          ${isInFavorites
            ? 'text-red-500 hover:text-red-400'
            : 'text-gray-400 hover:text-red-500'
          }
          transition-colors duration-200
          ${className}
        `}
        title={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
      >
        <motion.div
          animate={isInFavorites ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`${showText ? 'mr-2' : ''} ${iconSizes[size]}`}
            fill={isInFavorites ? 'currentColor' : 'none'}
          />
        </motion.div>
        {showText && (
          <span>
            {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
          </span>
        )}
      </Button>
    </motion.div>
  );
}
