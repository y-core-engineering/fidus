import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders without label', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('handles controlled checked state', () => {
    const { rerender } = render(<Checkbox label="Test" checked={false} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    rerender(<Checkbox label="Test" checked={true} />);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('handles uncontrolled checked state with defaultChecked', () => {
    render(<Checkbox label="Test" defaultChecked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('toggles on click', () => {
    render(<Checkbox label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles on label click', () => {
    render(<Checkbox label="Test" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Test');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(label);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles on Space key press', () => {
    render(<Checkbox label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('shows indeterminate state', () => {
    render(<Checkbox label="Test" indeterminate />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('disables checkbox when disabled prop is true', () => {
    render(<Checkbox label="Test" disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not toggle when disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test" disabled onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Checkbox label="Test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Checkbox label="Test" helperText="Please check this box" />);
    expect(screen.getByText('Please check this box')).toBeInTheDocument();
  });

  it('sets aria-invalid when error exists', () => {
    render(<Checkbox label="Test" error="Invalid" />);
    const input = screen.getByRole('checkbox', { hidden: true });
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<Checkbox label="Test" error="Invalid" />);
    const input = screen.getByRole('checkbox', { hidden: true });
    expect(input).toHaveAttribute('aria-describedby', 'Test-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<Checkbox label="Test" helperText="Help text" />);
    const input = screen.getByRole('checkbox', { hidden: true });
    expect(input).toHaveAttribute('aria-describedby', 'Test-helper');
  });

  it('has correct tabIndex when enabled', () => {
    render(<Checkbox label="Test" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('tabIndex', '0');
  });

  it('has correct tabIndex when disabled', () => {
    render(<Checkbox label="Test" disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('tabIndex', '-1');
  });

  it('renders checkmark when checked', () => {
    render(<Checkbox label="Test" checked={true} />);
    // Checkmark is rendered as an SVG, check for its presence
    const checkbox = screen.getByRole('checkbox');
    const checkmark = checkbox.querySelector('svg');
    expect(checkmark).toBeInTheDocument();
  });

  it('renders minus icon when indeterminate', () => {
    render(<Checkbox label="Test" indeterminate />);
    const checkbox = screen.getByRole('checkbox');
    const minusIcon = checkbox.querySelector('svg');
    expect(minusIcon).toBeInTheDocument();
  });

  it('does not render icon when unchecked', () => {
    render(<Checkbox label="Test" checked={false} />);
    const checkbox = screen.getByRole('checkbox');
    const icon = checkbox.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });
});
