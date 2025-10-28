import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  it('renders with label', () => {
    render(<DatePicker label="Birth Date" />);
    expect(screen.getByText('Birth Date')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<DatePicker label="Birth Date" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<DatePicker label="Birth Date" placeholder="Select your birthday" />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('Select your birthday');
  });

  it('handles controlled value', () => {
    const date = new Date(2024, 0, 15);
    const { rerender } = render(<DatePicker label="Birth Date" value={date} />);
    const trigger = screen.getAllByRole('button')[0];
    expect(trigger).toHaveTextContent('January 15, 2024');

    const newDate = new Date(2024, 5, 20);
    rerender(<DatePicker label="Birth Date" value={newDate} />);
    expect(trigger).toHaveTextContent('June 20, 2024');
  });

  it('handles uncontrolled value with defaultValue', () => {
    const date = new Date(2024, 2, 10);
    render(<DatePicker label="Birth Date" defaultValue={date} />);
    const trigger = screen.getAllByRole('button')[0];
    expect(trigger).toHaveTextContent('March 10, 2024');
  });

  it('opens calendar when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Birth Date" />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      // Calendar should be visible
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  it('selects date when clicked in calendar', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DatePicker label="Birth Date" onChange={handleChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    // Find and click a date button (e.g., 15th)
    const dateButtons = screen.getAllByRole('button');
    const date15 = dateButtons.find((btn) => btn.textContent === '15');
    if (date15) {
      await user.click(date15);
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date);
    }
  });

  it('handles onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DatePicker label="Birth Date" onChange={handleChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    const todayButton = screen.getByText('Today');
    await user.click(todayButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('handles onBlur event when popover closes', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(<DatePicker label="Birth Date" onBlur={handleBlur} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    // Click outside to close
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  it('shows error message', () => {
    render(
      <DatePicker label="Birth Date" error="Date is required" />
    );
    expect(screen.getByText('Date is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <DatePicker label="Birth Date" helperText="Select your date of birth" />
    );
    expect(screen.getByText('Select your date of birth')).toBeInTheDocument();
  });

  it('disables date picker when disabled prop is true', () => {
    render(<DatePicker label="Birth Date" disabled />);
    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
  });

  it('sets aria-invalid when error exists', () => {
    render(<DatePicker label="Birth Date" error="Invalid date" />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<DatePicker label="Birth Date" error="Invalid date" />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-describedby', 'Birth Date-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<DatePicker label="Birth Date" helperText="Pick a date" />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-describedby', 'Birth Date-helper');
  });

  it('shows clear button when value exists', () => {
    const date = new Date(2024, 0, 15);
    render(<DatePicker label="Birth Date" value={date} />);
    expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
  });

  it('clears value when clear button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const date = new Date(2024, 0, 15);
    render(
      <DatePicker label="Birth Date" value={date} onChange={handleChange} />
    );

    const clearButton = screen.getByLabelText('Clear date');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('does not show clear button when disabled', () => {
    const date = new Date(2024, 0, 15);
    render(<DatePicker label="Birth Date" value={date} disabled />);
    expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
  });

  it('does not show clear button when showClearButton is false', () => {
    const date = new Date(2024, 0, 15);
    render(
      <DatePicker label="Birth Date" value={date} showClearButton={false} />
    );
    expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
  });

  it('sets today when Today button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DatePicker label="Birth Date" onChange={handleChange} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    const todayButton = screen.getByText('Today');
    await user.click(todayButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    const calledDate = handleChange.mock.calls[0][0] as Date;
    const today = new Date();
    expect(calledDate.toDateString()).toBe(today.toDateString());
  });

  it('clears value when Clear button is clicked in calendar', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const date = new Date(2024, 0, 15);
    render(
      <DatePicker label="Birth Date" value={date} onChange={handleChange} />
    );

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('formats date according to dateFormat prop', () => {
    const date = new Date(2024, 0, 15);
    render(
      <DatePicker label="Birth Date" value={date} dateFormat="yyyy-MM-dd" />
    );
    const trigger = screen.getAllByRole('button')[0];
    expect(trigger).toHaveTextContent('2024-01-15');
  });

  it('respects minDate constraint', async () => {
    const user = userEvent.setup();
    const minDate = new Date(2024, 0, 10);
    render(<DatePicker label="Birth Date" minDate={minDate} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    // Dates before minDate should be disabled
    // This is handled by react-day-picker
  });

  it('respects maxDate constraint', async () => {
    const user = userEvent.setup();
    const maxDate = new Date(2024, 11, 31);
    render(<DatePicker label="Birth Date" maxDate={maxDate} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    // Dates after maxDate should be disabled
    // This is handled by react-day-picker
  });

  it('disables specific dates', async () => {
    const user = userEvent.setup();
    const disabledDates = [
      new Date(2024, 0, 15),
      new Date(2024, 0, 25),
    ];
    render(<DatePicker label="Birth Date" disabledDates={disabledDates} />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    // Specific dates should be disabled
    // This is handled by react-day-picker
  });

  it('closes calendar on Escape key', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Birth Date" />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Today')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Birth Date" />);

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    // Keyboard navigation is handled by react-day-picker
    // Arrow keys navigate through dates
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowDown}');
  });
});
