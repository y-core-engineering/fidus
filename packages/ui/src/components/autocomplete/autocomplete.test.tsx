import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Autocomplete } from './autocomplete';

const SUGGESTIONS = ['Python', 'TypeScript', 'JavaScript', 'Java', 'Go', 'Rust'];

describe('Autocomplete', () => {
  it('renders with label', () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        placeholder="Search skills..."
      />
    );
    expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument();
  });

  it('shows suggestions on focus', async () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} />);

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument();
    });
  });

  it('filters suggestions based on input', async () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} />);

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.type(input, 'Java');

    await waitFor(() => {
      const suggestions = screen.getByTestId('autocomplete-suggestions');
      expect(suggestions).toHaveTextContent('JavaScript');
      expect(suggestions).toHaveTextContent('Java');
      expect(suggestions).not.toHaveTextContent('Python');
    });
  });

  it('selects suggestion on click', async () => {
    const onSelect = vi.fn();
    render(
      <Autocomplete label="Skills" suggestions={SUGGESTIONS} onSelect={onSelect} />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument();
    });

    const pythonOption = screen.getByText('Python');
    await userEvent.click(pythonOption);

    expect(onSelect).toHaveBeenCalledWith('Python');
    expect(input).toHaveValue('Python');
  });

  it('navigates suggestions with arrow keys', async () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} />);

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument();
    });

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByTestId('autocomplete-option-0')).toHaveClass('bg-primary/10');

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByTestId('autocomplete-option-1')).toHaveClass('bg-primary/10');

    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByTestId('autocomplete-option-0')).toHaveClass('bg-primary/10');
  });

  it('selects highlighted suggestion on Enter', async () => {
    const onSelect = vi.fn();
    render(
      <Autocomplete label="Skills" suggestions={SUGGESTIONS} onSelect={onSelect} />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument();
    });

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('Python');
  });

  it('closes suggestions on Escape', async () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} />);

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-suggestions')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByTestId('autocomplete-suggestions')).not.toBeInTheDocument();
    });
  });

  it('allows custom value on Enter when allowCustomValue is true', async () => {
    const onSelect = vi.fn();
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        onSelect={onSelect}
        allowCustomValue
      />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.type(input, 'CustomSkill');
    await userEvent.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('CustomSkill');
  });

  it('shows no results message when no suggestions match', async () => {
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        allowCustomValue={false}
      />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.type(input, 'xyz');

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-no-results')).toHaveTextContent(
        'No results found'
      );
    });
  });

  it('shows add custom value message when allowCustomValue is true', async () => {
    render(
      <Autocomplete label="Skills" suggestions={SUGGESTIONS} allowCustomValue />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.type(input, 'xyz');

    await waitFor(() => {
      expect(screen.getByTestId('autocomplete-no-results')).toHaveTextContent(
        'Press Enter to add "xyz"'
      );
    });
  });

  it('clears input on clear button click', async () => {
    const onClear = vi.fn();
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        value="Python"
        clearable
        onClear={onClear}
      />
    );

    const clearButton = screen.getByTestId('autocomplete-clear');
    await userEvent.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });

  it('respects maxSuggestions limit', async () => {
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        maxSuggestions={3}
      />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.click(input);

    await waitFor(() => {
      const suggestions = screen.getByTestId('autocomplete-suggestions');
      const items = suggestions.querySelectorAll('[data-suggestion-item]');
      expect(items).toHaveLength(3);
    });
  });

  it('is disabled when disabled prop is true', () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} disabled />);

    const input = screen.getByTestId('autocomplete-input');
    expect(input).toBeDisabled();
  });

  it('shows error state', () => {
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByTestId('autocomplete-input')).toHaveClass('border-error');
  });

  it('shows helper text', () => {
    render(
      <Autocomplete
        label="Skills"
        suggestions={SUGGESTIONS}
        helperText="Select your skills"
      />
    );

    expect(screen.getByText('Select your skills')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    render(
      <Autocomplete label="Skills" suggestions={SUGGESTIONS} onChange={onChange} />
    );

    const input = screen.getByTestId('autocomplete-input');
    await userEvent.type(input, 'P');

    expect(onChange).toHaveBeenCalledWith('P');
  });

  it('works as controlled component', () => {
    const { rerender } = render(
      <Autocomplete label="Skills" suggestions={SUGGESTIONS} value="Python" />
    );

    expect(screen.getByTestId('autocomplete-input')).toHaveValue('Python');

    rerender(
      <Autocomplete label="Skills" suggestions={SUGGESTIONS} value="TypeScript" />
    );

    expect(screen.getByTestId('autocomplete-input')).toHaveValue('TypeScript');
  });

  it('has correct ARIA attributes', async () => {
    render(<Autocomplete label="Skills" suggestions={SUGGESTIONS} />);

    const input = screen.getByTestId('autocomplete-input');

    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(input);

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
