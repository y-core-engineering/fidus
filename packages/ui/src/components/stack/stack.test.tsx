import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies vertical direction by default', () => {
    const { container } = render(
      <Stack>
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('flex-col');
  });

  it('applies horizontal direction', () => {
    const { container } = render(
      <Stack direction="horizontal">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('flex-row');
  });

  it('applies spacing classes', () => {
    const { container } = render(
      <Stack spacing="lg">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('gap-lg');
  });

  it('applies align classes', () => {
    const { container } = render(
      <Stack align="center">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('items-center');
  });

  it('applies justify classes', () => {
    const { container } = render(
      <Stack justify="between">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('justify-between');
  });

  it('applies wrap class', () => {
    const { container } = render(
      <Stack wrap>
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('flex-wrap');
  });

  it('supports no spacing', () => {
    const { container } = render(
      <Stack spacing="none">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('gap-0');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Stack className="custom-class">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass('custom-class');
  });

  it('combines multiple variants', () => {
    const { container } = render(
      <Stack direction="horizontal" spacing="xl" align="center" justify="between" wrap>
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack).toHaveClass(
      'flex-row',
      'gap-xl',
      'items-center',
      'justify-between',
      'flex-wrap'
    );
  });
});
