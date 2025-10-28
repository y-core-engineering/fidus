import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyCard } from './empty-card';
import { Inbox } from 'lucide-react';

describe('EmptyCard', () => {
  it('renders with title', () => {
    render(<EmptyCard title="No items found" />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <EmptyCard
        title="No items"
        description="Try adding some items to get started"
      />
    );

    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(
      screen.getByText('Try adding some items to get started')
    ).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <EmptyCard title="Empty" icon={<Inbox data-testid="empty-icon" />} />
    );

    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  it('renders with illustration', () => {
    render(
      <EmptyCard
        title="Empty"
        illustration={<div data-testid="illustration">SVG</div>}
      />
    );

    expect(screen.getByTestId('illustration')).toBeInTheDocument();
  });

  it('prefers illustration over icon', () => {
    render(
      <EmptyCard
        title="Empty"
        icon={<Inbox data-testid="icon" />}
        illustration={<div data-testid="illustration">SVG</div>}
      />
    );

    expect(screen.getByTestId('illustration')).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('renders primary action', () => {
    const onClick = vi.fn();

    render(
      <EmptyCard
        title="Empty"
        action={{ label: 'Add Item', onClick }}
      />
    );

    const button = screen.getByText('Add Item');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary action', () => {
    const onClick = vi.fn();

    render(
      <EmptyCard
        title="Empty"
        secondaryAction={{ label: 'Learn More', onClick }}
      />
    );

    const button = screen.getByText('Learn More');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders both actions', () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();

    render(
      <EmptyCard
        title="Empty"
        action={{ label: 'Primary', onClick: onPrimary }}
        secondaryAction={{ label: 'Secondary', onClick: onSecondary }}
      />
    );

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { rerender, container } = render(
      <EmptyCard title="Test" size="sm" />
    );

    expect(container.firstChild).toHaveClass('p-6');
    expect(container.firstChild).toHaveClass('min-h-[200px]');

    rerender(<EmptyCard title="Test" size="md" />);
    expect(container.firstChild).toHaveClass('p-8');
    expect(container.firstChild).toHaveClass('min-h-[300px]');

    rerender(<EmptyCard title="Test" size="lg" />);
    expect(container.firstChild).toHaveClass('p-12');
    expect(container.firstChild).toHaveClass('min-h-[400px]');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(<EmptyCard ref={ref} title="Test" />);

    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <EmptyCard title="Test" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
