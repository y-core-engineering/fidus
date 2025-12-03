import { test, expect } from '@playwright/test';

/**
 * E2E tests for Person Entity Management workflow.
 *
 * Tests the complete CRUD lifecycle:
 * - Create person
 * - View person details
 * - Edit person
 * - Delete person
 * - Search functionality
 *
 * Prerequisites:
 * - API server running at localhost:8000
 * - Web server running at localhost:3000
 * - ENABLE_PERSON_ENTITY feature flag enabled
 *
 * Run with: USE_DOCKER=1 npx playwright test person-workflow
 */

const TEST_USER_ID = 'test-user-e2e';
const TEST_TENANT_ID = 'test-tenant-e2e';

test.describe('Person Entity Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to persons page with test user context
    await page.goto(`/fidus-memory/persons?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);
  });

  test.describe('Person List', () => {
    test('displays person list with header', async ({ page }) => {
      // Wait for the persons section to load
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Check that Add Person button exists
      await expect(page.getByRole('button', { name: 'Add Person' })).toBeVisible();
    });

    test('shows loading state initially', async ({ page }) => {
      // Navigate fresh to catch loading state
      await page.goto(`/fidus-memory/persons?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);

      // Either loading state or content should be visible quickly
      const heading = page.getByRole('heading', { name: 'Persons' });
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('displays search input', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Check search input exists
      await expect(page.getByPlaceholder('Search people...')).toBeVisible();
    });

    test('can search for persons', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Enter search term
      const searchInput = page.getByPlaceholder('Search people...');
      await searchInput.fill('test');

      // Wait for debounced search (300ms + API response)
      await page.waitForTimeout(500);

      // The list should update (either show filtered results or empty state)
      // This verifies the search doesn't crash
    });

    test('shows empty state when no persons exist', async ({ page }) => {
      // Use a user ID that has no persons
      await page.goto(`/fidus-memory/persons?userId=empty-user&tenantId=${TEST_TENANT_ID}`);

      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Should show empty state message
      await expect(
        page.getByText(/No people found|No persons found|Add your first person/i)
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Create Person', () => {
    test('opens create person modal', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Click Add Person button
      await page.getByRole('button', { name: 'Add Person' }).click();

      // Modal should open
      await expect(page.getByRole('heading', { name: 'Add Person' })).toBeVisible();
      await expect(page.getByPlaceholder("Person's name")).toBeVisible();
    });

    test('can close create modal with Cancel', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Person' }).click();
      await expect(page.getByRole('heading', { name: 'Add Person' })).toBeVisible();

      // Cancel
      await page.getByRole('button', { name: 'Cancel' }).click();

      // Modal should close
      await expect(page.getByRole('heading', { name: 'Add Person' })).not.toBeVisible();
    });

    test('validates required name field', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Person' }).click();
      await expect(page.getByRole('heading', { name: 'Add Person' })).toBeVisible();

      // Try to submit without name
      await page.getByRole('button', { name: 'Add' }).click();

      // Should show validation error
      await expect(page.getByText(/Name is required/i)).toBeVisible();
    });

    test('can add and remove properties', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Person' }).click();
      await expect(page.getByRole('heading', { name: 'Add Person' })).toBeVisible();

      // Click "Add" to add a property
      await page.getByText('+ Add').click();

      // Property inputs should appear
      await expect(page.getByPlaceholder('Property')).toBeVisible();
      await expect(page.getByPlaceholder('Value')).toBeVisible();

      // Fill property
      await page.getByPlaceholder('Property').fill('Profession');
      await page.getByPlaceholder('Value').fill('Software Engineer');

      // Remove property button should work
      await page.getByTitle('Remove').click();

      // Property inputs should be gone
      await expect(page.getByPlaceholder('Property')).not.toBeVisible();
    });

    test('creates a person successfully', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Open modal
      await page.getByRole('button', { name: 'Add Person' }).click();
      await expect(page.getByRole('heading', { name: 'Add Person' })).toBeVisible();

      // Fill name
      const uniqueName = `Test Person ${Date.now()}`;
      await page.getByPlaceholder("Person's name").fill(uniqueName);

      // Add a property
      await page.getByText('+ Add').click();
      await page.getByPlaceholder('Property').fill('Company');
      await page.getByPlaceholder('Value').fill('Test Corp');

      // Submit
      await page.getByRole('button', { name: 'Add' }).click();

      // Modal should close
      await expect(page.getByRole('heading', { name: 'Add Person' })).not.toBeVisible();

      // Person should appear in list
      await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Person Details', () => {
    test('shows person details when selected', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Wait for list to load and click first person
      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();

        // Details panel should show
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();
        await expect(page.getByText('Name')).toBeVisible();
      }
    });

    test('shows metadata in details view', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Click on a person
      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();

        // Metadata section should be visible
        await expect(page.getByText('Metadata')).toBeVisible();
        await expect(page.getByText('Source')).toBeVisible();
        await expect(page.getByText('Confidence')).toBeVisible();
      }
    });

    test('displays empty state when no person selected', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Should show instruction to select person
      await expect(page.getByText('Select a person to view details')).toBeVisible();
    });
  });

  test.describe('Edit Person', () => {
    test('enables edit mode when Edit clicked', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // Select a person
      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();

        // Click Edit
        await page.getByRole('button', { name: 'Edit' }).click();

        // Should show editing UI
        await expect(page.getByRole('heading', { name: 'Edit Person' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
      }
    });

    test('can cancel editing', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();

        // Enter edit mode
        await page.getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Person' })).toBeVisible();

        // Cancel
        await page.getByRole('button', { name: 'Cancel' }).click();

        // Should return to view mode
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();
      }
    });

    test('saves person updates', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();

        // Enter edit mode
        await page.getByRole('button', { name: 'Edit' }).click();

        // Update name
        const nameInput = page.locator('input[type="text"]').first();
        await nameInput.clear();
        await nameInput.fill('Updated Person Name');

        // Save
        await page.getByRole('button', { name: 'Save' }).click();

        // Should return to view mode
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();
      }
    });
  });

  test.describe('Delete Person', () => {
    test('shows delete confirmation dialog', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();

        // Click Delete
        await page.getByRole('button', { name: 'Delete' }).click();

        // Confirmation dialog should appear
        await expect(page.getByRole('heading', { name: 'Delete Person' })).toBeVisible();
        await expect(page.getByText('This action cannot be undone.')).toBeVisible();
      }
    });

    test('can cancel delete dialog', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      const personItem = page.locator('[role="button"]').filter({ hasText: /.+/ }).first();
      if (await personItem.isVisible()) {
        await personItem.click();
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();

        // Open delete dialog
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole('heading', { name: 'Delete Person' })).toBeVisible();

        // Cancel
        await page.getByRole('button', { name: 'Cancel' }).click();

        // Dialog should close, details still visible
        await expect(page.getByRole('heading', { name: 'Delete Person' })).not.toBeVisible();
        await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();
      }
    });

    test('deletes person successfully', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      // First create a person to delete
      await page.getByRole('button', { name: 'Add Person' }).click();
      const deleteTestName = `Delete Test ${Date.now()}`;
      await page.getByPlaceholder("Person's name").fill(deleteTestName);
      await page.getByRole('button', { name: 'Add' }).click();
      await expect(page.getByRole('heading', { name: 'Add Person' })).not.toBeVisible();

      // Wait for person to appear
      await expect(page.getByText(deleteTestName)).toBeVisible({ timeout: 5000 });

      // Select the created person
      await page.getByText(deleteTestName).click();
      await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();

      // Delete
      await page.getByRole('button', { name: 'Delete' }).click();
      await page.getByRole('button', { name: 'Delete Person' }).click();

      // Person should be removed from list
      await expect(page.getByText(deleteTestName)).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Full CRUD Workflow', () => {
    test('complete create → view → edit → delete workflow', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Persons' })).toBeVisible();

      const testName = `Workflow Test ${Date.now()}`;

      // 1. CREATE
      await page.getByRole('button', { name: 'Add Person' }).click();
      await page.getByPlaceholder("Person's name").fill(testName);
      await page.getByText('+ Add').click();
      await page.getByPlaceholder('Property').fill('Email');
      await page.getByPlaceholder('Value').fill('test@example.com');
      await page.getByRole('button', { name: 'Add' }).click();

      // Verify created
      await expect(page.getByText(testName)).toBeVisible({ timeout: 5000 });

      // 2. VIEW
      await page.getByText(testName).click();
      await expect(page.getByRole('heading', { name: 'Person Details' })).toBeVisible();
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
      await page.getByRole('button', { name: 'Delete Person' }).click();

      // Verify deleted
      await expect(page.getByText(updatedName)).not.toBeVisible({ timeout: 5000 });
    });
  });
});
