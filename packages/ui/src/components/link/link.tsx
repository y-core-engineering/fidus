import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';

// Zod schema for props validation
export const LinkPropsSchema = z.object({
  variant: z.enum(['inline', 'standalone']).default('inline'),
  showIcon: z.boolean().optional(),
  external: z.boolean().optional(),
  className: z.string().optional(),
  href: z.string(),
  children: z.any(),
});

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  z.infer<typeof LinkPropsSchema>;

const linkVariants = cva(
  'text-foreground underline hover:no-underline transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
  {
    variants: {
      variant: {
        inline: 'inline',
        standalone: 'font-medium flex items-center gap-1',
      },
    },
    defaultVariants: {
      variant: 'inline',
    },
  }
);

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const {
      variant = 'inline',
      showIcon,
      external,
      className,
      children,
      ...rest
    } = props;

    return (
      <a
        ref={ref}
        className={cn(linkVariants({ variant, className }))}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
        {(showIcon || external) && (
          <svg
            className="w-4 h-4 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';
