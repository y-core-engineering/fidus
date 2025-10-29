import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from './grid';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies column classes', () => {
    const { container } = render(
      <Grid cols="4">
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  it('applies gap classes', () => {
    const { container } = render(
      <Grid gap="lg">
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-lg');
  });

  it('applies default variants', () => {
    const { container } = render(
      <Grid>
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    expect(grid).toHaveClass('gap-md');
  });

  it('supports 1 column layout', () => {
    const { container } = render(
      <Grid cols="1">
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('supports 12 column layout', () => {
    const { container } = render(
      <Grid cols="12">
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-4', 'md:grid-cols-6', 'lg:grid-cols-12');
  });

  it('supports no gap', () => {
    const { container } = render(
      <Grid gap="none">
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('gap-0');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="custom-class">
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('custom-class');
  });
});
