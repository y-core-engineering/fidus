'use client';

import {
  Modal,
  ModalRoot,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from '@fidus/ui';
import { Button } from '@fidus/ui';
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

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Modal</h1>
        <p className="text-lg text-muted-foreground">
          A dialog overlay that focuses user attention on a specific task or information, blocking interaction with the rest of the page.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Modal</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
                Modal content goes here. This can include forms, information, or any other content you need to display.
              </p>
            </Modal>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setSmOpen(true)}>Small</Button>
              <Button onClick={() => setMdOpen(true)}>Medium</Button>
              <Button onClick={() => setLgOpen(true)}>Large</Button>
              <Button onClick={() => setXlOpen(true)}>Extra Large</Button>
              <Button onClick={() => setFullscreenOpen(true)}>Fullscreen</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Composable API */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Composable API</h2>
          <div className="rounded-lg border border-border bg-card p-6">
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
                  <div className="space-y-4">
                    <p className="text-sm">
                      This modal is built using the composable API, giving you full control over the structure and layout.
                    </p>
                    <div className="rounded border border-border p-4">
                      <h4 className="mb-2 font-semibold">Custom Content Section</h4>
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
          </div>
        </div>
      </section>

      {/* Non-dismissible */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Non-dismissible Modal</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Button onClick={() => setNonDismissibleOpen(true)}>
              Open Non-dismissible Modal
            </Button>
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
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">size</td>
                  <td className="p-2 font-mono text-xs">
                    'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
                  </td>
                  <td className="p-2 font-mono text-xs">'md'</td>
                  <td className="p-2">Size of the modal</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">title</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Modal title (convenience API)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">description</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Modal description (convenience API)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">dismissible</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether modal shows close button</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">closeOnBackdropClick</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether clicking backdrop closes modal</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">closeOnEscape</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Whether pressing Escape closes modal</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">open</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled open state</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onOpenChange</td>
                  <td className="p-2 font-mono text-xs">(open: boolean) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Open state change handler</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">children</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Modal body content</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">footer</td>
                  <td className="p-2 font-mono text-xs">ReactNode</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Modal footer content (convenience API)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>ARIA role: dialog</li>
            <li>Focus trap: Focus is trapped within modal when open</li>
            <li>Keyboard accessible: Escape to close, Tab to navigate</li>
            <li>Focus management: Focus returns to trigger on close</li>
            <li>ARIA attributes: aria-labelledby, aria-describedby</li>
            <li>Portal rendering: Rendered at document body level</li>
          </ul>
        </div>
      </section>

      {/* Size modals */}
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
          Extra large modal content with even more space for complex layouts and detailed information.
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
        <div className="space-y-4">
          <p className="text-sm">
            Fullscreen modals are useful for immersive experiences or when you need maximum space.
          </p>
          <div className="h-64 rounded border border-border bg-gray-50" />
        </div>
      </Modal>
    </div>
  );
}
