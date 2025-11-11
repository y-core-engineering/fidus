'use client';

import { Modal, ModalRoot, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@fidus/ui/modal';
import { Button } from '@fidus/ui/button';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [smOpen, setSmOpen] = useState(false);
  const [mdOpen, setMdOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);
  const [xlOpen, setXlOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [composableOpen, setComposableOpen] = useState(false);
  const [nonDismissibleOpen, setNonDismissibleOpen] = useState(false);

  const props = [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'",
      default: "'md'",
      description: 'Size of the modal',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Modal title (convenience API)',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Modal description (convenience API)',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'true',
      description: 'Whether modal shows close button',
    },
    {
      name: 'closeOnBackdropClick',
      type: 'boolean',
      default: 'true',
      description: 'Whether clicking backdrop closes modal',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Whether pressing Escape closes modal',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Open state change handler',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Modal body content',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Modal footer content (convenience API)',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Modal</h1>
      <p className="lead">
        A dialog overlay that focuses user attention on a specific task or information, blocking
        interaction with the rest of the page.
      </p>

      <h2>Basic Modal</h2>
      <ComponentPreview
        code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Modal</Button>
<Modal
  open={open}
  onOpenChange={setOpen}
  title="Modal Title"
  description="This is a basic modal dialog with a title and description."
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setOpen(false)}>Confirm</Button>
    </>
  }
>
  <p className="text-sm">
    Modal content goes here. This can include forms, information, or any other content.
  </p>
</Modal>`}
      >
        <Button onClick={() => setBasicOpen(true)}>Open Modal</Button>
        <Modal
          open={basicOpen}
          onOpenChange={setBasicOpen}
          title="Modal Title"
          description="This is a basic modal dialog with a title and description."
          footer={
            <>
              <Button variant="secondary" onClick={() => setBasicOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setBasicOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p className="text-sm">
            Modal content goes here. This can include forms, information, or any other content you
            need to display.
          </p>
        </Modal>
      </ComponentPreview>

      <h2>Sizes</h2>
      <ComponentPreview
        code={`<Stack direction="horizontal" spacing="md">
  <Button onClick={() => setSmOpen(true)}>Small</Button>
  <Button onClick={() => setMdOpen(true)}>Medium</Button>
  <Button onClick={() => setLgOpen(true)}>Large</Button>
  <Button onClick={() => setXlOpen(true)}>Extra Large</Button>
  <Button onClick={() => setFullscreenOpen(true)}>Fullscreen</Button>
</Stack>`}
      >
        <Stack direction="horizontal" spacing="md">
          <Button onClick={() => setSmOpen(true)}>Small</Button>
          <Button onClick={() => setMdOpen(true)}>Medium</Button>
          <Button onClick={() => setLgOpen(true)}>Large</Button>
          <Button onClick={() => setXlOpen(true)}>Extra Large</Button>
          <Button onClick={() => setFullscreenOpen(true)}>Fullscreen</Button>
        </Stack>
      </ComponentPreview>

      <h2>Composable API</h2>
      <ComponentPreview
        code={`<Button onClick={() => setOpen(true)}>Open Composable Modal</Button>
<ModalRoot open={open} onOpenChange={setOpen}>
  <ModalContent size="lg">
    <ModalHeader>
      <ModalTitle>Composable Modal</ModalTitle>
      <ModalDescription>
        Built using composable parts for maximum flexibility.
      </ModalDescription>
    </ModalHeader>
    <ModalBody>
      <div className="space-y-md">
        <p className="text-sm">
          This modal is built using the composable API.
        </p>
        <div className="rounded-md border border-border p-md">
          <h4 className="mb-sm font-semibold">Custom Content Section</h4>
          <p className="text-sm text-muted-foreground">
            You can add any custom content and structure you need.
          </p>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Close
      </Button>
      <Button onClick={() => setOpen(false)}>Save Changes</Button>
    </ModalFooter>
  </ModalContent>
</ModalRoot>`}
      >
        <Button onClick={() => setComposableOpen(true)}>Open Composable Modal</Button>
        <ModalRoot open={composableOpen} onOpenChange={setComposableOpen}>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Composable Modal</ModalTitle>
              <ModalDescription>
                Built using composable parts for maximum flexibility.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-md">
                <p className="text-sm">
                  This modal is built using the composable API, giving you full control over the
                  structure and layout.
                </p>
                <div className="rounded-md border border-border p-md">
                  <h4 className="mb-sm font-semibold">Custom Content Section</h4>
                  <p className="text-sm text-muted-foreground">
                    You can add any custom content and structure you need.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setComposableOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setComposableOpen(false)}>Save Changes</Button>
            </ModalFooter>
          </ModalContent>
        </ModalRoot>
      </ComponentPreview>

      <h2>Non-dismissible Modal</h2>
      <ComponentPreview
        code={`<Button onClick={() => setOpen(true)}>
  Open Non-dismissible Modal
</Button>
<ModalRoot open={open} onOpenChange={setOpen}>
  <ModalContent
    dismissible={false}
    closeOnBackdropClick={false}
    closeOnEscape={false}
  >
    <ModalHeader>
      <ModalTitle>Important Action Required</ModalTitle>
      <ModalDescription>
        This modal requires an explicit action and cannot be dismissed.
      </ModalDescription>
    </ModalHeader>
    <ModalBody>
      <p className="text-sm">
        You must click one of the action buttons below to proceed.
      </p>
    </ModalBody>
    <ModalFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={() => setOpen(false)}>
        Confirm Action
      </Button>
    </ModalFooter>
  </ModalContent>
</ModalRoot>`}
      >
        <Button onClick={() => setNonDismissibleOpen(true)}>Open Non-dismissible Modal</Button>
        <ModalRoot open={nonDismissibleOpen} onOpenChange={setNonDismissibleOpen}>
          <ModalContent
            dismissible={false}
            closeOnBackdropClick={false}
            closeOnEscape={false}
          >
            <ModalHeader>
              <ModalTitle>Important Action Required</ModalTitle>
              <ModalDescription>
                This modal requires an explicit action and cannot be dismissed.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">
                You must click one of the action buttons below to proceed.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setNonDismissibleOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setNonDismissibleOpen(false)}>
                Confirm Action
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalRoot>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                For critical information that requires immediate user attention and action
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To confirm destructive actions before proceeding</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To collect user input in a focused context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>To display supplementary content without navigating away from the page</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keep modal content concise and focused on a single task or message</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>
                Provide clear action buttons - users should know exactly what will happen
              </span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use appropriate size - don't make modals larger than necessary</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow dismissal via backdrop click and Escape key (unless critical)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use non-dismissible modals sparingly, only for critical actions</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA role: dialog with proper aria-labelledby and aria-describedby</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus trap: Focus is trapped within modal when open</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible: Escape to close, Tab to navigate</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus management: Focus returns to trigger element on close</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Portal rendering: Rendered at document body level for proper stacking</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use descriptive titles that clearly explain the modal's purpose</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear action buttons with explicit labels</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow users to dismiss the modal easily (unless critical)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use appropriate modal size based on content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use non-dismissible modals only for critical actions</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete Account"
  description="This action cannot be undone."
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete Account
      </Button>
    </>
  }
>
  <p className="text-sm">
    Are you sure you want to delete your account?
  </p>
</Modal>`}
            >
              <div className="text-sm text-muted-foreground">
                Good: Clear title, description, and action buttons
              </div>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague titles like "Attention" or "Notice"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't overload modals with too much content or multiple tasks</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't nest modals (modal inside modal)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use modals for complex workflows (use full pages instead)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make non-critical modals non-dismissible</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Modal
  open={open}
  onOpenChange={setOpen}
  title="Alert"
  size="fullscreen"
  dismissible={false}
