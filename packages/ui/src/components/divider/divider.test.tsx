import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './divider';

describe('Divider', () => {
  it('renders as hr element', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('applies horizontal orientation by default', () => {
    const { container } = render(<Divider />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveClass('w-full', 'border-t');
  });

  it('applies vertical orientation', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveClass('h-full', 'border-l');
  });

  it('applies spacing for horizontal divider', () => {
    const { container } = render(<Divider spacing="lg" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveClass('my-6');
  });

  it('applies spacing for vertical divider', () => {
    const { container } = render(<Divider orientation="vertical" spacing="lg" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveClass('mx-6');
  });

  it('supports no spacing', () => {
    const { container } = render(<Divider spacing="none" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).not.toHaveClass('my-2', 'my-4', 'my-6');
  });

  it('applies custom className', () => {
    const { container } = render(<Divider className="custom-class" />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveClass('custom-class');
  });
});
