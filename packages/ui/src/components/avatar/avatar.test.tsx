import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders with image', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
    const img = screen.getByAlt('User Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders with initials as fallback', () => {
    render(<Avatar fallback="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single name initials', () => {
    render(<Avatar fallback="John" />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('renders icon when no src or fallback', () => {
    const { container } = render(<Avatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('falls back to initials on image error', () => {
    render(<Avatar src="https://example.com/broken.jpg" fallback="John Doe" />);

    const img = screen.getByAlt('Avatar');
    fireEvent.error(img);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies circle shape by default', () => {
    const { container } = render(<Avatar />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('rounded-full');
  });

  it('applies square shape', () => {
    const { container } = render(<Avatar shape="square" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('rounded-md');
  });

  it('applies size classes', () => {
    const { container } = render(<Avatar size="sm" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-8', 'w-8');
  });

  it('applies medium size by default', () => {
    const { container } = render(<Avatar />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-10', 'w-10');
  });

  it('applies large size', () => {
    const { container } = render(<Avatar size="lg" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-12', 'w-12');
  });

  it('applies xl size', () => {
    const { container } = render(<Avatar size="xl" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('h-16', 'w-16');
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar className="custom-class" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('custom-class');
  });
});
