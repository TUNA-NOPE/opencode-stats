'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calculator, Wrench, Home, Zap, CreditCard, Crown } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/compare', label: 'Compare', icon: Calculator },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
  { href: '/plans', label: 'Best Value', icon: Crown },
  { href: '/tools', label: 'Tools', icon: Wrench },
];

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-foreground text-background">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">OpenCode</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-muted rounded-md" />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          
          {/* Right side - can add theme toggle or other actions here */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground font-medium">
              Stats Dashboard
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
