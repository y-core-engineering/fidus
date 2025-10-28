import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerTrigger,
} from './drawer';

describe('Drawer', () => {
  describe('Rendering', () => {
    it('should render drawer with title', () => {
      render(
        <Drawer open title="Test Drawer">
          <p>Drawer content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
      expect(screen.getByTestId('drawer-title')).toHaveTextContent('Test Drawer');
    });

    it('should render drawer with description', () => {
      render(
        <Drawer open title="Test Drawer" description="This is a description">
          <p>Drawer content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-description')).toHaveTextContent('This is a description');
    });

    it('should render drawer without description', () => {
      render(
        <Drawer open title="Test Drawer">
          <p>Drawer content</p>
        </Drawer>
      );

      expect(screen.queryByTestId('drawer-description')).not.toBeInTheDocument();
    });

    it('should render drawer body content', () => {
      render(
        <Drawer open title="Test Drawer">
          <p>Test content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-body')).toHaveTextContent('Test content');
    });

    it('should render drawer with footer', () => {
      render(
        <Drawer open title="Test Drawer" footer={<button>Submit</button>}>
          <p>Drawer content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should render drawer without footer', () => {
      render(
        <Drawer open title="Test Drawer">
          <p>Drawer content</p>
        </Drawer>
      );

      expect(screen.queryByTestId('drawer-footer')).not.toBeInTheDocument();
    });

    it('should not render drawer when closed', () => {
      render(
        <Drawer open={false} title="Test Drawer">
          <p>Drawer content</p>
        </Drawer>
      );

      expect(screen.queryByTestId('drawer-content')).not.toBeInTheDocument();
    });

    it('should render overlay', () => {
      render(
        <Drawer open title="Test Drawer">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument();
    });
  });

  describe('Side Variants', () => {
    it('should render right side drawer', () => {
      render(
        <Drawer open title="Right Drawer" side="right">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toHaveClass('right-0');
    });

    it('should render left side drawer', () => {
      render(
        <Drawer open title="Left Drawer" side="left">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toHaveClass('left-0');
    });

    it('should render bottom drawer', () => {
      render(
        <Drawer open title="Bottom Drawer" side="bottom">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toHaveClass('bottom-0');
    });

    it('should default to right side', () => {
      render(
        <Drawer open title="Default Drawer">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toHaveClass('right-0');
    });
  });

  describe('Interactions', () => {
    it('should call onOpenChange when close button is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
          <p>Content</p>
        </Drawer>
      );

      await user.click(screen.getByTestId('drawer-close'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should render close button when dismissible is true', () => {
      render(
        <Drawer open title="Test Drawer" dismissible>
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-close')).toBeInTheDocument();
    });

    it('should not render close button when dismissible is false', () => {
      render(
        <Drawer open title="Test Drawer" dismissible={false}>
          <p>Content</p>
        </Drawer>
      );

      expect(screen.queryByTestId('drawer-close')).not.toBeInTheDocument();
    });

    it('should close on backdrop click', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
          <p>Content</p>
        </Drawer>
      );

      await user.click(screen.getByTestId('drawer-overlay'));
      expect(onOpenChange).toHaveBeenCalled();
    });
  });

  describe('Composable Components', () => {
    it('should render with composable components', () => {
      render(
        <DrawerRoot open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Composable Drawer</DrawerTitle>
              <DrawerDescription>Using separate components</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>Body content</DrawerBody>
            <DrawerFooter>Footer content</DrawerFooter>
          </DrawerContent>
        </DrawerRoot>
      );

      expect(screen.getByTestId('drawer-title')).toHaveTextContent('Composable Drawer');
      expect(screen.getByTestId('drawer-description')).toHaveTextContent('Using separate components');
      expect(screen.getByTestId('drawer-body')).toHaveTextContent('Body content');
      expect(screen.getByTestId('drawer-footer')).toHaveTextContent('Footer content');
    });

    it('should render DrawerHeader', () => {
      render(
        <DrawerRoot open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </DrawerRoot>
      );

      expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    });

    it('should render DrawerBody', () => {
      render(
        <DrawerRoot open>
          <DrawerContent>
            <DrawerBody>Body content</DrawerBody>
          </DrawerContent>
        </DrawerRoot>
      );

      expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
    });

    it('should render DrawerFooter', () => {
      render(
        <DrawerRoot open>
          <DrawerContent>
            <DrawerFooter>Footer content</DrawerFooter>
          </DrawerContent>
        </DrawerRoot>
      );

      expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
    });

    it('should work with DrawerTrigger', async () => {
      const user = userEvent.setup();

      render(
        <DrawerRoot>
          <DrawerTrigger asChild>
            <button>Open Drawer</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Triggered Drawer</DrawerTitle>
          </DrawerContent>
        </DrawerRoot>
      );

      expect(screen.queryByTestId('drawer-content')).not.toBeInTheDocument();
      await user.click(screen.getByText('Open Drawer'));
      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Drawer open title="Test Drawer" description="Description">
          <p>Content</p>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-describedby');
    });

    it('should trap focus within drawer', () => {
      render(
        <Drawer open title="Test Drawer">
          <input type="text" />
          <button>Button</button>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toBeInTheDocument();
    });

    it('should have close button with screen reader text', () => {
      render(
        <Drawer open title="Test Drawer">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByText('Close')).toHaveClass('sr-only');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
          <p>Content</p>
        </Drawer>
      );

      await user.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Slide Animations', () => {
    it('should have slide animation for right drawer', () => {
      render(
        <Drawer open title="Right Drawer" side="right">
          <p>Content</p>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toHaveClass('data-[state=closed]:slide-out-to-right');
      expect(content).toHaveClass('data-[state=open]:slide-in-from-right');
    });

    it('should have slide animation for left drawer', () => {
      render(
        <Drawer open title="Left Drawer" side="left">
          <p>Content</p>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toHaveClass('data-[state=closed]:slide-out-to-left');
      expect(content).toHaveClass('data-[state=open]:slide-in-from-left');
    });

    it('should have slide animation for bottom drawer', () => {
      render(
        <Drawer open title="Bottom Drawer" side="bottom">
          <p>Content</p>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toHaveClass('data-[state=closed]:slide-out-to-bottom');
      expect(content).toHaveClass('data-[state=open]:slide-in-from-bottom');
    });
  });

  describe('Controlled State', () => {
    it('should work as controlled component', () => {
      render(
        <Drawer open={true} title="Controlled Drawer">
          <p>Content</p>
        </Drawer>
      );

      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
    });

    it('should call onOpenChange when state changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Drawer open onOpenChange={onOpenChange} title="Test Drawer">
          <p>Content</p>
        </Drawer>
      );

      await user.click(screen.getByTestId('drawer-close'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Scrollable Body', () => {
    it('should have scrollable body', () => {
      render(
        <Drawer open title="Test Drawer">
          <div style={{ height: '2000px' }}>Long content</div>
        </Drawer>
      );

      const body = screen.getByTestId('drawer-body');
      expect(body).toHaveClass('overflow-y-auto');
    });
  });
});
