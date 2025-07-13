'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Автоматическое создание хлебных крошек на основе URL
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', href: '/', icon: <Home className="h-3 w-3" /> }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Преобразование сегментов URL в читаемые названия
      let label = segment;
      switch (segment) {
        case 'catalog':
          label = 'Каталог';
          break;
        case 'search':
          label = 'Поиск';
          break;
        case 'demo-player':
          label = 'Демо-плеер';
          break;
        case 'streaming-demo':
          label = 'API Demo';
          break;
        case 'watch':
          label = 'Просмотр';
          break;
        case 'anime':
          label = 'Аниме';
          break;
        case 'profile':
          label = 'Профиль';
          break;
        case 'favorites':
          label = 'Избранное';
          break;
        case 'schedule':
          label = 'Расписание';
          break;
        default:
          // Для динамических сегментов (ID, названия)
          if (segment.match(/^[0-9]+$/)) {
            label = `#${segment}`;
          } else {
            label = decodeURIComponent(segment).replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
          }
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Не показываем хлебные крошки на главной странице
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-gray-500 mx-1" />
              )}
              
              {isLast ? (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-1 text-white font-medium"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Компонент для кастомных хлебных крошек
export function CustomBreadcrumbs({ 
  items, 
  className = '' 
}: { 
  items: BreadcrumbItem[]; 
  className?: string; 
}) {
  return <Breadcrumbs items={items} className={className} />;
}

// Хук для создания хлебных крошек
export function useBreadcrumbs() {
  const pathname = usePathname();

  const addBreadcrumb = (label: string, href?: string) => {
    return {
      label,
      href: href || pathname
    };
  };

  const createBreadcrumbs = (...items: BreadcrumbItem[]) => {
    return [
      { label: 'Главная', href: '/', icon: <Home className="h-3 w-3" /> },
      ...items
    ];
  };

  return {
    addBreadcrumb,
    createBreadcrumbs
  };
}
