import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './text-area';

describe('TextArea', () => {
  it('renders with label', () => {
    render(<TextArea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<TextArea label="Description" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <TextArea label="Description" placeholder="Enter your description" />
    );
    expect(
      screen.getByPlaceholderText('Enter your description')
    ).toBeInTheDocument();
  });

  it('handles controlled value', () => {
    const { rerender } = render(<TextArea label="Description" value="test" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('test');

    rerender(<TextArea label="Description" value="updated" />);
    expect(textarea).toHaveValue('updated');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(<TextArea label="Description" defaultValue="default text" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('default text');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<TextArea label="Description" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus event', () => {
    const handleFocus = vi.fn();
    render(<TextArea label="Description" onFocus={handleFocus} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur event', () => {
    const handleBlur = vi.fn();
    render(<TextArea label="Description" onBlur={handleBlur} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.blur(textarea);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows error message', () => {
    render(<TextArea label="Description" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <TextArea label="Description" helperText="Describe your experience" />
    );
    expect(screen.getByText('Describe your experience')).toBeInTheDocument();
  });

  it('shows error icon when there is an error', () => {
    render(<TextArea label="Description" error="Invalid" value="test" />);
    expect(screen.getByLabelText('Error')).toBeInTheDocument();
  });

  it('shows valid icon when textarea is valid', () => {
    render(<TextArea label="Description" value="Valid description" />);
    // Blur to trigger valid state
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.blur(textarea);
    expect(screen.getByLabelText('Valid')).toBeInTheDocument();
  });

  it('shows character count when maxLength is set', () => {
    render(
      <TextArea
        label="Bio"
        maxLength={200}
        showCharCount
        value="Hello world"
      />
    );
    expect(screen.getByText('11 / 200')).toBeInTheDocument();
  });

  it('respects maxLength constraint', () => {
    render(<TextArea label="Bio" maxLength={100} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(100);
  });

  it('respects rows prop', () => {
    render(<TextArea label="Bio" rows={10} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(10);
  });

  it('applies default rows when not specified', () => {
    render(<TextArea label="Bio" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(4);
  });

  it('disables textarea when disabled prop is true', () => {
    render(<TextArea label="Description" disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('sets aria-invalid when error exists', () => {
    render(<TextArea label="Description" error="Invalid input" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<TextArea label="Description" error="Invalid input" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-describedby', 'Description-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<TextArea label="Description" helperText="Enter description" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-describedby', 'Description-helper');
  });

  it('hides character count when showCharCount is false', () => {
    render(
      <TextArea
        label="Bio"
        maxLength={100}
        showCharCount={false}
        value="test"
      />
    );
    expect(screen.queryByText(/\/ 100/)).not.toBeInTheDocument();
  });

  it('shows character count by default when maxLength is set', () => {
    render(<TextArea label="Bio" maxLength={100} value="test" />);
    expect(screen.getByText('4 / 100')).toBeInTheDocument();
  });

  it('applies resize variant classes', () => {
    const { rerender } = render(<TextArea label="Bio" resize="none" />);
    let textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-none');

    rerender(<TextArea label="Bio" resize="vertical" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-y');

    rerender(<TextArea label="Bio" resize="horizontal" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize-x');

    rerender(<TextArea label="Bio" resize="both" />);
    textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('resize');
  });
});
