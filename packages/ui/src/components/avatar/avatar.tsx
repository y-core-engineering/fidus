import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { z } from 'zod';
import { User } from 'lucide-react';

// Zod schema for props validation
export const AvatarPropsSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  fallback: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg', 'xl']).default('md').optional(),
  shape: z.enum(['circle', 'square']).default('circle').optional(),
  className: z.string().optional(),
});

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> &
  z.infer<typeof AvatarPropsSchema>;

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden bg-muted text-foreground font-medium',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-md',
        xl: 'h-16 w-16 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => {
    const {
      src,
      alt,
      fallback,
      size = 'md',
      shape = 'circle',
      className,
      ...rest
    } = props;

    // SSR-safe: Track client-side hydration and image errors
    const [isClient, setIsClient] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
      setIsClient(true);
    }, []);

    const getInitials = (name?: string) => {
      if (!name) return null;
      const parts = name.trim().split(' ');
      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
      }
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const showImage = src && !imageError;
    const initials = getInitials(fallback || alt);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape, className }))}
        {...rest}
      >
        {/* SSR-safe: Show fallback immediately, image after client hydration */}
        {isClient && showImage ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className={cn(size === 'sm' ? 'h-4 w-4' : size === 'xl' ? 'h-8 w-8' : 'h-5 w-5')} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