>
  <div className="space-y-md">
    <p>This is a very long form...</p>
    <input />
    <input />
    <input />
    {/* Many more form fields */}
  </div>
</Modal>`}
            >
              <div className="text-sm text-muted-foreground">
                Bad: Vague title, oversized modal, non-dismissible for non-critical content
              </div>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Used to trigger modal actions</p>
        </Link>
        <Link
          href="/components/drawer"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Drawer
          </h3>
          <p className="text-sm text-muted-foreground">Slide-in panel alternative to modals</p>
        </Link>
        <Link
          href="/components/alert-dialog"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Alert Dialog
          </h3>
          <p className="text-sm text-muted-foreground">
            Simplified modal for confirmations
          </p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/modal/modal.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
              external
              showIcon
            >
              ARIA: Dialog (Modal) Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>

      {/* Hidden modals for size examples */}
      <Modal
        open={smOpen}
        onOpenChange={setSmOpen}
        size="sm"
        title="Small Modal"
        description="This is a small modal (max-w-sm)"
        footer={<Button onClick={() => setSmOpen(false)}>Close</Button>}
      >
        <p className="text-sm">Small modal content.</p>
      </Modal>

      <Modal
        open={mdOpen}
        onOpenChange={setMdOpen}
        size="md"
        title="Medium Modal"
        description="This is a medium modal (max-w-md)"
        footer={<Button onClick={() => setMdOpen(false)}>Close</Button>}
      >
        <p className="text-sm">Medium modal content (default size).</p>
      </Modal>

      <Modal
        open={lgOpen}
        onOpenChange={setLgOpen}
        size="lg"
        title="Large Modal"
        description="This is a large modal (max-w-lg)"
        footer={<Button onClick={() => setLgOpen(false)}>Close</Button>}
      >
        <p className="text-sm">Large modal content with more space for detailed information.</p>
      </Modal>

      <Modal
        open={xlOpen}
        onOpenChange={setXlOpen}
        size="xl"
        title="Extra Large Modal"
        description="This is an extra large modal (max-w-xl)"
        footer={<Button onClick={() => setXlOpen(false)}>Close</Button>}
      >
        <p className="text-sm">
          Extra large modal content with even more space for complex layouts and detailed
          information.
        </p>
      </Modal>

      <Modal
        open={fullscreenOpen}
        onOpenChange={setFullscreenOpen}
        size="fullscreen"
        title="Fullscreen Modal"
        description="This modal takes up the entire viewport"
        footer={<Button onClick={() => setFullscreenOpen(false)}>Close</Button>}
      >
        <div className="space-y-md">
          <p className="text-sm">
            Fullscreen modals are useful for immersive experiences or when you need maximum space.
          </p>
          <div className="h-64 rounded-md border border-border bg-gray-50" />
        </div>
      </Modal>
    </div>
  );
}
