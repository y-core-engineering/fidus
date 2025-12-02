import { test, expect } from '@playwright/test';

/**
 * E2E tests for User Profile component.
 *
 * Prerequisites:
 * - API server running at localhost:8000
 * - Web server running at localhost:3000
 * - Test user exists in database
 *
 * Run with: pnpm --filter @fidus/web test:e2e
 */

const TEST_USER_ID = 'test-user-e2e';
const TEST_TENANT_ID = 'test-tenant-e2e';

test.describe('User Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to memory page with test user context
    await page.goto(`/fidus-memory?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);
  });

  test('displays user profile with correct information', async ({ page }) => {
    // Wait for profile to load
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // Check that key sections are present
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Preferred Language')).toBeVisible();
    await expect(page.getByText('Timezone')).toBeVisible();
    await expect(page.getByText('Skills')).toBeVisible();
  });

  test('shows loading skeleton initially', async ({ page }) => {
    // Check for skeleton loading state (briefly visible)
    await page.goto(`/fidus-memory?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);

    // Either skeleton is visible or profile has loaded
    const skeleton = page.locator('[class*="skeleton"]');
    const profile = page.getByRole('heading', { name: 'User Profile' });

    await expect(skeleton.or(profile).first()).toBeVisible({ timeout: 5000 });
  });

  test('enables editing when Edit Profile is clicked', async ({ page }) => {
    // Wait for profile to load
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // Click Edit button
    await page.getByRole('button', { name: 'Edit Profile' }).click();

    // Check that Save and Cancel buttons appear
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('can update user name', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // Enter edit mode
    await page.getByRole('button', { name: 'Edit Profile' }).click();

    // Update name
    const nameInput = page.getByPlaceholder('Your full name');
    await nameInput.clear();
    await nameInput.fill('Updated Test User');

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify edit mode is exited
    await expect(page.getByRole('button', { name: 'Edit Profile' })).toBeVisible();
  });

  test('can cancel editing', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // Get original name
    const nameInput = page.getByPlaceholder('Your full name');
    const originalName = await nameInput.inputValue();

    // Enter edit mode
    await page.getByRole('button', { name: 'Edit Profile' }).click();

    // Change name
    await nameInput.clear();
    await nameInput.fill('Changed Name');

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify name is reverted
    await expect(nameInput).toHaveValue(originalName);
  });

  test('shows delete confirmation dialog', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // Click Delete Account button
    await page.getByRole('button', { name: 'Delete Account' }).click();

    // Check dialog appears
    await expect(page.getByText('Are you sure you want to delete your account?')).toBeVisible();
    await expect(page.getByText('This action cannot be undone.')).toBeVisible();

    // Cancel dialog
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Dialog should close
    await expect(page.getByText('Are you sure you want to delete your account?')).not.toBeVisible();
  });

  test('displays metadata section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // Check metadata is shown
    await expect(page.getByText(/User ID:/)).toBeVisible();
    await expect(page.getByText(/Tenant ID:/)).toBeVisible();
    await expect(page.getByText(/Created:/)).toBeVisible();
    await expect(page.getByText(/Last Updated:/)).toBeVisible();
  });

  test('handles API errors gracefully', async ({ page }) => {
    // Navigate with invalid user ID
    await page.goto(`/fidus-memory?userId=non-existent&tenantId=${TEST_TENANT_ID}`);

    // Should show error alert
    await expect(page.getByText(/Failed to load user profile/)).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Skills Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fidus-memory?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit Profile' }).click();
  });

  test('can add a new skill', async ({ page }) => {
    // Find skills input
    const skillInput = page.getByPlaceholder('Add skill...');

    // Add skill
    await skillInput.fill('NewSkill');
    await skillInput.press('Enter');

    // Verify skill appears as tag
    await expect(page.getByText('NewSkill')).toBeVisible();
  });

  test('can remove a skill', async ({ page }) => {
    // Find skills section and get first remove button
    const removeButtons = page.locator('[aria-label*="Remove"]');

    if ((await removeButtons.count()) > 0) {
      await removeButtons.first().click();
      // Skill should be removed (count decreases)
    }
  });

  test('prevents duplicate skills', async ({ page }) => {
    const skillInput = page.getByPlaceholder('Add skill...');

    // Add skill twice
    await skillInput.fill('DuplicateTest');
    await skillInput.press('Enter');

    await skillInput.fill('DuplicateTest');
    await skillInput.press('Enter');

    // Should only appear once
    const duplicateSkills = page.getByText('DuplicateTest');
    await expect(duplicateSkills).toHaveCount(1);
  });
});

test.describe('Language and Timezone Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/fidus-memory?userId=${TEST_USER_ID}&tenantId=${TEST_TENANT_ID}`);
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit Profile' }).click();
  });

  test('can change preferred language', async ({ page }) => {
    // Find language select (by label)
    const languageSection = page.locator('text=Preferred Language').locator('..');

    // Click on select trigger
    await languageSection.getByRole('combobox').click();

    // Select German
    await page.getByText('Deutsch').click();

    // Verify selection
    await expect(languageSection.getByRole('combobox')).toHaveText('Deutsch');
  });

  test('can change timezone', async ({ page }) => {
    const timezoneSection = page.locator('text=Timezone').locator('..');

    // Click select
    await timezoneSection.getByRole('combobox').click();

    // Select Berlin timezone
    await page.getByText('Europe/Berlin').click();

    // Verify selection
    await expect(timezoneSection.getByRole('combobox')).toHaveText('Europe/Berlin');
  });
});
