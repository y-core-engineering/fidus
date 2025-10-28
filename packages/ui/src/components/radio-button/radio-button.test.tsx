import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioButton, RadioGroup } from './radio-button';

describe('RadioButton', () => {
  it('renders with label', () => {
    render(<RadioButton label="Option 1" value="opt1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('handles checked state', () => {
    render(<RadioButton label="Option 1" value="opt1" checked={true} />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(
      <RadioButton label="Option 1" value="opt1" onChange={handleChange} />
    );

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('selects on click', () => {
    const handleChange = vi.fn();
    render(
      <RadioButton label="Option 1" value="opt1" onChange={handleChange} />
    );

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('selects on label click', () => {
    const handleChange = vi.fn();
    render(
      <RadioButton label="Option 1" value="opt1" onChange={handleChange} />
    );

    const label = screen.getByText('Option 1');
    fireEvent.click(label);

    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('selects on Space key press', () => {
    const handleChange = vi.fn();
    render(
      <RadioButton label="Option 1" value="opt1" onChange={handleChange} />
    );

    const radio = screen.getByRole('radio');
    fireEvent.keyDown(radio, { key: ' ' });

    expect(handleChange).toHaveBeenCalledWith('opt1');
  });

  it('disables radio when disabled prop is true', () => {
    render(<RadioButton label="Option 1" value="opt1" disabled />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not select when disabled', () => {
    const handleChange = vi.fn();
    render(
      <RadioButton
        label="Option 1"
        value="opt1"
        disabled
        onChange={handleChange}
      />
    );

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('has correct tabIndex when enabled', () => {
    render(<RadioButton label="Option 1" value="opt1" />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('tabIndex', '0');
  });

  it('has correct tabIndex when disabled', () => {
    render(<RadioButton label="Option 1" value="opt1" disabled />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('tabIndex', '-1');
  });

  it('renders inner circle when checked', () => {
    render(<RadioButton label="Option 1" value="opt1" checked={true} />);
    const radio = screen.getByRole('radio');
    const innerCircle = radio.querySelector('.bg-primary');
    expect(innerCircle).toBeInTheDocument();
  });

  it('does not render inner circle when unchecked', () => {
    render(<RadioButton label="Option 1" value="opt1" checked={false} />);
    const radio = screen.getByRole('radio');
    const innerCircle = radio.querySelector('.bg-primary');
    expect(innerCircle).not.toBeInTheDocument();
  });
});

describe('RadioGroup', () => {
  it('renders group label', () => {
    render(
      <RadioGroup label="Choose an option">
        <RadioButton label="Option 1" value="opt1" />
      </RadioGroup>
    );
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('handles controlled value', () => {
    const { rerender } = render(
      <RadioGroup label="Options" value="opt1">
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );

    let radio1 = screen.getByLabelText('Option 1');
    let radio2 = screen.getByLabelText('Option 2');
    expect(radio1).toHaveAttribute('aria-checked', 'true');
    expect(radio2).toHaveAttribute('aria-checked', 'false');

    rerender(
      <RadioGroup label="Options" value="opt2">
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );

    radio1 = screen.getByLabelText('Option 1');
    radio2 = screen.getByLabelText('Option 2');
    expect(radio1).toHaveAttribute('aria-checked', 'false');
    expect(radio2).toHaveAttribute('aria-checked', 'true');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(
      <RadioGroup label="Options" defaultValue="opt2">
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );

    const radio1 = screen.getByLabelText('Option 1');
    const radio2 = screen.getByLabelText('Option 2');
    expect(radio1).toHaveAttribute('aria-checked', 'false');
    expect(radio2).toHaveAttribute('aria-checked', 'true');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup label="Options" onChange={handleChange}>
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );

    const radio2 = screen.getByLabelText('Option 2');
    fireEvent.click(radio2);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('opt2');
  });

  it('changes selection on click', () => {
    render(
      <RadioGroup label="Options" defaultValue="opt1">
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );

    const radio2 = screen.getByLabelText('Option 2');
    fireEvent.click(radio2);

    expect(screen.getByLabelText('Option 1')).toHaveAttribute(
      'aria-checked',
      'false'
    );
    expect(screen.getByLabelText('Option 2')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('disables all radios when group disabled', () => {
    render(
      <RadioGroup label="Options" disabled>
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );

    const radio1 = screen.getByLabelText('Option 1');
    const radio2 = screen.getByLabelText('Option 2');
    expect(radio1).toHaveAttribute('aria-disabled', 'true');
    expect(radio2).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows error message', () => {
    render(
      <RadioGroup label="Options" error="Please select an option">
        <RadioButton label="Option 1" value="opt1" />
      </RadioGroup>
    );
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <RadioGroup label="Options" helperText="Choose one option">
        <RadioButton label="Option 1" value="opt1" />
      </RadioGroup>
    );
    expect(screen.getByText('Choose one option')).toBeInTheDocument();
  });

  it('sets aria-invalid when error exists', () => {
    render(
      <RadioGroup label="Options" error="Invalid selection">
        <RadioButton label="Option 1" value="opt1" />
      </RadioGroup>
    );
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with horizontal orientation', () => {
    render(
      <RadioGroup label="Options" orientation="horizontal">
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toHaveClass('flex-row');
  });

  it('renders with vertical orientation by default', () => {
    render(
      <RadioGroup label="Options">
        <RadioButton label="Option 1" value="opt1" />
        <RadioButton label="Option 2" value="opt2" />
      </RadioGroup>
    );
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toHaveClass('flex-col');
  });
});
