import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimePicker } from './time-picker';

describe('TimePicker', () => {
  it('renders with label', () => {
    render(<TimePicker label="Meeting Time" />);
    expect(screen.getByText('Meeting Time')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<TimePicker label="Meeting Time" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders hour and minute selects', () => {
    render(<TimePicker label="Meeting Time" />);
    expect(screen.getByLabelText('Hour')).toBeInTheDocument();
    expect(screen.getByLabelText('Minute')).toBeInTheDocument();
  });

  it('renders period select in 12-hour format', () => {
    render(<TimePicker label="Meeting Time" format="12" />);
    expect(screen.getByLabelText('Period')).toBeInTheDocument();
  });

  it('does not render period select in 24-hour format', () => {
    render(<TimePicker label="Meeting Time" format="24" />);
    expect(screen.queryByLabelText('Period')).not.toBeInTheDocument();
  });

  it('handles controlled value in 24-hour format', () => {
    const { rerender } = render(
      <TimePicker label="Meeting Time" value="14:30" format="24" />
    );
    expect(screen.getByLabelText('Hour')).toHaveValue('14');
    expect(screen.getByLabelText('Minute')).toHaveValue('30');

    rerender(<TimePicker label="Meeting Time" value="09:15" format="24" />);
    expect(screen.getByLabelText('Hour')).toHaveValue('09');
    expect(screen.getByLabelText('Minute')).toHaveValue('15');
  });

  it('handles controlled value in 12-hour format', () => {
    render(<TimePicker label="Meeting Time" value="14:30" format="12" />);
    expect(screen.getByLabelText('Hour')).toHaveValue('02');
    expect(screen.getByLabelText('Minute')).toHaveValue('30');
    expect(screen.getByLabelText('Period')).toHaveValue('PM');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(<TimePicker label="Meeting Time" defaultValue="09:45" format="24" />);
    expect(screen.getByLabelText('Hour')).toHaveValue('09');
    expect(screen.getByLabelText('Minute')).toHaveValue('45');
  });

  it('changes hour when hour select is changed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    const minuteSelect = screen.getByLabelText('Minute');

    await user.selectOptions(hourSelect, '14');
    await user.selectOptions(minuteSelect, '30');

    expect(handleChange).toHaveBeenCalledWith('14:30');
  });

  it('changes minute when minute select is changed', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    const minuteSelect = screen.getByLabelText('Minute');

    await user.selectOptions(hourSelect, '10');
    await user.selectOptions(minuteSelect, '15');

    expect(handleChange).toHaveBeenCalledWith('10:15');
  });

  it('changes period in 12-hour format', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" format="12" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    const minuteSelect = screen.getByLabelText('Minute');
    const periodSelect = screen.getByLabelText('Period');

    await user.selectOptions(hourSelect, '02');
    await user.selectOptions(minuteSelect, '30');
    await user.selectOptions(periodSelect, 'PM');

    expect(handleChange).toHaveBeenCalledWith('14:30');
  });

  it('converts 12 AM to 00:00 in 24-hour format', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" format="12" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    const minuteSelect = screen.getByLabelText('Minute');
    const periodSelect = screen.getByLabelText('Period');

    await user.selectOptions(hourSelect, '12');
    await user.selectOptions(minuteSelect, '00');
    await user.selectOptions(periodSelect, 'AM');

    expect(handleChange).toHaveBeenCalledWith('00:00');
  });

  it('converts 12 PM to 12:00 in 24-hour format', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" format="12" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    const minuteSelect = screen.getByLabelText('Minute');
    const periodSelect = screen.getByLabelText('Period');

    await user.selectOptions(hourSelect, '12');
    await user.selectOptions(minuteSelect, '00');
    await user.selectOptions(periodSelect, 'PM');

    expect(handleChange).toHaveBeenCalledWith('12:00');
  });

  it('handles onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    const minuteSelect = screen.getByLabelText('Minute');

    await user.selectOptions(hourSelect, '14');
    await user.selectOptions(minuteSelect, '30');

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles onBlur event', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(<TimePicker label="Meeting Time" onBlur={handleBlur} />);

    const hourSelect = screen.getByLabelText('Hour');
    await user.click(hourSelect);
    await user.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<TimePicker label="Meeting Time" error="Time is required" />);
    expect(screen.getByText('Time is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <TimePicker label="Meeting Time" helperText="Select meeting time" />
    );
    expect(screen.getByText('Select meeting time')).toBeInTheDocument();
  });

  it('disables inputs when disabled prop is true', () => {
    render(<TimePicker label="Meeting Time" disabled />);
    expect(screen.getByLabelText('Hour')).toBeDisabled();
    expect(screen.getByLabelText('Minute')).toBeDisabled();
  });

  it('sets aria-invalid when error exists', () => {
    render(<TimePicker label="Meeting Time" error="Invalid time" />);
    const hourSelect = screen.getByLabelText('Hour');
    expect(hourSelect).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<TimePicker label="Meeting Time" error="Invalid time" />);
    const hourSelect = screen.getByLabelText('Hour');
    expect(hourSelect).toHaveAttribute('aria-describedby', 'Meeting Time-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<TimePicker label="Meeting Time" helperText="Pick a time" />);
    const hourSelect = screen.getByLabelText('Hour');
    expect(hourSelect).toHaveAttribute('aria-describedby', 'Meeting Time-helper');
  });

  it('shows clear button when value exists', () => {
    render(<TimePicker label="Meeting Time" value="14:30" />);
    expect(screen.getByLabelText('Clear time')).toBeInTheDocument();
  });

  it('clears value when clear button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <TimePicker label="Meeting Time" value="14:30" onChange={handleChange} />
    );

    const clearButton = screen.getByLabelText('Clear time');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
    expect(screen.getByLabelText('Hour')).toHaveValue('');
    expect(screen.getByLabelText('Minute')).toHaveValue('');
  });

  it('does not show clear button when disabled', () => {
    render(<TimePicker label="Meeting Time" value="14:30" disabled />);
    expect(screen.queryByLabelText('Clear time')).not.toBeInTheDocument();
  });

  it('does not show clear button when showClearButton is false', () => {
    render(
      <TimePicker label="Meeting Time" value="14:30" showClearButton={false} />
    );
    expect(screen.queryByLabelText('Clear time')).not.toBeInTheDocument();
  });

  it('respects minuteInterval prop', () => {
    render(<TimePicker label="Meeting Time" minuteInterval={15} />);
    const minuteSelect = screen.getByLabelText('Minute');
    const options = Array.from(
      minuteSelect.querySelectorAll('option')
    ).map((opt) => opt.value);

    expect(options).toContain('00');
    expect(options).toContain('15');
    expect(options).toContain('30');
    expect(options).toContain('45');
    expect(options).not.toContain('05');
    expect(options).not.toContain('10');
  });

  it('generates correct hour options for 12-hour format', () => {
    render(<TimePicker label="Meeting Time" format="12" />);
    const hourSelect = screen.getByLabelText('Hour');
    const options = Array.from(hourSelect.querySelectorAll('option')).map(
      (opt) => opt.value
    );

    expect(options).toContain('01');
    expect(options).toContain('12');
    expect(options).not.toContain('00');
    expect(options).not.toContain('13');
  });

  it('generates correct hour options for 24-hour format', () => {
    render(<TimePicker label="Meeting Time" format="24" />);
    const hourSelect = screen.getByLabelText('Hour');
    const options = Array.from(hourSelect.querySelectorAll('option')).map(
      (opt) => opt.value
    );

    expect(options).toContain('00');
    expect(options).toContain('23');
    expect(options).not.toContain('24');
  });

  it('supports keyboard navigation with Arrow keys', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<TimePicker label="Meeting Time" onChange={handleChange} />);

    const hourSelect = screen.getByLabelText('Hour');
    hourSelect.focus();

    // Arrow down should change selection
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    // Verify selection changed
    expect(hourSelect.value).not.toBe('');
  });

  it('supports minuteInterval of 1', () => {
    render(<TimePicker label="Meeting Time" minuteInterval={1} />);
    const minuteSelect = screen.getByLabelText('Minute');
    const options = Array.from(minuteSelect.querySelectorAll('option')).map(
      (opt) => opt.value
    );

    expect(options.length).toBe(61); // 60 minutes + placeholder
    expect(options).toContain('00');
    expect(options).toContain('01');
    expect(options).toContain('59');
  });

  it('supports minuteInterval of 30', () => {
    render(<TimePicker label="Meeting Time" minuteInterval={30} />);
    const minuteSelect = screen.getByLabelText('Minute');
    const options = Array.from(minuteSelect.querySelectorAll('option')).map(
      (opt) => opt.value
    );

    expect(options).toContain('00');
    expect(options).toContain('30');
    expect(options).not.toContain('15');
  });
});
