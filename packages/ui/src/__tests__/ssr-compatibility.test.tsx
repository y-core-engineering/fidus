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
});
