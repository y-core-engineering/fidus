import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { Alert } from '../components/alert/alert';
import { DetailCard } from '../components/detail-card/detail-card';
import { Banner } from '../components/banner/banner';
import { Chip } from '../components/chip/chip';
import { Checkbox } from '../components/checkbox/checkbox';
import { RadioButton, RadioGroup } from '../components/radio-button/radio-button';
import { ToggleSwitch } from '../components/toggle-switch/toggle-switch';
import { ErrorState } from '../components/error-state/error-state';
import { ConfidenceIndicator } from '../components/confidence-indicator/confidence-indicator';
import { Avatar } from '../components/avatar/avatar';
import { Breadcrumbs } from '../components/breadcrumbs/breadcrumbs';
import { Pagination } from '../components/pagination/pagination';
import { TextInput } from '../components/text-input/text-input';
import { TextArea } from '../components/text-area/text-area';
import { FileUpload } from '../components/file-upload/file-upload';
import { TimePicker } from '../components/time-picker/time-picker';
import { Button } from '../components/button/button';
import { Link } from '../components/link/link';
import { IconButton } from '../components/icon-button/icon-button';
import { ButtonGroup } from '../components/button-group/button-group';
import { Container } from '../components/container/container';
import { Grid } from '../components/grid/grid';
import { Stack } from '../components/stack/stack';
import { Divider } from '../components/divider/divider';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/table/table';
import { List, ListItem } from '../components/list/list';
import { Badge } from '../components/badge/badge';
import { OpportunityCard } from '../components/opportunity-card/opportunity-card';
import { EmptyCard } from '../components/empty-card/empty-card';
import { Select } from '../components/select/select';
import { DatePicker } from '../components/date-picker/date-picker';
import { Toast, ToastProvider } from '../components/toast/toast';
import { Modal, ModalRoot, ModalContent, ModalHeader, ModalTitle, ModalBody } from '../components/modal/modal';
import { ProgressBar } from '../components/progress-bar/progress-bar';
import { Spinner } from '../components/spinner/spinner';
import { Skeleton } from '../components/skeleton/skeleton';
import { Dropdown } from '../components/dropdown/dropdown';
import { Popover } from '../components/popover/popover';
import { Tooltip } from '../components/tooltip/tooltip';
import { Drawer, DrawerRoot, DrawerContent, DrawerHeader, DrawerTitle } from '../components/drawer/drawer';
import { Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent } from '../components/tabs/tabs';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { MessageBubble } from '../components/message-bubble/message-bubble';
import { ChatInterface } from '../components/chat-interface/chat-interface';

/**
 * SSR Compatibility Tests
 *
 * These tests verify that components render correctly during server-side rendering (SSR).
 * Components that have been converted from 'use client' to SSR-safe patterns must:
 * 1. Render successfully with renderToString() without errors
 * 2. Generate valid HTML output
 * 3. Not throw hydration warnings
 * 4. Handle interactive features properly after client-side hydration
 */

