import { Button, ButtonGroup } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function ButtonGroupPage() {
  const props = [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Direction in which buttons are arranged',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Button components to group together',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Button Group</h1>
      <p className="lead">
        Button groups combine related buttons together into a single component. They
        are useful for toolbars, segmented controls, and toggle groups.
      </p>

      <h2>Horizontal</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="horizontal">
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="secondary">Left</Button>
          <Button variant="secondary">Center</Button>
          <Button variant="secondary">Right</Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>Vertical</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="vertical">
  <Button variant="secondary">Top</Button>
  <Button variant="secondary">Middle</Button>
  <Button variant="secondary">Bottom</Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="vertical">
          <Button variant="secondary">Top</Button>
          <Button variant="secondary">Middle</Button>
          <Button variant="secondary">Bottom</Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>Icon Buttons</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="horizontal">
  <Button variant="tertiary" size="sm">
    <AlignLeft className="h-4 w-4" />
  </Button>
  <Button variant="tertiary" size="sm">
    <AlignCenter className="h-4 w-4" />
  </Button>
  <Button variant="tertiary" size="sm">
    <AlignRight className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="tertiary" size="sm">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="tertiary" size="sm">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="tertiary" size="sm">
            <AlignRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>Mixed Variants</h2>
      <ComponentPreview
        code={`<ButtonGroup orientation="horizontal">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="destructive">Delete</Button>
</ButtonGroup>`}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </ButtonGroup>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For related actions that should be visually grouped</li>
        <li>For segmented controls (like text alignment options)</li>
        <li>For toolbars with multiple related actions</li>
        <li>For toggle groups where one option is selected</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use secondary or tertiary variants for button groups</li>
        <li>Keep the number of buttons in a group reasonable (2-5 is ideal)</li>
        <li>Use consistent button sizes within a group</li>
        <li>Consider using icon buttons for compact toolbars</li>
        <li>Use horizontal orientation by default, vertical for sidebar actions</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>Button groups have role="group" for screen readers</li>
        <li>Each button can be navigated individually with keyboard</li>
        <li>Focus states are preserved for each button</li>
        <li>Consider adding aria-label to the group if its purpose isn't obvious</li>
      </ul>
    </div>
  );
}
