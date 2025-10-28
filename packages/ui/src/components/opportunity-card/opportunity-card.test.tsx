import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OpportunityCard } from './opportunity-card';
import { AlertCircle } from 'lucide-react';

describe('OpportunityCard', () => {
  it('renders with title and children', () => {
    render(
      <OpportunityCard title="Test Card">
        <p>Card content</p>
      </OpportunityCard>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <OpportunityCard
        title="Test Card"
        icon={<AlertCircle data-testid="card-icon" />}
      >
        Content
      </OpportunityCard>
    );

    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
  });

  it('applies urgency variants', () => {
    const { rerender, container } = render(
      <OpportunityCard title="Test" urgency="urgent">
        Content
      </OpportunityCard>
    );

    expect(container.firstChild).toHaveClass('border-urgent');

    rerender(
      <OpportunityCard title="Test" urgency="important">
        Content
      </OpportunityCard>
    );
    expect(container.firstChild).toHaveClass('border-warning');

    rerender(
      <OpportunityCard title="Test" urgency="normal">
        Content
      </OpportunityCard>
    );
    expect(container.firstChild).toHaveClass('border-border');

    rerender(
      <OpportunityCard title="Test" urgency="low">
        Content
      </OpportunityCard>
    );
    expect(container.firstChild).toHaveClass('border-muted');
  });

  it('renders privacy badge', () => {
    render(
      <OpportunityCard title="Test" privacyBadge="🔒 Local">
        Content
      </OpportunityCard>
    );

    expect(screen.getByText('🔒 Local')).toBeInTheDocument();
  });

  it('handles close button click', () => {
    const onClose = vi.fn();

    render(
      <OpportunityCard title="Test" onClose={onClose}>
        Content
      </OpportunityCard>
    );

    const closeButton = screen.getByLabelText('Close card');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(
      <OpportunityCard title="Test">
        Content
      </OpportunityCard>
    );

    expect(screen.queryByLabelText('Close card')).not.toBeInTheDocument();
  });

  it('renders visual element', () => {
    render(
      <OpportunityCard
        title="Test"
        visual={<div data-testid="visual-element">Visual</div>}
      >
        Content
      </OpportunityCard>
    );

    expect(screen.getByTestId('visual-element')).toBeInTheDocument();
  });

  it('renders context with icon', () => {
    render(
      <OpportunityCard title="Test" context="This is why now">
        Content
      </OpportunityCard>
    );

    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('This is why now')).toBeInTheDocument();
  });

  it('renders primary and secondary actions', () => {
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();

    render(
      <OpportunityCard
        title="Test"
        primaryAction={{ label: 'Primary', onClick: onPrimary }}
        secondaryAction={{ label: 'Secondary', onClick: onSecondary }}
      >
        Content
      </OpportunityCard>
    );

    const primaryButton = screen.getByText('Primary');
    const secondaryButton = screen.getByText('Secondary');

    expect(primaryButton).toBeInTheDocument();
    expect(secondaryButton).toBeInTheDocument();

    fireEvent.click(primaryButton);
    expect(onPrimary).toHaveBeenCalledTimes(1);

    fireEvent.click(secondaryButton);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('does not render footer when no actions are provided', () => {
    const { container } = render(
      <OpportunityCard title="Test">
        Content
      </OpportunityCard>
    );

    // Footer has border-t class
    const footer = container.querySelector('.border-t.border-border');
    expect(footer).not.toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(
      <OpportunityCard ref={ref} title="Test">
        Content
      </OpportunityCard>
    );

    expect(ref).toHaveBeenCalled();
  });
});
