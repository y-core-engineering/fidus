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
    // Navigate to memory page with test user context
    await page.goto(`/fidus-memory?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);
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
      await page.goto(`/fidus-memory?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);

      // Either loading state or content should be visible quickly
      const heading = page.getByRole('heading', { name: 'Organizations' });
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('displays search input', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Check search input exists
      await expect(page.getByPlaceholder('Search organizations...')).toBeVisible();
    });

    test('displays industry filter', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Check industry filter dropdown exists
      const industrySelect = page.locator('select').filter({ hasText: 'All Industries' });
      await expect(industrySelect).toBeVisible();
    });

    test('can search for organizations', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Enter search term
      const searchInput = page.getByPlaceholder('Search organizations...');
      await searchInput.fill('test');

      // Wait for debounced search (300ms + API response)
      await page.waitForTimeout(500);

      // The list should update (either show filtered results or empty state)
      // This verifies the search doesn't crash
    });

    test('can filter by industry', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Select an industry
      const industrySelect = page.locator('select').filter({ hasText: 'All Industries' });
      await industrySelect.selectOption('Technology');

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // The list should update (either show filtered results or empty state)
    });

    test('shows empty state when no organizations exist', async ({ page }) => {
      // Use a user ID that has no organizations
      await page.goto(`/fidus-memory?userId=empty-user&tenantId=${TEST_TENANT_ID}`);

      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

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
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Try to submit without name
      await page.getByRole('button', { name: 'Add' }).click();

      // Should show validation error
      await expect(page.getByText(/Name is required/i)).toBeVisible();
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
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Click "+ Add" to add a property
      await page.getByText('+ Add').click();

      // Property inputs should appear
      await expect(page.getByPlaceholder('Property')).toBeVisible();
      await expect(page.getByPlaceholder('Value')).toBeVisible();

      // Fill property
      await page.getByPlaceholder('Property').fill('Website');
      await page.getByPlaceholder('Value').fill('https://example.com');

      // Remove property button should work
      await page.getByTitle('Remove').click();

      // Property inputs should be gone
      await expect(page.getByPlaceholder('Property')).not.toBeVisible();
    });

    test('creates an organization successfully', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).toBeVisible();

      // Fill name
      const uniqueName = `Test Organization ${Date.now()}`;
      await page.getByPlaceholder('Organization name').fill(uniqueName);

      // Select industry
      const industrySelect = page.locator('select').filter({ hasText: 'Select industry...' });
      await industrySelect.selectOption('Technology');

      // Select size
      const sizeSelect = page.locator('select').filter({ hasText: 'Select size...' });
      await sizeSelect.selectOption('mid');

      // Submit
      await page.getByRole('button', { name: 'Add' }).click();

      // Modal should close
      await expect(page.getByRole('heading', { name: 'Add Organization' })).not.toBeVisible();

      // Organization should appear in list
      await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 5000 });
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
      await page.getByRole('button', { name: 'Add Organization' }).click();
      const deleteTestName = `Delete Test ${Date.now()}`;
      await page.getByPlaceholder('Organization name').fill(deleteTestName);
      await page.getByRole('button', { name: 'Add' }).click();
      await expect(page.getByRole('heading', { name: 'Add Organization' })).not.toBeVisible();

      // Wait for organization to appear
      await expect(page.getByText(deleteTestName)).toBeVisible({ timeout: 5000 });

      // Select the created organization
      await page.getByText(deleteTestName).click();
      await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();

      // Delete
      await page.getByRole('button', { name: 'Delete' }).click();
      await page.getByRole('button', { name: 'Delete Organization' }).click();

      // Organization should be removed from list
      await expect(page.getByText(deleteTestName)).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Full CRUD Workflow', () => {
    test('complete create → view → edit → delete workflow', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Organizations' })).toBeVisible();

      const testName = `Workflow Test Org ${Date.now()}`;

      // 1. CREATE
      await page.getByRole('button', { name: 'Add Organization' }).click();
      await page.getByPlaceholder('Organization name').fill(testName);

      // Select industry
      const industrySelect = page.locator('select').filter({ hasText: 'Select industry...' });
      await industrySelect.selectOption('Technology');

      // Add a property
      await page.getByText('+ Add').click();
      await page.getByPlaceholder('Property').fill('Website');
      await page.getByPlaceholder('Value').fill('https://example.com');

      await page.getByRole('button', { name: 'Add' }).click();

      // Verify created
      await expect(page.getByText(testName)).toBeVisible({ timeout: 5000 });

      // 2. VIEW
      await page.getByText(testName).click();
      await expect(page.getByRole('heading', { name: 'Organization Details' })).toBeVisible();
      await expect(page.getByText('Name')).toBeVisible();

      // 3. EDIT
      await page.getByRole('button', { name: 'Edit' }).click();
      const updatedName = `${testName} Updated`;
      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.clear();
      await nameInput.fill(updatedName);
      await page.getByRole('button', { name: 'Save' }).click();

      // Verify updated
      await expect(page.getByText(updatedName)).toBeVisible({ timeout: 5000 });

      // 4. DELETE
      await page.getByRole('button', { name: 'Delete' }).click();
      await page.getByRole('button', { name: 'Delete Organization' }).click();

      // Verify deleted
      await expect(page.getByText(updatedName)).not.toBeVisible({ timeout: 5000 });
    });
  });
});
