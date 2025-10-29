import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { List, ListItem } from './list';

describe('List', () => {
  it('renders unordered list by default', () => {
    const { container } = render(
      <List>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
      </List>
    );

    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders ordered list', () => {
    const { container } = render(
      <List variant="ordered">
        <ListItem>Step 1</ListItem>
        <ListItem>Step 2</ListItem>
      </List>
    );

    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('renders list without markers', () => {
    const { container } = render(
      <List variant="none">
        <ListItem>Item</ListItem>
      </List>
    );

    const list = container.querySelector('ul');
    expect(list).toHaveClass('list-none');
  });

  it('applies spacing classes', () => {
    const { container } = render(
      <List spacing="lg">
        <ListItem>Item</ListItem>
      </List>
    );

    const list = container.querySelector('ul');
    expect(list).toHaveClass('space-y-4');
  });

  it('applies custom className to list', () => {
    const { container } = render(
      <List className="custom-list">
        <ListItem>Item</ListItem>
      </List>
    );

    const list = container.querySelector('ul');
    expect(list).toHaveClass('custom-list');
  });

  it('applies custom className to list item', () => {
    render(
      <List>
        <ListItem className="custom-item">Item</ListItem>
      </List>
    );

    const item = screen.getByText('Item');
    expect(item).toHaveClass('custom-item');
  });

  it('supports nested lists', () => {
    render(
      <List>
        <ListItem>
          Parent Item
          <List variant="ordered">
            <ListItem>Child Item 1</ListItem>
            <ListItem>Child Item 2</ListItem>
          </List>
        </ListItem>
      </List>
    );

    expect(screen.getByText('Parent Item')).toBeInTheDocument();
    expect(screen.getByText('Child Item 1')).toBeInTheDocument();
    expect(screen.getByText('Child Item 2')).toBeInTheDocument();
  });
});
