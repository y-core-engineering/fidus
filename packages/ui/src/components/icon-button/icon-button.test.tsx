import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('renders children (icon)', () => {
    render(
      <IconButton aria-label="Settings">
        <svg data-testid="icon" />
      </IconButton>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('requires aria-label for accessibility', () => {
    render(
      <IconButton aria-label="Close">
        <svg />
      </IconButton>
    );
    const button = screen.getByLabelText('Close');
    expect(button).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(
      <IconButton aria-label="Icon">
        <svg />
      </IconButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies secondary variant', () => {
    render(
      <IconButton variant="secondary" aria-label="Icon">
        <svg />
      </IconButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-black');
  });

  it('applies small size', () => {
    render(
      <IconButton size="sm" aria-label="Icon">
        <svg />
      </IconButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('w-8');
  });

  it('applies medium size by default', () => {
    render(
      <IconButton aria-label="Icon">
        <svg />
      </IconButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  it('applies large size', () => {
    render(
      <IconButton size="lg" aria-label="Icon">
        <svg />
      </IconButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('w-12');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(
      <IconButton onClick={handleClick} aria-label="Icon">
        <svg />
      </IconButton>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(
      <IconButton disabled aria-label="Icon">
        <svg />
      </IconButton>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
