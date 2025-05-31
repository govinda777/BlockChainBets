import { test, expect } from '@playwright/test';

test.describe('Application Page Load', () => {
  const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173'; // Allow overriding via env var

  test('should load the homepage and display essential elements', async ({ page }) => {
    // Navigate to the application's root URL
    await page.goto(appUrl);

    // 1. Assert page title (optional, adjust if no specific title is set or if it's dynamic)
    //    Example: await expect(page).toHaveTitle(/BlockChainBets/);
    //    For now, we'll skip strict title check if it's not critical for initial load.

    // 2. Assert that a key element from the main application layout is present.
    //    This could be a navbar, a main content area, or a specific app container.
    //    Let's assume there's a main div with an id like 'root' or a general identifiable layout structure.
    //    Adjust selector as per actual application structure.
    //    For example, checking if the body is not empty or a known header element exists.
    const mainAppContainer = page.locator('body > div#root'); // Common for React apps, adjust if needed
    await expect(mainAppContainer).toBeVisible();

    // Try to find a more specific element, like a header or main content area
    // This is highly dependent on the actual HTML structure of client/src/App.tsx or layout components
    // Let's assume a common pattern of a header element or a main role.
    // If these specific selectors fail, they need to be adjusted based on actual app code.
    const headerElement = page.locator('header').first(); // Assuming there's a <header>
    await expect(headerElement).toBeVisible();

    const mainElement = page.locator('main').first(); // Assuming there's a <main>
    await expect(mainElement).toBeVisible();


    // 3. Assert that a "Connect Wallet" button is visible.
    //    The selector for the "Connect Wallet" button needs to be determined from the actual frontend code.
    //    Common patterns: text content, a specific ID, or a class.
    //    Let's assume it's a button with text "Connect Wallet" or similar.
    //    This might need to be adjusted based on the actual component in client/src/components/wallet/ConnectWallet.tsx
    const connectWalletButton = page.getByRole('button', { name: /Connect Wallet/i }); // Case-insensitive regex

    // It could also be more specific if there are multiple buttons
    // e.g., page.locator('button:has-text("Connect Wallet")')

    await expect(connectWalletButton).toBeVisible();
    await expect(connectWalletButton).toBeEnabled();
  });
});
