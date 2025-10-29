import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from './chip';

describe('Chip', () => {
  it('renders children', () => {
    render(<Chip>Test Chip</Chip>);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('applies filled variant by default', () => {
    const { container } = render(<Chip>Chip</Chip>);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('bg-muted', 'text-foreground');
  });

  it('applies outlined variant', () => {
    const { container } = render(<Chip variant="outlined">Chip</Chip>);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('bg-transparent', 'border');
  });

  it('applies size classes', () => {
    const { container } = render(<Chip size="sm">Small</Chip>);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('px-2', 'py-1', 'text-xs');
  });

  it('applies medium size by default', () => {
    const { container } = render(<Chip>Chip</Chip>);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('does not show dismiss button by default', () => {
    render(<Chip>Chip</Chip>);
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it('shows dismiss button when dismissible', () => {
    render(<Chip dismissible>Chip</Chip>);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Chip dismissible onDismiss={handleDismiss}>
        Chip
      </Chip>
    );

    const dismissButton = screen.getByRole('button', { name: 'Remove' });
    fireEvent.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<Chip className="custom-class">Chip</Chip>);
    const chip = container.firstChild as HTMLElement;
    expect(chip).toHaveClass('custom-class');
  });
});
