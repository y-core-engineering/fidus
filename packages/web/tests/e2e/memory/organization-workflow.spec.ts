import { test, expect } from '@playwright/test';

/**
 * E2E tests for Organization Entity Management workflow.
 *
 * Tests the complete CRUD lifecycle:
 * - Create organization
 * - View organization details
 * - Edit organization
 * - Delete organization
 * - Search functionality
 * - Industry filter
 *
 * Prerequisites:
 * - API server running at localhost:8000
 * - Web server running at localhost:3000
 * - ENABLE_ORGANIZATION_ENTITY feature flag enabled
 *
 * Run with: USE_DOCKER=1 npx playwright test organization-workflow
 */

const TEST_USER_ID = 'test-user-e2e';
const TEST_TENANT_ID = 'test-tenant-e2e';

test.describe('Organization Entity Management', () => {
  test.beforeEach(async ({ page }) => {
    // Set user ID in localStorage before navigating (required for OrganizationList to load)
    await page.goto('/fidus-memory');
    await page.evaluate((userId) => {
      localStorage.setItem('fidus_user_id', userId);
    }, TEST_USER_ID);

    // Navigate to organizations page
    await page.goto(`/fidus-memory/organizations?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);
  });

  test.describe('Organization List', () => {
    test('displays organization list with header', async ({ page }) => {
      // Wait for the organizations section to load
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Check that Add Organization button exists
      await expect(page.getByRole('button', { name: 'Add Organization' })).toBeVisible();
    });

    test('shows loading state initially', async ({ page }) => {
      // Navigate fresh to catch loading state
      await page.goto(`/fidus-memory/organizations?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);

      // Either loading state or content should be visible quickly
      const heading = page.getByRole('heading', { name: 'Organizations' });
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('displays search input', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Wait for organization list to load (feature flag check + data fetch)
      await page.waitForTimeout(1000);

      // Check search input exists (TextInput uses input element)
      const searchInput = page.locator('input[placeholder="Search organizations..."]');
      await expect(searchInput).toBeVisible({ timeout: 10000 });
    });

    test('displays industry filter', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Wait for organization list to load
      await page.waitForTimeout(1000);

      // Check industry filter exists (@fidus/ui Select renders as button + listbox)
      // The Select component shows "All Industries" as placeholder text
      const industryFilter = page.getByText('All Industries');
      await expect(industryFilter).toBeVisible({ timeout: 10000 });
    });

    test('can search for organizations', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Wait for organization list to load
      await page.waitForTimeout(1000);

      // Enter search term
      const searchInput = page.locator('input[placeholder="Search organizations..."]');
      await expect(searchInput).toBeVisible({ timeout: 10000 });
      await searchInput.fill('test');

      // Wait for debounced search (300ms + API response)
      await page.waitForTimeout(500);

      // The list should update (either show filtered results or empty state)
      // This verifies the search doesn't crash
    });

    test('can filter by industry', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Wait for organization list to load
      await page.waitForTimeout(1000);

      // Click on industry filter to open dropdown
      const industryFilter = page.getByText('All Industries');
      await expect(industryFilter).toBeVisible({ timeout: 10000 });
      await industryFilter.click();

      // Select Technology from the dropdown - use role to be specific
      await page.getByRole('option', { name: 'Technology' }).click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // The list should update (either show filtered results or empty state)
    });

    test('shows empty state when no organizations exist', async ({ page }) => {
      // Set a different user ID that has no organizations
      await page.goto('/fidus-memory');
      await page.evaluate(() => {
        localStorage.setItem('fidus_user_id', 'empty-user-no-orgs');
      });
      await page.goto(`/fidus-memory/organizations?userId=empty-user-no-orgs&tenantId=${TEST_TENANT_ID}`);

      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Wait for organization list to load
      await page.waitForTimeout(1000);

      // Should show empty state message
      await expect(
        page.getByText(/No organizations found|No orgs found|Add your first organization/i)
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Create Organization', () => {
    test('opens create organization modal', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Click Add Organization button
      await page.getByRole('button', { name: 'Add Organization' }).click();

      // Modal should open
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();
      await expect(page.getByPlaceholder('Organization name')).toBeVisible();
    });

    test('can close create modal with Cancel', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Cancel
      await page.getByRole('button', { name: 'Cancel' }).click();

      // Modal should close
      await expect(page.getByRole('heading', { name: 'Add Organization' })).not.toBeVisible();
    });

    test('validates required name field', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: /Add Organization/i }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Try to submit without name (click Add button in modal footer)
      await page.getByRole('button', { name: 'Add', exact: true }).click();

      // Should show validation error (react-hook-form shows this)
      await expect(page.getByText(/Name is required/i)).toBeVisible({ timeout: 5000 });
    });

    test('shows industry selector', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Industry dropdown should be visible
      const industrySelect = page.locator('select').filter({ hasText: 'Select industry...' });
      await expect(industrySelect).toBeVisible();
    });

    test('shows size selector', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Size dropdown should be visible
      const sizeSelect = page.locator('select').filter({ hasText: 'Select size...' });
      await expect(sizeSelect).toBeVisible();
    });

    test('can add and remove properties', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: /Add Organization/i }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Click "+ Add" link to add a property (it's a button styled as text)
      await page.getByRole('button', { name: '+ Add' }).click();

      // Property inputs should appear
      await expect(page.locator('input[placeholder="Property"]')).toBeVisible();
      await expect(page.locator('input[placeholder="Value"]')).toBeVisible();

      // Fill property
      await page.locator('input[placeholder="Property"]').fill('Website');
      await page.locator('input[placeholder="Value"]').fill('https://example.com');

      // Remove property button should work (it's a button with × text)
      await page.locator('button[title="Remove"]').click();

      // Property inputs should be gone
      await expect(page.locator('input[placeholder="Property"]')).not.toBeVisible();
    });

    test('creates an organization successfully', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: /Add Organization/i }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Fill name (the input has label "Name" not placeholder)
      const uniqueName = `Test Organization ${Date.now()}`;
      const nameInput = page.locator('form input').first();
      await nameInput.fill(uniqueName);

      // Select industry (native select element)
      await page.locator('select').first().selectOption('Technology');

      // Select size (second native select)
      await page.locator('select').nth(1).selectOption('mid');

      // Submit (button in modal footer)
      await page.getByRole('button', { name: 'Add', exact: true }).click();

      // Modal should close
      await expect(page.getByRole('heading', { name: 'Add Organization' })).not.toBeVisible({ timeout: 5000 });

      // Organization should appear in list (use first() to avoid strict mode with detail panel)
      await expect(page.getByText(uniqueName).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Organization Details', () => {
    test('shows organization details when selected', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Wait for list to load and click first organization card
      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();

        // Details panel should show
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();
        await expect(page.getByText('Name')).toBeVisible();
      }
    });

    test('shows metadata in details view', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Click on an organization
      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();

        // Metadata section should be visible
        await expect(page.getByText('Metadata')).toBeVisible();
        await expect(page.getByText('Source')).toBeVisible();
        await expect(page.getByText('Confidence')).toBeVisible();
      }
    });

    test('displays empty state when no organization selected', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Should show instruction to select organization
      await expect(page.getByText('Select an organization to view details')).toBeVisible();
    });
  });

  test.describe('Edit Organization', () => {
    test('enables edit mode when Edit clicked', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Select an organization
      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

        // Click Edit
        await page.getByRole('button', { name: 'Edit' }).click();

        // Should show editing UI
        await expect(page.getByRole('heading', { name: 'Edit Organization' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
      }
    });

    test('can cancel editing', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

        // Enter edit mode
        await page.getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Organization' })).toBeVisible();

        // Cancel
        await page.getByRole('button', { name: 'Cancel' }).click();

        // Should return to view mode
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();
      }
    });

    test('saves organization updates', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

        // Enter edit mode
        await page.getByRole('button', { name: 'Edit' }).click();

        // Update name
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.clear();
        await nameInput.fill('Updated Organization Name');

        // Save
        await page.getByRole('button', { name: 'Save' }).click();

        // Should return to view mode
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();
      }
    });
  });

  test.describe('Delete Organization', () => {
    test('shows delete confirmation dialog', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

        // Click Delete
        await page.getByRole('button', { name: 'Delete' }).click();

        // Confirmation dialog should appear
        await expect(page.getByRole('heading', { name: 'Delete Organization' })).toBeVisible();
        await expect(page.getByText('This action cannot be undone.')).toBeVisible();
      }
    });

    test('can cancel delete dialog', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      const orgCard = page.locator('[class*="Card"]').first();
      if (await orgCard.isVisible()) {
        await orgCard.click();
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

        // Open delete dialog
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole('heading', { name: 'Delete Organization' })).toBeVisible();

        // Cancel
        await page.getByRole('button', { name: 'Cancel' }).click();

        // Dialog should close, details still visible
        await expect(page.getByRole('heading', { name: 'Delete Organization' })).not.toBeVisible();
        await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();
      }
    });

    test('deletes organization successfully', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // First create an organization to delete
      await page.getByRole('button', { name: /Add Organization/i }).click();
      const deleteTestName = `Delete Test ${Date.now()}`;
      const nameInput = page.locator('form input').first();
      await nameInput.fill(deleteTestName);
      await page.getByRole('button', { name: 'Add', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).not.toBeVisible({ timeout: 5000 });

      // Wait for organization to appear in list (use first() for strict mode)
      await expect(page.getByText(deleteTestName).first()).toBeVisible({ timeout: 10000 });

      // Select the created organization (click on the card in list, first match)
      await page.getByText(deleteTestName).first().click();
      await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

      // Delete - find button in the detail panel (near the heading), use .last() to get the right-side panel button
      await page.getByRole('button', { name: 'Delete', exact: true }).last().click();
      await expect(page.getByRole('heading', { name: 'Delete Organization' })).toBeVisible({ timeout: 5000 });
      await page.getByRole('button', { name: 'Delete Organization' }).click();

      // Wait for modal to close and list to update
      await expect(page.getByRole('heading', { name: 'Delete Organization' })).not.toBeVisible({ timeout: 5000 });

      // Organization should be removed from list (wait for query invalidation)
      await page.waitForTimeout(500);
      await expect(page.locator('main').getByText(deleteTestName)).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Full CRUD Workflow', () => {
    test('complete create → view → edit → delete workflow', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      const testName = `Workflow Test Org ${Date.now()}`;

      // 1. CREATE
      await page.getByRole('button', { name: /Add Organization/i }).click();
      const formNameInput = page.locator('form input').first();
      await formNameInput.fill(testName);

      // Select industry (native select)
      await page.locator('select').first().selectOption('Technology');

      await page.getByRole('button', { name: 'Add', exact: true }).click();

      // Verify created (use first() to avoid strict mode with detail panel)
      await expect(page.getByText(testName).first()).toBeVisible({ timeout: 10000 });

      // 2. VIEW (click on first match - the card in list)
      await page.getByText(testName).first().click();
      await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

      // 3. EDIT - click Edit button (last() to get the one in detail panel)
      await page.getByRole('button', { name: 'Edit', exact: true }).last().click();
      await expect(page.getByRole('heading', { name: 'Edit Organization' })).toBeVisible();

      const updatedName = `${testName} Updated`;
      // Find the TextInput in the editing form (it has label="" but is visible)
      const editInput = page.locator('input[type="text"]').first();
      await editInput.clear();
      await editInput.fill(updatedName);
      await page.getByRole('button', { name: 'Save' }).click();

      // Wait for heading to change back to Organization Details (indicates save complete)
      await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible({ timeout: 10000 });

      // 4. DELETE - click Delete button (last() to get the one in detail panel)
      await page.getByRole('button', { name: 'Delete', exact: true }).last().click();
      await expect(page.getByRole('heading', { name: 'Delete Organization' })).toBeVisible({ timeout: 5000 });
      await page.getByRole('button', { name: 'Delete Organization' }).click();

      // Wait for modal to close
      await expect(page.getByRole('heading', { name: 'Delete Organization' })).not.toBeVisible({ timeout: 5000 });

      // Verify deleted - the test org should not be in the list anymore (wait for query invalidation)
      await page.waitForTimeout(500);
      await expect(page.locator('main').getByText(testName)).not.toBeVisible({ timeout: 5000 });
    });
  });
});
