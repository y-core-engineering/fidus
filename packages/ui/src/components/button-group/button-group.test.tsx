import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from './button-group';
import { Button } from '../button';

describe('ButtonGroup', () => {
  it('renders children', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('applies horizontal orientation by default', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    const group = screen.getByTestId('button-group');
    expect(group).toHaveClass('flex-row');
  });

  it('applies vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical" data-testid="button-group">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );
    const group = screen.getByTestId('button-group');
    expect(group).toHaveClass('flex-col');
  });

  it('has role="group" for accessibility', () => {
    render(
      <ButtonGroup>
        <Button>Button 1</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ButtonGroup className="custom-class" data-testid="button-group">
        <Button>Button</Button>
      </ButtonGroup>
    );
    const group = screen.getByTestId('button-group');
    expect(group).toHaveClass('custom-class');
  });
});
