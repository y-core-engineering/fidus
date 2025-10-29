import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Test content</Container>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<Container size="sm">Content</Container>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('max-w-2xl');
  });

  it('applies padding classes', () => {
    const { container } = render(<Container padding="lg">Content</Container>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('px-8');
  });

  it('renders with custom element', () => {
    const { container } = render(<Container as="section">Content</Container>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">Content</Container>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('applies default variants', () => {
    const { container } = render(<Container>Content</Container>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('max-w-6xl', 'px-6');
  });

  it('supports full width', () => {
    const { container } = render(<Container size="full">Content</Container>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('max-w-full');
  });

  it('supports no padding', () => {
    const { container } = render(<Container padding="none">Content</Container>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('px-0');
  });
});
