'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveGridProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
  };
  gap?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  minItemWidth?: number;
  maxItemWidth?: number;
  aspectRatio?: string;
  loading?: boolean;
  loadingItems?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  virtualized?: boolean;
}

export default function ResponsiveGrid({
  children,
  className = '',
  itemClassName = '',
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
    wide: 6
  },
  gap = {
    mobile: 12,
    tablet: 16,
    desktop: 20
  },
  minItemWidth = 200,
  maxItemWidth = 300,
  aspectRatio = '3/4',
  loading = false,
  loadingItems = 8,
  onLoadMore,
  hasMore = false,
  virtualized = false
}: ResponsiveGridProps) {
  const [currentColumns, setCurrentColumns] = useState(columns.desktop);
  const [currentGap, setCurrentGap] = useState(gap.desktop);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(20);

  // Responsive columns and gap
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setCurrentColumns(columns.mobile);
        setCurrentGap(gap.mobile);
      } else if (width < 1024) {
        setCurrentColumns(columns.tablet);
        setCurrentGap(gap.tablet);
      } else if (width < 1536) {
        setCurrentColumns(columns.desktop);
        setCurrentGap(gap.desktop);
      } else {
        setCurrentColumns(columns.wide);
        setCurrentGap(gap.desktop);
      }
      
      setContainerWidth(width);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [columns, gap]);

  // Auto columns based on container width and item constraints
  const calculateOptimalColumns = () => {
    if (containerWidth === 0) return currentColumns;
    
    const availableWidth = containerWidth - 32; // Account for padding
    const minColumns = Math.floor(availableWidth / (maxItemWidth + currentGap));
    const maxColumns = Math.floor(availableWidth / (minItemWidth + currentGap));
    
    return Math.max(1, Math.min(currentColumns, Math.max(minColumns, maxColumns)));
  };

  const optimalColumns = calculateOptimalColumns();

  // Infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.offsetHeight;
      
      if (scrollTop + windowHeight >= docHeight - 1000) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore]);

  // Virtualization for large lists
  useEffect(() => {
    if (!virtualized) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const itemHeight = 400; // Approximate item height
      const rowHeight = itemHeight + currentGap;
      const rowsPerScreen = Math.ceil(window.innerHeight / rowHeight);
      const currentRow = Math.floor(scrollTop / rowHeight);
      
      const startIndex = Math.max(0, (currentRow - rowsPerScreen) * optimalColumns);
      const endIndex = Math.min(children.length, (currentRow + rowsPerScreen * 3) * optimalColumns);
      
      setVisibleItems(endIndex - startIndex);
    };

    if (children.length > 50) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [children.length, currentGap, optimalColumns, virtualized]);

  // Grid styles
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${optimalColumns}, 1fr)`,
    gap: `${currentGap}px`,
    width: '100%'
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div 
        style={gridStyles}
        className={className}
      >
        {Array.from({ length: loadingItems }, (_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-card/30 rounded-lg overflow-hidden ${itemClassName}`}
            style={{ aspectRatio }}
          >
            <div className="animate-pulse">
              <div className="bg-gray-700 w-full h-3/4"></div>
              <div className="p-4 space-y-2">
                <div className="bg-gray-700 h-4 rounded"></div>
                <div className="bg-gray-700 h-3 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="bg-gray-700 h-3 rounded w-1/4"></div>
                  <div className="bg-gray-700 h-3 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading && children.length === 0) {
    return <LoadingSkeleton />;
  }

  const itemsToRender = virtualized && children.length > 50 
    ? children.slice(0, visibleItems)
    : children;

  return (
    <div className="space-y-6">
      {/* Main Grid */}
      <motion.div
        style={gridStyles}
        className={className}
        layout
      >
        <AnimatePresence mode="popLayout">
          {itemsToRender.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut"
              }}
              layout
              className={itemClassName}
              style={{ aspectRatio }}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading More Items */}
      {loading && children.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-8"
        >
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            <span>Загрузка...</span>
          </div>
        </motion.div>
      )}

      {/* Load More Button */}
      {onLoadMore && hasMore && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center py-8"
        >
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200"
          >
            Загрузить еще
          </button>
        </motion.div>
      )}

      {/* End of Results */}
      {!hasMore && children.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          <p>Вы просмотрели все результаты</p>
        </motion.div>
      )}
    </div>
  );
}

// Masonry Grid Component
export function MasonryGrid({
  children,
  className = '',
  itemClassName = '',
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
    wide: 5
  },
  gap = 16
}: {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
  };
  gap?: number;
}) {
  const [currentColumns, setCurrentColumns] = useState(columns.desktop);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setCurrentColumns(columns.mobile);
      } else if (width < 1024) {
        setCurrentColumns(columns.tablet);
      } else if (width < 1536) {
        setCurrentColumns(columns.desktop);
      } else {
        setCurrentColumns(columns.wide);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  // Distribute items across columns
  const columnArrays: React.ReactNode[][] = Array.from(
    { length: currentColumns },
    () => []
  );

  children.forEach((child, index) => {
    const columnIndex = index % currentColumns;
    columnArrays[columnIndex].push(child);
  });

  return (
    <div 
      className={`flex ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {columnArrays.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1 space-y-4"
        >
          {column.map((child, itemIndex) => (
            <motion.div
              key={`${columnIndex}-${itemIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: (columnIndex * 0.1) + (itemIndex * 0.05),
                duration: 0.3
              }}
              className={itemClassName}
            >
              {child}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
