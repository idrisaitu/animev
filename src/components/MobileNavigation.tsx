'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Grid3X3, 
  Heart, 
  User, 
  Play,
  Clock,
  Star,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFavorites } from '@/hooks/useFavorites';

interface MobileNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  color?: string;
}

export default function MobileNavigation() {
  const pathname = usePathname();
  const { favorites, getContinueWatching } = useFavorites();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const continueWatching = getContinueWatching();

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems: MobileNavItem[] = [
    {
      href: '/',
      label: 'Главная',
      icon: Home,
      color: 'text-blue-400'
    },
    {
      href: '/search',
      label: 'Поиск',
      icon: Search,
      color: 'text-green-400'
    },
    {
      href: '/catalog',
      label: 'Каталог',
      icon: Grid3X3,
      color: 'text-purple-400'
    },
    {
      href: '/favorites',
      label: 'Избранное',
      icon: Heart,
      badge: favorites.length,
      color: 'text-red-400'
    },
    {
      href: '/profile',
      label: 'Профиль',
      icon: User,
      color: 'text-orange-400'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/90 backdrop-blur-md border-t border-white/10"
          >
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center p-2 min-w-0 flex-1"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={`relative flex flex-col items-center justify-center transition-colors duration-200 ${
                        active ? item.color : 'text-gray-400'
                      }`}
                    >
                      {/* Icon */}
                      <div className="relative">
                        <item.icon 
                          className={`h-5 w-5 ${active ? 'scale-110' : ''} transition-transform duration-200`} 
                        />
                        
                        {/* Badge */}
                        {item.badge && item.badge > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                          >
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className="text-xs mt-1 font-medium truncate max-w-full">
                        {item.label}
                      </span>
                      
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Continue Watching Floating Button */}
      {continueWatching.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-20 right-4 z-40 md:hidden"
        >
          <Button
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            asChild
          >
            <Link href="/continue-watching">
              <Play className="h-5 w-5 mr-2" fill="currentColor" />
              Продолжить ({continueWatching.length})
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
}

// Quick Actions Floating Menu
export function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, getContinueWatching } = useFavorites();
  const continueWatching = getContinueWatching();

  const quickActions = [
    {
      href: '/trending',
      label: 'Популярное',
      icon: TrendingUp,
      color: 'bg-red-500'
    },
    {
      href: '/new-releases',
      label: 'Новинки',
      icon: Star,
      color: 'bg-yellow-500'
    },
    {
      href: '/recently-watched',
      label: 'Недавние',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      href: '/settings',
      label: 'Настройки',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="fixed bottom-24 right-4 z-40 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-2"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  size="sm"
                  className={`${action.color} hover:opacity-90 shadow-lg rounded-full`}
                  asChild
                >
                  <Link href={action.href} onClick={() => setIsOpen(false)}>
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 shadow-lg"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.div>
      </Button>
    </div>
  );
}

// Swipe gesture hook for mobile navigation
export function useSwipeNavigation() {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return null;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) return 'left';
    if (isRightSwipe) return 'right';
    return null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}
