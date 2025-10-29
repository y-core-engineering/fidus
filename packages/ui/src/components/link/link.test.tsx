import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './link';

describe('Link', () => {
  it('renders children', () => {
    render(<Link href="/test">Click here</Link>);
    expect(screen.getByText('Click here')).toBeInTheDocument();
  });

  it('applies href attribute', () => {
    render(<Link href="/about">About</Link>);
    const link = screen.getByText('About');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('applies inline variant by default', () => {
    render(<Link href="/test">Inline Link</Link>);
    const link = screen.getByText('Inline Link');
    expect(link).toHaveClass('inline');
  });

  it('applies standalone variant', () => {
    render(
      <Link href="/test" variant="standalone">
        Standalone Link
      </Link>
    );
    const link = screen.getByText('Standalone Link');
    expect(link).toHaveClass('flex');
    expect(link).toHaveClass('items-center');
  });

  it('shows external icon when external is true', () => {
    render(
      <Link href="https://example.com" external>
        External Link
      </Link>
    );
    const link = screen.getByText('External Link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  it('shows icon when showIcon is true', () => {
    render(
      <Link href="/test" showIcon>
        Link with Icon
      </Link>
    );
    const link = screen.getByText('Link with Icon');
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Link href="/test" className="custom-class">
        Custom Link
      </Link>
    );
    const link = screen.getByText('Custom Link');
    expect(link).toHaveClass('custom-class');
  });
});
