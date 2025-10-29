import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailCard } from './detail-card';

describe('DetailCard', () => {
  it('renders with title and children', () => {
    render(
      <DetailCard title="Test Card">
        <p>Card content</p>
      </DetailCard>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(
      <DetailCard title="Test Card" subtitle="Subtitle text">
        Content
      </DetailCard>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('starts collapsed by default', () => {
    render(
      <DetailCard title="Test Card">
        <p>Hidden content</p>
      </DetailCard>
    );

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('starts expanded when defaultExpanded is true', () => {
    render(
      <DetailCard title="Test Card" defaultExpanded>
        <p>Visible content</p>
      </DetailCard>
    );

    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('toggles expansion on click', () => {
    render(
      <DetailCard title="Test Card">
        <p>Togglable content</p>
      </DetailCard>
    );

    // Initially collapsed
    expect(screen.queryByText('Togglable content')).not.toBeInTheDocument();

    // Click to expand
    const header = screen.getByText('Test Card');
    fireEvent.click(header);
    expect(screen.getByText('Togglable content')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(header);
    expect(screen.queryByText('Togglable content')).not.toBeInTheDocument();
  });

  it('toggles expansion on Enter key', () => {
    render(
      <DetailCard title="Test Card">
        <p>Keyboard content</p>
      </DetailCard>
    );

    const header = screen.getByRole('button', { name: /test card/i });

    // Press Enter to expand
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Keyboard content')).toBeInTheDocument();

    // Press Enter to collapse
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByText('Keyboard content')).not.toBeInTheDocument();
  });

  it('toggles expansion on Space key', () => {
    render(
      <DetailCard title="Test Card">
        <p>Space content</p>
      </DetailCard>
    );

    const header = screen.getByRole('button', { name: /test card/i });

    // Press Space to expand
    fireEvent.keyDown(header, { key: ' ', code: 'Space' });
    expect(screen.getByText('Space content')).toBeInTheDocument();
  });

  it('does not toggle when collapsible is false', () => {
    render(
      <DetailCard title="Test Card" collapsible={false}>
        <p>Always visible</p>
      </DetailCard>
    );

    // Content should be visible
    expect(screen.getByText('Always visible')).toBeInTheDocument();

    // Click should not hide content
    const header = screen.getByText('Test Card');
    fireEvent.click(header);
    expect(screen.getByText('Always visible')).toBeInTheDocument();
  });

  it('renders custom header slot', () => {
    render(
      <DetailCard
        title="Test Card"
        header={<span data-testid="custom-header">Custom</span>}
      >
        Content
      </DetailCard>
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  it('renders footer when expanded', () => {
    render(
      <DetailCard
        title="Test Card"
        defaultExpanded
        footer={<div data-testid="footer">Footer content</div>}
      >
        Content
      </DetailCard>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('hides footer when collapsed', () => {
    render(
      <DetailCard
        title="Test Card"
        footer={<div data-testid="footer">Footer content</div>}
      >
        Content
      </DetailCard>
    );

    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('shows footer when collapsible is false', () => {
    render(
      <DetailCard
        title="Test Card"
        collapsible={false}
        footer={<div data-testid="footer">Footer</div>}
      >
        Content
      </DetailCard>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(
      <DetailCard ref={ref} title="Test">
        Content
      </DetailCard>
    );

    expect(ref).toHaveBeenCalled();
  });
});