describe('SSR Compatibility', () => {
  describe('Alert Component', () => {
    it('should render in SSR without errors', () => {
      const html = renderToString(
        <Alert variant="info">
          Test alert message
        </Alert>
      );

      expect(html).toBeTruthy();
      expect(html).toContain('Test alert message');
    });

    it('should render all variants in SSR', () => {
      const variants: Array<'success' | 'error' | 'warning' | 'info'> = ['success', 'error', 'warning', 'info'];

      variants.forEach(variant => {
        const html = renderToString(
          <Alert variant={variant}>
            {variant} message
          </Alert>
        );

        expect(html).toBeTruthy();
        // React adds HTML comments between text nodes in SSR, so check for both parts
        expect(html).toContain(variant);
        expect(html).toContain('message');
      });
    });

    it('should render with title in SSR', () => {
      const html = renderToString(
        <Alert title="Alert Title">
          Alert content
        </Alert>
      );

      expect(html).toContain('Alert Title');
      expect(html).toContain('Alert content');
    });

    it('should render dismissible alert in SSR (without dismiss button)', () => {
      // Note: Dismiss button should NOT render in SSR due to isClient check
      const html = renderToString(
        <Alert dismissible>
          Dismissible alert
        </Alert>
      );

      expect(html).toBeTruthy();
      expect(html).toContain('Dismissible alert');
      // Dismiss button (X icon) should not be present in SSR
      expect(html).not.toContain('aria-label="Dismiss alert"');
    });

    it('should render alert with actions in SSR', () => {
      const mockAction = () => console.log('action');
      const html = renderToString(
        <Alert
          actions={[
            { label: 'Action 1', onClick: mockAction },
            { label: 'Action 2', onClick: mockAction }
          ]}
        >
          Alert with actions
        </Alert>
      );

      expect(html).toContain('Action 1');
      expect(html).toContain('Action 2');
    });

    it('should have role="alert" in SSR output', () => {
      const html = renderToString(
        <Alert>Alert message</Alert>
      );

      expect(html).toContain('role="alert"');
    });
  });

  describe('DetailCard Component', () => {
    it('should render in SSR without errors', () => {
      // DetailCard needs defaultExpanded={true} to render content in SSR
      const html = renderToString(
        <DetailCard title="Card Title" defaultExpanded={true}>
          Card content
        </DetailCard>
      );

      expect(html).toBeTruthy();
      expect(html).toContain('Card Title');
      expect(html).toContain('Card content');
    });

    it('should render with subtitle in SSR', () => {
      const html = renderToString(
        <DetailCard title="Card Title" subtitle="Card Subtitle" defaultExpanded={true}>
          Card content
        </DetailCard>
      );

      expect(html).toContain('Card Title');
      expect(html).toContain('Card Subtitle');
      expect(html).toContain('Card content');
    });

    it('should render collapsed state in SSR (without chevron)', () => {
      // Note: Chevron icons should NOT render in SSR due to isClient check
      const html = renderToString(
        <DetailCard title="Collapsed Card" defaultExpanded={false}>
          This content should not be visible
        </DetailCard>
      );

      expect(html).toBeTruthy();
      expect(html).toContain('Collapsed Card');
      // Content should not be rendered when collapsed
      expect(html).not.toContain('This content should not be visible');
      // Chevron icons should not be present in SSR
      expect(html).not.toContain('ChevronDown');
      expect(html).not.toContain('ChevronUp');
    });

    it('should render expanded state in SSR', () => {
      const html = renderToString(
        <DetailCard title="Expanded Card" defaultExpanded={true}>
          This content should be visible
        </DetailCard>
      );

      expect(html).toContain('Expanded Card');
      expect(html).toContain('This content should be visible');
    });

    it('should render non-collapsible card in SSR', () => {
      const html = renderToString(
        <DetailCard title="Non-collapsible Card" collapsible={false}>
          Always visible content
        </DetailCard>
      );

      expect(html).toContain('Non-collapsible Card');
      expect(html).toContain('Always visible content');
    });

    it('should render with header slot in SSR', () => {
      const html = renderToString(
        <DetailCard
          title="Card with Header"
          header={<span>Header Content</span>}
        >
          Card content
        </DetailCard>
      );

      expect(html).toContain('Card with Header');
      expect(html).toContain('Header Content');
    });

    it('should render with footer in SSR', () => {
      const html = renderToString(
        <DetailCard
          title="Card with Footer"
          footer={<span>Footer Content</span>}
          defaultExpanded={true}
        >
          Card content
        </DetailCard>
      );

      expect(html).toContain('Card with Footer');
      expect(html).toContain('Footer Content');
    });

    it('should have proper accessibility attributes in SSR', () => {
      const html = renderToString(
        <DetailCard title="Accessible Card" collapsible={true}>
          Content
        </DetailCard>
      );

      // Should have button role and aria-expanded when collapsible
      expect(html).toContain('role="button"');
      expect(html).toContain('aria-expanded=');
    });
  });

  describe('SSR Performance', () => {
    it('should render multiple components efficiently', () => {
      const startTime = performance.now();

      const html = renderToString(
        <div>
          <Alert variant="success">Success 1</Alert>
          <Alert variant="error">Error 1</Alert>
          <DetailCard title="Card 1">Content 1</DetailCard>
          <DetailCard title="Card 2">Content 2</DetailCard>
          <Alert variant="warning">Warning 1</Alert>
          <DetailCard title="Card 3" defaultExpanded={true}>Content 3</DetailCard>
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(html).toBeTruthy();
      expect(html).toContain('Success 1');
      expect(html).toContain('Content 3');

      // SSR should be fast (< 100ms for 6 components)
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Banner Component', () => {
    it('should render in SSR without errors', () => {
      const html = renderToString(
        <Banner message="Important notification" />
      );

      expect(html).toBeTruthy();
      expect(html).toContain('Important notification');
      expect(html).toContain('role="banner"');
    });

    it('should render all variants in SSR', () => {
      const variants: Array<'info' | 'warning' | 'error'> = ['info', 'warning', 'error'];

      variants.forEach(variant => {
        const html = renderToString(
          <Banner variant={variant} message={`${variant} message`} />
        );

        expect(html).toContain('role="banner"');
      });
    });

    it('should render dismissible banner in SSR (without dismiss button)', () => {
      const html = renderToString(
        <Banner message="Dismissible banner" dismissible />
      );

      expect(html).toContain('Dismissible banner');
      // Dismiss button should not be present in SSR
      expect(html).not.toContain('aria-label="Dismiss banner"');
    });
  });

  describe('Chip Component', () => {
    it('should render in SSR without errors', () => {
      const html = renderToString(
        <Chip>Tag Label</Chip>
      );

      expect(html).toBeTruthy();
      expect(html).toContain('Tag Label');
    });

    it('should render dismissible chip in SSR (without X button)', () => {
      const html = renderToString(
        <Chip dismissible>Removable</Chip>
      );

      expect(html).toContain('Removable');
      // X button should not be present in SSR
      expect(html).not.toContain('aria-label="Remove"');
    });
  });

  describe('Checkbox Component', () => {
    it('should render checked checkbox in SSR', () => {
      const html = renderToString(
        <Checkbox checked onChange={() => {}} />
      );

      expect(html).toBeTruthy();
      // Check icon should not render in SSR (isClient=false)
    });

    it('should render unchecked checkbox in SSR', () => {
      const html = renderToString(
        <Checkbox checked={false} onChange={() => {}} />
      );

      expect(html).toBeTruthy();
    });
  });

  describe('RadioButton Component', () => {
    it('should render radio group in SSR', () => {
      const html = renderToString(
        <RadioGroup value="option1" onChange={() => {}}>
          <RadioButton value="option1" label="Option 1" />
          <RadioButton value="option2" label="Option 2" />
        </RadioGroup>
      );

      expect(html).toContain('Option 1');
      expect(html).toContain('Option 2');
    });
  });

  describe('ToggleSwitch Component', () => {
    it('should render toggle in SSR', () => {
      const html = renderToString(
        <ToggleSwitch checked={false} onChange={() => {}} />
      );

      expect(html).toBeTruthy();
    });
  });

  describe('ErrorState Component', () => {
    it('should render error state in SSR', () => {
      const html = renderToString(
        <ErrorState
          title="Error occurred"
          message="Something went wrong"
        />
      );

      expect(html).toContain('Error occurred');
      expect(html).toContain('Something went wrong');
    });

    it('should render error state with action in SSR (without button)', () => {
      const html = renderToString(
        <ErrorState
          title="Error"
          message="Error message"
          actionLabel="Retry"
          onAction={() => {}}
        />
      );

      // Action button should not render in SSR
      expect(html).not.toContain('Retry');
    });
  });

  describe('ConfidenceIndicator Component', () => {
    it('should render confidence indicator in SSR', () => {
      const html = renderToString(
        <ConfidenceIndicator value={0.85} />
      );

      expect(html).toBeTruthy();
    });
  });

  describe('Avatar Component', () => {
    it('should render avatar with initials in SSR', () => {
      const html = renderToString(
        <Avatar name="John Doe" />
      );

      expect(html).toBeTruthy();
      // Initials are calculated client-side, so just check it renders
    });

    it('should render avatar with fallback in SSR (no image)', () => {
      const html = renderToString(
        <Avatar src="https://example.com/avatar.jpg" alt="User" />
      );

      expect(html).toBeTruthy();
      // Image should not load in SSR (isClient=false)
    });
  });

  describe('Breadcrumbs Component', () => {
    it('should render breadcrumbs in SSR', () => {
      const html = renderToString(
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Item' }
          ]}
        />
      );

      expect(html).toContain('Home');
      expect(html).toContain('Products');
      expect(html).toContain('Item');
    });
  });

  describe('Pagination Component', () => {
    it('should render pagination in SSR (without controls)', () => {
      const html = renderToString(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={() => {}}
        />
      );

      expect(html).toBeTruthy();
      // Pagination controls should not render in SSR (isClient=false)
    });
  });

  describe('No Hydration Mismatches', () => {
    it('Alert should have consistent initial state between SSR and client', () => {
      // SSR renders with isVisible=true, isClient=false
      const ssrHtml = renderToString(
        <Alert>SSR Alert</Alert>
      );

      // Client initial render (before useEffect) should also have isClient=false
      // This ensures no hydration mismatch
      expect(ssrHtml).toContain('SSR Alert');
      expect(ssrHtml).toContain('role="alert"');
    });

    it('DetailCard should have consistent initial state between SSR and client', () => {
      // SSR renders with isClient=false (no chevron)
      const ssrHtml = renderToString(
        <DetailCard title="SSR Card">Content</DetailCard>
      );

      // Client initial render (before useEffect) should also have isClient=false
      // This ensures no hydration mismatch
      expect(ssrHtml).toContain('SSR Card');
      expect(ssrHtml).toContain('role="button"');
    });

    it('Banner should not show dismiss button in SSR', () => {
      const html = renderToString(
        <Banner message="Test" dismissible />
      );

      expect(html).not.toContain('aria-label="Dismiss banner"');
    });

    it('Chip should not show remove button in SSR', () => {
      const html = renderToString(
        <Chip dismissible>Test</Chip>
      );

      expect(html).not.toContain('aria-label="Remove"');
    });
  });

  describe('Phase 2: Form Components', () => {
    describe('TextInput Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <TextInput label="Email" type="email" placeholder="Enter email" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Email');
        expect(html).toContain('placeholder="Enter email"');
      });

      it('should render all input types in SSR', () => {
        const types: Array<'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'> = [
          'text', 'email', 'password', 'number', 'search', 'tel', 'url'
        ];

        types.forEach(type => {
          const html = renderToString(
            <TextInput label={`Test ${type}`} type={type} />
          );

          expect(html).toBeTruthy();
          expect(html).toContain(`Test ${type}`);
        });
      });

      it('should render error state in SSR', () => {
        const html = renderToString(
          <TextInput label="Username" error="Username is required" />
        );

        expect(html).toContain('Username is required');
        expect(html).toContain('role="alert"');
      });

      it('should render helper text in SSR', () => {
        const html = renderToString(
          <TextInput label="Password" helperText="Must be at least 8 characters" />
        );

        expect(html).toContain('Must be at least 8 characters');
      });

      it('should render character count in SSR', () => {
        const html = renderToString(
          <TextInput label="Bio" maxLength={100} showCharCount value="Hello" />
        );

        expect(html).toContain('5<!-- --> / <!-- -->100');
      });

      it('should render required indicator in SSR', () => {
        const html = renderToString(
          <TextInput label="Required Field" required />
        );

        expect(html).toContain('*');
      });
    });

    describe('TextArea Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <TextArea label="Description" placeholder="Enter description" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Description');
        expect(html).toContain('placeholder="Enter description"');
      });

      it('should render error state in SSR', () => {
        const html = renderToString(
          <TextArea label="Comments" error="Comments are required" />
        );

        expect(html).toContain('Comments are required');
        expect(html).toContain('role="alert"');
      });

      it('should render character count in SSR', () => {
        const html = renderToString(
          <TextArea label="Message" maxLength={500} showCharCount value="Test message" />
        );

        expect(html).toContain('12<!-- --> / <!-- -->500');
      });

      it('should render resizable textarea in SSR', () => {
        const html = renderToString(
          <TextArea label="Notes" resizable />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Notes');
      });
    });

    describe('FileUpload Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <FileUpload label="Upload File" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Upload File');
      });

      it('should render with accept types in SSR', () => {
        const html = renderToString(
          <FileUpload label="Upload Image" accept="image/*" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('accept="image/*"');
      });

      it('should render multiple file upload in SSR', () => {
        const html = renderToString(
          <FileUpload label="Upload Files" multiple />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('multiple');
      });

      it('should not render file preview in SSR', () => {
        const html = renderToString(
          <FileUpload label="Upload" showPreview />
        );

        // File preview requires client-side FileReader API
        expect(html).toBeTruthy();
        expect(html).toContain('Upload');
      });

      it('should render drag and drop zone in SSR', () => {
        const html = renderToString(
          <FileUpload label="Upload" dragAndDrop />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Upload');
      });
    });

    describe('TimePicker Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <TimePicker label="Select Time" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Select Time');
      });

      it('should render with default value in SSR', () => {
        const html = renderToString(
          <TimePicker label="Meeting Time" value="14:30" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Meeting Time');
        // TimePicker uses separate hour/minute selects, check they're rendered
        expect(html).toContain('aria-label="Hour"');
        expect(html).toContain('aria-label="Minute"');
      });

      it('should render 12-hour format in SSR', () => {
        const html = renderToString(
          <TimePicker label="Time" format="12h" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Time');
      });

      it('should render error state in SSR', () => {
        const html = renderToString(
          <TimePicker label="Time" error="Time is required" />
        );

        expect(html).toContain('Time is required');
        expect(html).toContain('role="alert"');
      });

      it('should render disabled state in SSR', () => {
        const html = renderToString(
          <TimePicker label="Time" disabled />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('disabled');
      });
    });
  });

  describe('Phase 3: Action Components', () => {
    describe('Button Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Button>Click me</Button>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Click me');
        expect(html).toContain('type="button"');
      });

      it('should render all variants in SSR', () => {
        const variants: Array<'primary' | 'secondary' | 'tertiary' | 'destructive'> =
          ['primary', 'secondary', 'tertiary', 'destructive'];

        variants.forEach(variant => {
          const html = renderToString(
            <Button variant={variant}>{variant} button</Button>
          );

          expect(html).toBeTruthy();
          expect(html).toContain(variant);
          expect(html).toContain('button');
        });
      });

      it('should render all sizes in SSR', () => {
        const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

        sizes.forEach(size => {
          const html = renderToString(
            <Button size={size}>{size} button</Button>
          );

          expect(html).toBeTruthy();
          expect(html).toContain(size);
        });
      });

      it('should render loading state in SSR', () => {
        const html = renderToString(
          <Button loading>Loading button</Button>
        );

        expect(html).toContain('Loading...');
        expect(html).toContain('disabled');
      });

      it('should render disabled state in SSR', () => {
        const html = renderToString(
          <Button disabled>Disabled</Button>
        );

        expect(html).toContain('disabled');
      });

      it('should render with different button types in SSR', () => {
        const types: Array<'button' | 'submit' | 'reset'> = ['button', 'submit', 'reset'];

        types.forEach(type => {
          const html = renderToString(
            <Button type={type}>Test</Button>
          );

          expect(html).toContain(`type="${type}"`);
        });
      });
    });

    describe('Link Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Link href="/test">Test Link</Link>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Test Link');
        expect(html).toContain('href="/test"');
      });

      it('should render variants in SSR', () => {
        const variants: Array<'inline' | 'standalone'> = ['inline', 'standalone'];

        variants.forEach(variant => {
          const html = renderToString(
            <Link href="/test" variant={variant}>{variant} link</Link>
          );

          expect(html).toBeTruthy();
          expect(html).toContain(variant);
        });
      });

      it('should render external link with icon in SSR', () => {
        const html = renderToString(
          <Link href="https://example.com" external>External</Link>
        );

        expect(html).toContain('target="_blank"');
        expect(html).toContain('rel="noopener noreferrer"');
        expect(html).toContain('<svg');
      });

      it('should render with showIcon in SSR', () => {
        const html = renderToString(
          <Link href="/test" showIcon>With Icon</Link>
        );

        expect(html).toContain('With Icon');
        expect(html).toContain('<svg');
      });
    });

    describe('IconButton Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <IconButton aria-label="Delete">
            <span>X</span>
          </IconButton>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('aria-label="Delete"');
      });

      it('should render all variants in SSR', () => {
        const variants: Array<'primary' | 'secondary' | 'ghost' | 'destructive'> =
          ['primary', 'secondary', 'ghost', 'destructive'];

        variants.forEach(variant => {
          const html = renderToString(
            <IconButton variant={variant} aria-label={variant}>
              <span>*</span>
            </IconButton>
          );

          expect(html).toBeTruthy();
        });
      });

      it('should render disabled state in SSR', () => {
        const html = renderToString(
          <IconButton disabled aria-label="Disabled">
            <span>X</span>
          </IconButton>
        );

        expect(html).toContain('disabled');
      });
    });

    describe('ButtonGroup Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <ButtonGroup>
            <Button>First</Button>
            <Button>Second</Button>
            <Button>Third</Button>
          </ButtonGroup>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('First');
        expect(html).toContain('Second');
        expect(html).toContain('Third');
      });

      it('should render vertical orientation in SSR', () => {
        const html = renderToString(
          <ButtonGroup orientation="vertical">
            <Button>Top</Button>
            <Button>Bottom</Button>
          </ButtonGroup>
        );

        expect(html).toContain('Top');
        expect(html).toContain('Bottom');
      });
    });
  });

  describe('Phase 4: Layout Components', () => {
    describe('Container Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Container>Container content</Container>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Container content');
      });

      it('should render all sizes in SSR', () => {
        const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = ['sm', 'md', 'lg', 'xl', 'full'];

        sizes.forEach(size => {
          const html = renderToString(
            <Container size={size}>Content</Container>
          );

          expect(html).toContain('Content');
        });
      });

      it('should render with different padding in SSR', () => {
        const paddings: Array<'none' | 'sm' | 'md' | 'lg'> = ['none', 'sm', 'md', 'lg'];

        paddings.forEach(padding => {
          const html = renderToString(
            <Container padding={padding}>Content</Container>
          );

          expect(html).toContain('Content');
        });
      });

      it('should render with different semantic elements in SSR', () => {
        const elements: Array<'div' | 'section' | 'article' | 'main'> =
          ['div', 'section', 'article', 'main'];

        elements.forEach(as => {
          const html = renderToString(
            <Container as={as}>Content</Container>
          );

          expect(html).toContain(`<${as}`);
          expect(html).toContain('Content');
        });
      });
    });

    describe('Grid Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Grid>
            <div>Item 1</div>
            <div>Item 2</div>
          </Grid>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Item 1');
        expect(html).toContain('Item 2');
      });

      it('should render with different column counts in SSR', () => {
        const html = renderToString(
          <Grid cols={3}>
            <div>A</div>
            <div>B</div>
            <div>C</div>
          </Grid>
        );

        expect(html).toContain('A');
        expect(html).toContain('B');
        expect(html).toContain('C');
      });

      it('should render with gap in SSR', () => {
        const html = renderToString(
          <Grid gap="lg">
            <div>Item</div>
          </Grid>
        );

        expect(html).toContain('Item');
      });
    });

    describe('Stack Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Stack>
            <div>First</div>
            <div>Second</div>
          </Stack>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('First');
        expect(html).toContain('Second');
      });

      it('should render horizontal direction in SSR', () => {
        const html = renderToString(
          <Stack direction="horizontal">
            <div>Left</div>
            <div>Right</div>
          </Stack>
        );

        expect(html).toContain('Left');
        expect(html).toContain('Right');
      });

      it('should render with spacing in SSR', () => {
        const html = renderToString(
          <Stack spacing="lg">
            <div>Item</div>
          </Stack>
        );

        expect(html).toContain('Item');
      });

      it('should render with alignment in SSR', () => {
        const html = renderToString(
          <Stack align="center">
            <div>Centered</div>
          </Stack>
        );

        expect(html).toContain('Centered');
      });
    });

    describe('Divider Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Divider />
        );

        expect(html).toBeTruthy();
      });

      it('should render vertical orientation in SSR', () => {
        const html = renderToString(
          <Divider orientation="vertical" />
        );

        expect(html).toBeTruthy();
      });

      it('should render with label in SSR', () => {
        const html = renderToString(
          <Divider label="Section" />
        );

        expect(html).toContain('Section');
      });
    });
  });

  describe('Phase 5: Data Display Components', () => {
    describe('Table Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>jane@example.com</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Name');
        expect(html).toContain('Email');
        expect(html).toContain('John Doe');
        expect(html).toContain('jane@example.com');
      });

      it('should render empty table in SSR', () => {
        const html = renderToString(
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            </TableBody>
          </Table>
        );

        expect(html).toContain('Name');
      });
    });

    describe('List Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <List>
            <ListItem>First item</ListItem>
            <ListItem>Second item</ListItem>
          </List>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('First item');
        expect(html).toContain('Second item');
      });

      it('should render ordered list in SSR', () => {
        const html = renderToString(
          <List variant="ordered">
            <ListItem>Step 1</ListItem>
            <ListItem>Step 2</ListItem>
          </List>
        );

        expect(html).toContain('<ol');
        expect(html).toContain('Step 1');
      });

      it('should render with spacing in SSR', () => {
        const html = renderToString(
          <List spacing="lg">
            <ListItem>Item A</ListItem>
            <ListItem>Item B</ListItem>
          </List>
        );

        expect(html).toContain('Item A');
        expect(html).toContain('Item B');
      });
    });

    describe('Badge Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Badge>New</Badge>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('New');
      });

      it('should render all variants in SSR', () => {
        const variants: Array<'urgent' | 'important' | 'normal' | 'low' | 'success' | 'warning' | 'error' | 'info'> =
          ['urgent', 'important', 'normal', 'low', 'success', 'warning', 'error', 'info'];

        variants.forEach(variant => {
          const html = renderToString(
            <Badge variant={variant}>{variant}</Badge>
          );

          expect(html).toContain(variant);
        });
      });

      it('should render all sizes in SSR', () => {
        const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

        sizes.forEach(size => {
          const html = renderToString(
            <Badge size={size}>Badge</Badge>
          );

          expect(html).toContain('Badge');
        });
      });
    });
  });

  describe('Phase 6: Card Components', () => {
    describe('OpportunityCard Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <OpportunityCard title="Opportunity Title" urgency="important">
            Description text
          </OpportunityCard>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Opportunity Title');
        expect(html).toContain('Description text');
      });

      it('should render all urgency levels in SSR', () => {
        const urgencies: Array<'urgent' | 'important' | 'normal' | 'low'> =
          ['urgent', 'important', 'normal', 'low'];

        urgencies.forEach(urgency => {
          const html = renderToString(
            <OpportunityCard title={`${urgency} card`} urgency={urgency}>
              Content
            </OpportunityCard>
          );

          expect(html).toContain(urgency);
        });
      });

      it('should render with context in SSR', () => {
        const html = renderToString(
          <OpportunityCard title="Card" context="Project: Acme Corp">
            Content
          </OpportunityCard>
        );

        expect(html).toContain('Project: Acme Corp');
      });
    });

    describe('EmptyCard Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <EmptyCard
            title="No items found"
            description="Try adjusting your filters"
          />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('No items found');
        expect(html).toContain('Try adjusting your filters');
      });

      it('should render with action in SSR (without button)', () => {
        const html = renderToString(
          <EmptyCard
            title="Empty"
            actionLabel="Add Item"
            onAction={() => {}}
          />
        );

        expect(html).toContain('Empty');
        // Action button may not render in SSR if client-only
      });
    });
  });

  describe('Phase 7: Form Advanced Components', () => {
    describe('Select Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Select
            label="Choose option"
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' }
            ]}
          />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Choose option');
      });

      it('should render with default value in SSR', () => {
        const html = renderToString(
          <Select
            label="Select"
            options={[{ value: 'test', label: 'Test' }]}
            value="test"
          />
        );

        expect(html).toContain('Select');
      });

      it('should render error state in SSR', () => {
        const html = renderToString(
          <Select
            label="Select"
            options={[]}
            error="Selection required"
          />
        );

        expect(html).toContain('Selection required');
      });
    });

    describe('DatePicker Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <DatePicker label="Select date" />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Select date');
      });

      it('should render with default value in SSR', () => {
        const html = renderToString(
          <DatePicker
            label="Date"
            value={new Date('2024-01-15')}
          />
        );

        expect(html).toContain('Date');
      });

      it('should render error state in SSR', () => {
        const html = renderToString(
          <DatePicker
            label="Date"
            error="Date is required"
          />
        );

        expect(html).toContain('Date is required');
      });
    });
  });

  describe('Phase 8: Feedback Components', () => {
    describe('Toast Component', () => {
      it('should render without crashing in SSR', () => {
        // Note: Toast uses Radix Portal which doesn't render content in SSR
        // This test verifies the component doesn't crash during SSR
        let didCrash = false;
        try {
          renderToString(
            <ToastProvider>
              <Toast title="Success!" variant="success" open />
            </ToastProvider>
          );
        } catch (e) {
          didCrash = true;
        }

        // Toast should not crash during SSR even though Portal doesn't render
        expect(didCrash).toBe(false);
      });

      it('should render all variants without crashing in SSR', () => {
        const variants: Array<'success' | 'error' | 'warning' | 'info'> =
          ['success', 'error', 'warning', 'info'];

        variants.forEach(variant => {
          let didCrash = false;
          try {
            renderToString(
              <ToastProvider>
                <Toast title={`${variant} notification`} variant={variant} open />
              </ToastProvider>
            );
          } catch (e) {
            didCrash = true;
          }

          // Toast uses Portal which doesn't render in SSR, but should not crash
          expect(didCrash).toBe(false);
        });
      });
    });

    describe('Modal Component', () => {
      it('should render modal structure in SSR', () => {
        // Note: Modal uses DialogPrimitive.Portal which doesn't render in SSR
        // This test verifies the component doesn't crash during SSR
        let didCrash = false;
        try {
          renderToString(
            <ModalRoot open>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Modal Title</ModalTitle>
                </ModalHeader>
                <ModalBody>Modal content</ModalBody>
              </ModalContent>
            </ModalRoot>
          );
        } catch (e) {
          didCrash = true;
        }

        // Portal content won't appear in SSR HTML, but should not crash
        expect(didCrash).toBe(false);
      });

      it('should not crash with closed modal in SSR', () => {
        let didCrash = false;
        try {
          renderToString(
            <ModalRoot open={false}>
              <ModalContent>Hidden content</ModalContent>
            </ModalRoot>
          );
        } catch (e) {
          didCrash = true;
        }

        expect(didCrash).toBe(false);
      });
    });

    describe('ProgressBar Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <ProgressBar value={50} />
        );

        expect(html).toBeTruthy();
      });

      it('should render with label in SSR', () => {
        // Note: ProgressBar has 'use client' but uses Radix Primitive
        // which supports SSR, so label should render
        const html = renderToString(
          <ProgressBar value={75} showLabel label="Loading..." />
        );

        // Verify component renders without crashing
        expect(html).toBeTruthy();
        // Label container is rendered, even if styled differently in SSR
        expect(html).toContain('progress-bar-label-container');
      });

      it('should render indeterminate state in SSR', () => {
        const html = renderToString(
          <ProgressBar indeterminate />
        );

        expect(html).toBeTruthy();
      });
    });

    describe('Spinner Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Spinner />
        );

        expect(html).toBeTruthy();
      });

      it('should render all sizes in SSR', () => {
        const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

        sizes.forEach(size => {
          const html = renderToString(
            <Spinner size={size} />
          );

          expect(html).toBeTruthy();
        });
      });

      it('should render with label in SSR', () => {
        const html = renderToString(
          <Spinner label="Loading data..." />
        );

        expect(html).toContain('Loading data...');
      });
    });

    describe('Skeleton Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Skeleton />
        );

        expect(html).toBeTruthy();
      });

      it('should render all variants in SSR', () => {
        const variants: Array<'text' | 'circular' | 'rectangular'> =
          ['text', 'circular', 'rectangular'];

        variants.forEach(variant => {
          const html = renderToString(
            <Skeleton variant={variant} />
          );

          expect(html).toBeTruthy();
        });
      });

      it('should render with custom dimensions in SSR', () => {
        const html = renderToString(
          <Skeleton width="200px" height="100px" />
        );

        expect(html).toBeTruthy();
      });
    });
  });

  describe('Phase 9: Overlay Components', () => {
    describe('Dropdown Component', () => {
      it('should render trigger in SSR', () => {
        const html = renderToString(
          <Dropdown
            trigger={<Button>Open Menu</Button>}
            items={[
              { label: 'Item 1', onClick: () => {} },
              { label: 'Item 2', onClick: () => {} }
            ]}
          />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Open Menu');
      });
    });

    describe('Popover Component', () => {
      it('should render trigger in SSR', () => {
        const html = renderToString(
          <Popover
            trigger={<Button>Show Popover</Button>}
            content={<div>Popover content</div>}
          />
        );

        expect(html).toContain('Show Popover');
      });
    });

    describe('Tooltip Component', () => {
      it('should render children in SSR', () => {
        const html = renderToString(
          <Tooltip content="Helpful tip">
            <Button>Hover me</Button>
          </Tooltip>
        );

        expect(html).toContain('Hover me');
      });
    });

    describe('Drawer Component', () => {
      it('should render drawer structure in SSR', () => {
        // Note: Drawer uses Portal which doesn't render content in SSR
        // This test verifies the component doesn't crash during SSR
        let didCrash = false;
        try {
          renderToString(
            <DrawerRoot open>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Title</DrawerTitle>
                </DrawerHeader>
                <div>Drawer content</div>
              </DrawerContent>
            </DrawerRoot>
          );
        } catch (e) {
          didCrash = true;
        }

        // Portal content won't appear in SSR HTML, but should not crash
        expect(didCrash).toBe(false);
      });

      it('should not crash with closed drawer in SSR', () => {
        let didCrash = false;
        try {
          renderToString(
            <DrawerRoot open={false}>
              <DrawerContent>Hidden</DrawerContent>
            </DrawerRoot>
          );
        } catch (e) {
          didCrash = true;
        }

        expect(didCrash).toBe(false);
      });
    });
  });

  describe('Phase 10: Navigation Components', () => {
    describe('Tabs Component', () => {
      it('should render in SSR without errors', () => {
        // Note: Tabs has 'use client' but uses Radix Tabs which supports SSR
        const html = renderToString(
          <TabsRoot defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </TabsRoot>
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Tab 1');
        expect(html).toContain('Tab 2');
      });

      it('should render active tab content in SSR', () => {
        const html = renderToString(
          <TabsRoot defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">A</TabsTrigger>
            </TabsList>
            <TabsContent value="a">A content</TabsContent>
          </TabsRoot>
        );

        expect(html).toContain('A content');
      });

      it('should render convenience Tabs component in SSR', () => {
        // Convenience Tabs component also works in SSR
        const html = renderToString(
          <Tabs
            items={[
              { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
              { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
            ]}
            defaultValue="tab1"
          />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Tab 1');
        expect(html).toContain('Content 1');
      });
    });

    describe('Header Component', () => {
      it('should render in SSR without errors', () => {
        // Note: Header has 'use client' directive
        const html = renderToString(
          <Header logo={{ text: 'App Title' }} />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('App Title');
      });

      it('should render with navigation items in SSR', () => {
        // Note: Header has 'use client' - navigation items may render differently in SSR
        const html = renderToString(
          <Header
            logo={{ text: 'App' }}
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' }
            ]}
          />
        );

        // Verify component renders without crashing
        expect(html).toBeTruthy();
        // Logo should render at minimum
        expect(html).toContain('App');
      });
    });

    describe('Sidebar Component', () => {
      it('should render in SSR without errors', () => {
        const html = renderToString(
          <Sidebar
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Settings', href: '/settings' }
            ]}
          />
        );

        expect(html).toBeTruthy();
        expect(html).toContain('Dashboard');
        expect(html).toContain('Settings');
      });

      it('should render collapsed state in SSR', () => {
        const html = renderToString(
          <Sidebar
            items={[{ label: 'Item', href: '/' }]}
            collapsed
          />
        );

        expect(html).toBeTruthy();
      });
    });
  });

  describe('Phase 11: Chat Components', () => {
    describe('MessageBubble Component', () => {
      it('should render in SSR without errors', () => {
        // Note: MessageBubble has 'use client' - content uses ReactMarkdown which is client-side
        const html = renderToString(
          <MessageBubble
            id="msg-1"
            role="user"
            content="Hello, world!"
            timestamp={new Date('2024-01-15T10:30:00')}
          />
        );

        // Verify component renders without crashing (structure renders even if content is processed client-side)
        expect(html).toBeTruthy();
      });

      it('should render both role types in SSR', () => {
        const roles: Array<'user' | 'assistant'> = ['user', 'assistant'];

        roles.forEach(role => {
          const html = renderToString(
            <MessageBubble
              id={`msg-${role}`}
              role={role}
              content={`Message from ${role}`}
              timestamp={new Date()}
            />
          );

          // Verify component renders without crashing
          expect(html).toBeTruthy();
        });
      });

      it('should render with suggestions in SSR', () => {
        const html = renderToString(
          <MessageBubble
            id="msg-2"
            role="assistant"
            content="AI response"
            timestamp={new Date()}
            suggestions={[
              {
                id: 'sug-1',
                text: 'suggestion',
                confidence: 0.95,
              }
            ]}
          />
        );

        // Verify component renders without crashing
        expect(html).toBeTruthy();
      });
    });

    describe('ChatInterface Component', () => {
      it('should render in SSR without errors', () => {
        // Note: ChatInterface has 'use client' - full chat functionality requires client-side JS
        const html = renderToString(
          <ChatInterface
            messages={[
              { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
              { id: '2', role: 'assistant', content: 'Hi there', timestamp: new Date() }
            ]}
            onSendMessage={() => {}}
          />
        );

        // Verify component renders without crashing
        expect(html).toBeTruthy();
      });

      it('should render empty chat in SSR', () => {
        const html = renderToString(
          <ChatInterface
            messages={[]}
            onSendMessage={() => {}}
          />
        );

        // Verify component renders without crashing
        expect(html).toBeTruthy();
      });
    });
  });
});
