'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { Menu } from 'lucide-react';

// Zod schema for props validation
export const headerLogoSchema = z.object({
  text: z.string().optional(),
  image: z.string().optional(),
  href: z.string().optional().default('/'),
});

export const headerItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  active: z.boolean().optional(),
  icon: z.any().optional(),
});

export const HeaderPropsSchema = z.object({
  logo: headerLogoSchema.optional(),
  items: z.array(headerItemSchema).optional().default([]),
  actions: z.any().optional(),
  sticky: z.boolean().optional().default(false),
  transparent: z.boolean().optional().default(false),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  onMobileMenuClick: z.function().returns(z.void()).optional(),
  className: z.string().optional(),
});

export type HeaderLogo = z.infer<typeof headerLogoSchema>;
export type HeaderItem = z.infer<typeof headerItemSchema>;
export type HeaderProps = Partial<z.infer<typeof HeaderPropsSchema>>;

const headerVariants = cva(
  'w-full border-b transition-colors duration-200',
  {
    variants: {
      size: {
        sm: 'h-14',
        md: 'h-16',
        lg: 'h-20',
      },
      sticky: {
        true: 'sticky top-0 z-50',
        false: '',
      },
      transparent: {
        true: 'bg-transparent border-transparent',
        false: 'bg-background border-border',
      },
    },
    defaultVariants: {
      size: 'md',
      sticky: false,
      transparent: false,
    },
  }
);

const headerContainerVariants = cva(
  'h-full max-w-7xl mx-auto flex items-center justify-between',
  {
    variants: {
      size: {
        sm: 'px-4 gap-4',
        md: 'px-6 gap-6',
        lg: 'px-8 gap-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const logoVariants = cva(
  'flex items-center font-bold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
  {
    variants: {
      size: {
        sm: 'text-lg gap-2',
        md: 'text-xl gap-2.5',
        lg: 'text-2xl gap-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const navItemVariants = cva(
  'inline-flex items-center font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
  {
    variants: {
      size: {
        sm: 'text-sm gap-1.5 px-2 py-1',
        md: 'text-base gap-2 px-3 py-1.5',
        lg: 'text-lg gap-2.5 px-4 py-2',
      },
      active: {
        true: 'text-foreground font-semibold',
        false: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  }
);

const mobileMenuButtonVariants = cva(
  'inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      logo,
      items = [],
      actions,
      sticky = false,
      transparent = false,
      size = 'md',
      onMobileMenuClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ size, sticky, transparent, className }))}
        data-testid="header"
        {...props}
      >
        <div className={cn(headerContainerVariants({ size }))} data-testid="header-container">
          {/* Logo */}
          {logo && (
            <a
              href={logo.href || '/'}
              className={cn(logoVariants({ size }))}
              data-testid="header-logo"
            >
              {logo.image && (
                <img
                  src={logo.image}
                  alt={logo.text || 'Logo'}
                  className="h-8 w-auto"
                  data-testid="header-logo-image"
                />
              )}
              {logo.text && <span data-testid="header-logo-text">{logo.text}</span>}
            </a>
          )}

          {/* Navigation */}
          {items.length > 0 && (
            <nav
              className="hidden md:flex items-center gap-1"
              role="navigation"
              data-testid="header-nav"
            >
              {items.map((item, index) => (
                <a
                  key={`${item.href}-${index}`}
                  href={item.href}
                  className={cn(navItemVariants({ size, active: item.active }))}
                  aria-current={item.active ? 'page' : undefined}
                  data-testid={`header-nav-item-${index}`}
                >
                  {item.icon && <span className="inline-flex">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2" data-testid="header-actions">
              {actions}
            </div>
          )}

          {/* Mobile Menu Button */}
          {onMobileMenuClick && (
            <button
              onClick={onMobileMenuClick}
              className={cn(mobileMenuButtonVariants({ size }))}
              aria-label="Open mobile menu"
              data-testid="header-mobile-menu-button"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';
