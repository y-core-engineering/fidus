import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies normal variant by default', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-info/10', 'text-info');
  });

  it('applies urgent variant', () => {
    const { container } = render(<Badge variant="urgent">Urgent</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-urgent/10', 'text-urgent');
  });

  it('applies important variant', () => {
    const { container } = render(<Badge variant="important">Important</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-warning/10', 'text-warning');
  });

  it('applies low variant', () => {
    const { container } = render(<Badge variant="low">Low</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-muted', 'text-muted-foreground');
  });

  it('applies success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-success/10', 'text-success');
  });

  it('applies error variant', () => {
    const { container } = render(<Badge variant="error">Error</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-error/10', 'text-error');
  });

  it('applies size classes', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('applies medium size by default', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
  });

  it('applies large size', () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-md');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-class');
  });
});
