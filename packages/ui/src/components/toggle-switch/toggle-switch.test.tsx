import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  it('renders without label', () => {
    render(<ToggleSwitch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<ToggleSwitch label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('handles controlled checked state', () => {
    const { rerender } = render(<ToggleSwitch label="Test" checked={false} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    rerender(<ToggleSwitch label="Test" checked={true} />);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('handles uncontrolled checked state with defaultChecked', () => {
    render(<ToggleSwitch label="Test" defaultChecked={true} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<ToggleSwitch label="Test" onChange={handleChange} />);

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('toggles on click', () => {
    render(<ToggleSwitch label="Test" />);
    const toggle = screen.getByRole('switch');

    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles on label click', () => {
    render(<ToggleSwitch label="Test" />);
    const toggle = screen.getByRole('switch');
    const label = screen.getByText('Test');

    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(label);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles on Space key press', () => {
    render(<ToggleSwitch label="Test" />);
    const toggle = screen.getByRole('switch');

    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.keyDown(toggle, { key: ' ' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(toggle, { key: ' ' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('disables toggle when disabled prop is true', () => {
    render(<ToggleSwitch label="Test" disabled />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not toggle when disabled', () => {
    const handleChange = vi.fn();
    render(<ToggleSwitch label="Test" disabled onChange={handleChange} />);
    const toggle = screen.getByRole('switch');

    fireEvent.click(toggle);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<ToggleSwitch label="Test" error="This option is required" />);
    expect(screen.getByText('This option is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <ToggleSwitch label="Test" helperText="Enable this to receive alerts" />
    );
    expect(
      screen.getByText('Enable this to receive alerts')
    ).toBeInTheDocument();
  });

  it('sets aria-invalid when error exists', () => {
    render(<ToggleSwitch label="Test" error="Invalid" />);
    const input = screen.getByRole('switch', { hidden: true });
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<ToggleSwitch label="Test" error="Invalid" />);
    const input = screen.getByRole('switch', { hidden: true });
    expect(input).toHaveAttribute('aria-describedby', 'Test-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<ToggleSwitch label="Test" helperText="Help text" />);
    const input = screen.getByRole('switch', { hidden: true });
    expect(input).toHaveAttribute('aria-describedby', 'Test-helper');
  });

  it('has correct tabIndex when enabled', () => {
    render(<ToggleSwitch label="Test" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('tabIndex', '0');
  });

  it('has correct tabIndex when disabled', () => {
    render(<ToggleSwitch label="Test" disabled />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('tabIndex', '-1');
  });

  it('renders with small size', () => {
    render(<ToggleSwitch label="Test" size="sm" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('h-5', 'w-9');
  });

  it('renders with medium size by default', () => {
    render(<ToggleSwitch label="Test" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('h-6', 'w-11');
  });

  it('renders with large size', () => {
    render(<ToggleSwitch label="Test" size="lg" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('h-7', 'w-14');
  });

  it('renders label on right by default', () => {
    render(<ToggleSwitch label="Test" />);
    const container = screen.getByRole('switch').parentElement;
    expect(container).not.toHaveClass('flex-row-reverse');
  });

  it('renders label on left when labelPosition is left', () => {
    render(<ToggleSwitch label="Test" labelPosition="left" />);
    const container = screen.getByRole('switch').parentElement;
    expect(container).toHaveClass('flex-row-reverse');
  });

  it('applies correct background color when checked', () => {
    render(<ToggleSwitch label="Test" checked={true} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('bg-primary');
  });

  it('applies correct background color when unchecked', () => {
    render(<ToggleSwitch label="Test" checked={false} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('bg-muted');
  });

  it('translates thumb when checked', () => {
    render(<ToggleSwitch label="Test" checked={true} />);
    const toggle = screen.getByRole('switch');
    const thumb = toggle.querySelector('span');
    expect(thumb).toHaveClass('translate-x-5'); // Default md size
  });

  it('does not translate thumb when unchecked', () => {
    render(<ToggleSwitch label="Test" checked={false} />);
    const toggle = screen.getByRole('switch');
    const thumb = toggle.querySelector('span');
    expect(thumb).toHaveClass('translate-x-0');
  });
});
