import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from './text-input';

describe('TextInput', () => {
  it('renders with label', () => {
    render(<TextInput label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<TextInput label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<TextInput label="Email" placeholder="Enter your email" />);
    expect(
      screen.getByPlaceholderText('Enter your email')
    ).toBeInTheDocument();
  });

  it('handles controlled value', () => {
    const { rerender } = render(<TextInput label="Email" value="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');

    rerender(<TextInput label="Email" value="updated" />);
    expect(input).toHaveValue('updated');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(<TextInput label="Email" defaultValue="default" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('default');
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<TextInput label="Email" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus event', () => {
    const handleFocus = vi.fn();
    render(<TextInput label="Email" onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur event', () => {
    const handleBlur = vi.fn();
    render(<TextInput label="Email" onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows error message', () => {
    render(<TextInput label="Email" error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<TextInput label="Email" helperText="Enter a valid email" />);
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('shows error icon when there is an error', () => {
    render(
      <TextInput label="Email" error="Invalid" showErrorIcon value="test" />
    );
    expect(screen.getByLabelText('Error')).toBeInTheDocument();
  });

  it('shows valid icon when input is valid', () => {
    render(<TextInput label="Email" showValidIcon value="test@test.com" />);
    // Blur to trigger valid state
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByLabelText('Valid')).toBeInTheDocument();
  });

  it('shows character count when maxLength is set', () => {
    render(
      <TextInput
        label="Bio"
        maxLength={100}
        showCharCount
        value="Hello"
      />
    );
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('respects maxLength constraint', () => {
    render(<TextInput label="Code" maxLength={5} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(5);
  });

  it('renders different input types', () => {
    const { rerender } = render(<TextInput label="Email" type="email" />);
    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');

    rerender(<TextInput label="Password" type="password" />);
    input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    rerender(<TextInput label="Search" type="search" />);
    input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.type).toBe('search');
  });

  it('toggles password visibility', () => {
    render(
      <TextInput
        label="Password"
        type="password"
        showPasswordToggle
        value="secret"
      />
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleButton = screen.getByLabelText('Show password');
    fireEvent.click(toggleButton);

    expect(input.type).toBe('text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<TextInput label="Email" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('sets aria-invalid when error exists', () => {
    render(<TextInput label="Email" error="Invalid email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<TextInput label="Email" error="Invalid email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'Email-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<TextInput label="Email" helperText="Enter your email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'Email-helper');
  });

  it('renders with prefix', () => {
    render(
      <TextInput
        label="Website"
        prefix={<span data-testid="prefix">https://</span>}
      />
    );
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
  });

  it('renders with suffix', () => {
    render(
      <TextInput
        label="Domain"
        suffix={<span data-testid="suffix">.com</span>}
        value="example"
      />
    );
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });
});
