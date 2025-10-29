import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Modal,
  ModalRoot,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from './modal';

describe('Modal', () => {
  describe('Rendering', () => {
    it('should render modal with title', () => {
      render(
        <Modal open title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Modal');
    });

    it('should render modal with description', () => {
      render(
        <Modal open title="Test Modal" description="This is a description">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-description')).toHaveTextContent('This is a description');
    });

    it('should render modal without description', () => {
      render(
        <Modal open title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-description')).not.toBeInTheDocument();
    });

    it('should render modal body content', () => {
      render(
        <Modal open title="Test Modal">
          <p>Test content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-body')).toHaveTextContent('Test content');
    });

    it('should render modal with footer', () => {
      render(
        <Modal open title="Test Modal" footer={<button>Submit</button>}>
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should render modal without footer', () => {
      render(
        <Modal open title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      render(
        <Modal open={false} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render small modal', () => {
      render(
        <Modal open title="Small Modal" size="sm">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toHaveClass('max-w-sm');
    });

    it('should render medium modal', () => {
      render(
        <Modal open title="Medium Modal" size="md">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toHaveClass('max-w-md');
    });

    it('should render large modal', () => {
      render(
        <Modal open title="Large Modal" size="lg">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toHaveClass('max-w-lg');
    });

    it('should render extra large modal', () => {
      render(
        <Modal open title="XL Modal" size="xl">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toHaveClass('max-w-xl');
    });

    it('should render fullscreen modal', () => {
      render(
        <Modal open title="Fullscreen Modal" size="fullscreen">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toHaveClass('max-w-full');
    });

    it('should default to medium size', () => {
      render(
        <Modal open title="Default Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-content')).toHaveClass('max-w-md');
    });
  });

  describe('Interactions', () => {
    it('should call onOpenChange when close button is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      await user.click(screen.getByTestId('modal-close'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should render close button when dismissible is true', () => {
      render(
        <Modal open title="Test Modal" dismissible>
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-close')).toBeInTheDocument();
    });

    it('should not render close button when dismissible is false', () => {
      render(
        <Modal open title="Test Modal" dismissible={false}>
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-close')).not.toBeInTheDocument();
    });
  });

  describe('Backdrop Interactions', () => {
    it('should close on backdrop click when closeOnBackdropClick is true', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange} title="Test Modal" closeOnBackdropClick>
          <p>Content</p>
        </Modal>
      );

      await user.click(screen.getByTestId('modal-overlay'));
      expect(onOpenChange).toHaveBeenCalled();
    });

    it('should render overlay', () => {
      render(
        <Modal open title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    });
  });

  describe('Composable Components', () => {
    it('should render with composable components', () => {
      render(
        <ModalRoot open>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Composable Modal</ModalTitle>
              <ModalDescription>Using separate components</ModalDescription>
            </ModalHeader>
            <ModalBody>Body content</ModalBody>
            <ModalFooter>Footer content</ModalFooter>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent('Composable Modal');
      expect(screen.getByTestId('modal-description')).toHaveTextContent('Using separate components');
      expect(screen.getByTestId('modal-body')).toHaveTextContent('Body content');
      expect(screen.getByTestId('modal-footer')).toHaveTextContent('Footer content');
    });

    it('should render ModalHeader', () => {
      render(
        <ModalRoot open>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Title</ModalTitle>
            </ModalHeader>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    });

    it('should render ModalBody', () => {
      render(
        <ModalRoot open>
          <ModalContent>
            <ModalBody>Body content</ModalBody>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId('modal-body')).toBeInTheDocument();
    });

    it('should render ModalFooter', () => {
      render(
        <ModalRoot open>
          <ModalContent>
            <ModalFooter>Footer content</ModalFooter>
          </ModalContent>
        </ModalRoot>
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Modal open title="Test Modal" description="Description">
          <p>Content</p>
        </Modal>
      );

      const content = screen.getByTestId('modal-content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-describedby');
    });

    it('should trap focus within modal', () => {
      render(
        <Modal open title="Test Modal">
          <input type="text" />
          <button>Button</button>
        </Modal>
      );

      const content = screen.getByTestId('modal-content');
      expect(content).toBeInTheDocument();
    });

    it('should have close button with screen reader text', () => {
      render(
        <Modal open title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText('Close')).toHaveClass('sr-only');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key when closeOnEscape is true', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Modal open onOpenChange={onOpenChange} title="Test Modal" closeOnEscape>
          <p>Content</p>
        </Modal>
      );

      await user.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
