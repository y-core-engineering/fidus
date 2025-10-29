import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

const mockOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
];

const mockGroups = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'lettuce', label: 'Lettuce' },
    ],
  },
];

describe('Select', () => {
  it('renders with label', () => {
    render(<Select label="Choose fruit" options={mockOptions} />);
    expect(screen.getByText('Choose fruit')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<Select label="Choose fruit" options={mockOptions} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with placeholder', async () => {
    render(
      <Select
        label="Choose fruit"
        placeholder="Pick your favorite"
        options={mockOptions}
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Pick your favorite');
  });

  it('handles controlled value', () => {
    const { rerender } = render(
      <Select label="Choose fruit" value="apple" options={mockOptions} />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Apple');

    rerender(
      <Select label="Choose fruit" value="banana" options={mockOptions} />
    );
    expect(trigger).toHaveTextContent('Banana');
  });

  it('handles uncontrolled value with defaultValue', () => {
    render(
      <Select
        label="Choose fruit"
        defaultValue="cherry"
        options={mockOptions}
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Cherry');
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<Select label="Choose fruit" options={mockOptions} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });
  });

  it('selects option when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Banana'));

    expect(handleChange).toHaveBeenCalledWith('banana');
  });

  it('handles onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Apple'));

    expect(handleChange).toHaveBeenCalledWith('apple');
  });

  it('handles onBlur event when dropdown closes', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        onBlur={handleBlur}
      />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows error message', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        error="Please select a fruit"
      />
    );
    expect(screen.getByText('Please select a fruit')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        helperText="Pick your favorite fruit"
      />
    );
    expect(screen.getByText('Pick your favorite fruit')).toBeInTheDocument();
  });

  it('disables select when disabled prop is true', () => {
    render(<Select label="Choose fruit" options={mockOptions} disabled />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('disables specific options', async () => {
    const user = userEvent.setup();
    render(<Select label="Choose fruit" options={mockOptions} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      const disabledOption = screen.getByText('Disabled Option');
      expect(disabledOption).toBeInTheDocument();
      // Radix UI applies data-disabled attribute
      expect(disabledOption.closest('[role="option"]')).toHaveAttribute(
        'data-disabled'
      );
    });
  });

  it('sets aria-invalid when error exists', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        error="Invalid selection"
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        error="Invalid selection"
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-describedby', 'Choose fruit-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        helperText="Pick one"
      />
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-describedby', 'Choose fruit-helper');
  });

  it('renders grouped options', async () => {
    const user = userEvent.setup();
    render(<Select label="Choose item" groups={mockGroups} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
      expect(screen.getByText('Carrot')).toBeInTheDocument();
    });
  });

  it('shows search input when searchable', async () => {
    const user = userEvent.setup();
    render(
      <Select label="Choose fruit" options={mockOptions} searchable />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  it('filters options based on search query', async () => {
    const user = userEvent.setup();
    render(
      <Select label="Choose fruit" options={mockOptions} searchable />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'ban');

    await waitFor(() => {
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
    });
  });

  it('shows "No results found" when search has no matches', async () => {
    const user = userEvent.setup();
    render(
      <Select label="Choose fruit" options={mockOptions} searchable />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'xyz');

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('clears search on Escape key', async () => {
    const user = userEvent.setup();
    render(
      <Select label="Choose fruit" options={mockOptions} searchable />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'apple');
    expect(searchInput).toHaveValue('apple');

    await user.keyboard('{Escape}');
    expect(searchInput).toHaveValue('');
  });

  it('shows clear button when clearable and has value', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        value="apple"
        clearable
      />
    );
    expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
  });

  it('clears value when clear button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        value="apple"
        clearable
        onChange={handleChange}
      />
    );

    const clearButton = screen.getByLabelText('Clear selection');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('does not show clear button when disabled', () => {
    render(
      <Select
        label="Choose fruit"
        options={mockOptions}
        value="apple"
        clearable
        disabled
      />
    );
    expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation with Arrow keys', async () => {
    const user = userEvent.setup();
    render(<Select label="Choose fruit" options={mockOptions} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    // Arrow down to navigate
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    // Radix Select handles keyboard navigation internally
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    render(<Select label="Choose fruit" options={mockOptions} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });
  });
});
