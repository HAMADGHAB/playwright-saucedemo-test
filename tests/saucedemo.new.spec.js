import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Tests', () => {
  // Reusable login function
  async function login(page, username, password) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', username);
    await page.fill('[data-test="password"]', password);
    await page.click('[data-test="login-button"]');
  }

  test.beforeEach(async ({ page }) => {
    // Ensure clean state for each test
    await page.goto('https://www.saucedemo.com/');
  });

  test.describe('1. Authentication', () => {
    test('1.1 Standard User Login', async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(page.locator('.inventory_list')).toBeVisible();
      await expect(page.locator('.shopping_cart_link')).toBeVisible();
    });

    test('1.2 Locked Out User', async ({ page }) => {
      await login(page, 'locked_out_user', 'secret_sauce');
      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Sorry, this user has been locked out');
    });

    test('1.3 Invalid Login Attempts', async ({ page }) => {
      await login(page, 'invalid_user', 'wrong_password');
      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Username and password do not match');
    });
  });

  test.describe('2. Product Catalog', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each product catalog test
      await login(page, 'standard_user', 'secret_sauce');
      // Wait for the inventory page to be fully loaded
      await expect(page.locator('.inventory_list')).toBeVisible();
    });

    test('2.1 Product Sorting', async ({ page }) => {
      const sortOptions = [
        { value: 'az', name: 'Name (A to Z)' },
        { value: 'za', name: 'Name (Z to A)' },
        { value: 'lohi', name: 'Price (low to high)' },
        { value: 'hilo', name: 'Price (high to low)' }
      ];

      // Helper function to get all product names or prices
      const getProductData = async (type) => {
        if (type === 'names') {
          const elements = await page.locator('.inventory_item_name').all();
          return Promise.all(elements.map(el => el.textContent()));
        } else {
          const elements = await page.locator('.inventory_item_price').all();
          return Promise.all(elements.map(async (el) => {
            const text = await el.textContent();
            return parseFloat(text.replace('$', ''));
          }));
        }
      };

      // Test each sort option
      for (const option of sortOptions) {
        // Wait for and select the sort option
        const sortDropdown = page.locator('select.product_sort_container');
        await expect(sortDropdown).toBeVisible();
        await sortDropdown.selectOption(option.value);
        
        // Wait for sorting to complete
        await page.waitForTimeout(500);
        
        // Get the sorted data
        if (option.value === 'az' || option.value === 'za') {
          const names = await getProductData('names');
          const sortedNames = [...names].sort();
          if (option.value === 'za') sortedNames.reverse();
          expect(names).toEqual(sortedNames);
        } else {
          const prices = await getProductData('prices');
          const sortedPrices = [...prices].sort((a, b) => a - b);
          if (option.value === 'hilo') sortedPrices.reverse();
          expect(prices).toEqual(sortedPrices);
        }
      }
    });

    test('2.2 Product Details', async ({ page }) => {
      // Get the first product's name for verification
      const firstProductName = await page.locator('.inventory_item_name').first().textContent();
      await page.locator('.inventory_item_name').first().click();
      
      // Verify product details page
      await expect(page.locator('.inventory_details_name')).toHaveText(firstProductName);
      await expect(page.locator('.inventory_details_desc')).toBeVisible();
      await expect(page.locator('.inventory_details_price')).toBeVisible();
      await expect(page.getByText('Add to cart')).toBeVisible();
      
      await page.click('[data-test="back-to-products"]');
      await expect(page.locator('.inventory_list')).toBeVisible();
    });
  });

  test.describe('3. Shopping Cart', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');
    });

    test('3.1 Add Products to Cart', async ({ page }) => {
      // Add multiple products
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
      
      // Verify cart badge
      await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
      
      // Check cart contents
      await page.click('.shopping_cart_link');
      await expect(page.locator('.cart_item')).toHaveCount(2);
      
      // Verify specific items
      await expect(page.locator('.inventory_item_name')).toHaveCount(2);
      await expect(page.locator('.inventory_item_price')).toHaveCount(2);
    });

    test('3.2 Remove Products from Cart', async ({ page }) => {
      // Add product
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
      
      // Remove product
      await page.click('.shopping_cart_link');
      await page.click('[data-test="remove-sauce-labs-backpack"]');
      
      // Verify cart updates
      await expect(page.locator('.cart_item')).toHaveCount(0);
      await page.click('[data-test="continue-shopping"]');
      
      // Verify button state changed back
      await expect(
        page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      ).toBeVisible();
    });
  });

  test.describe('4. Checkout Process', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'standard_user', 'secret_sauce');
      // Add item to cart and go to checkout
      await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('.shopping_cart_link');
      await page.click('[data-test="checkout"]');
    });

    test('4.1 Checkout Information', async ({ page }) => {
      // Fill checkout information
      await page.fill('[data-test="firstName"]', 'ALI');
      await page.fill('[data-test="lastName"]', 'MED');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      
      // Verify navigation to next step
      await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
      await expect(page.locator('.summary_info')).toBeVisible();
    });

    test('4.2 Checkout Overview', async ({ page }) => {
      // Fill checkout information
      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Doe');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      
      // Verify overview page elements
      await expect(page.locator('.summary_subtotal_label')).toBeVisible();
      await expect(page.locator('.summary_tax_label')).toBeVisible();
      await expect(page.locator('.summary_total_label')).toBeVisible();
      
      // Verify calculations
      const subtotalText = await page.locator('.summary_subtotal_label').textContent();
      const taxText = await page.locator('.summary_tax_label').textContent();
      const totalText = await page.locator('.summary_total_label').textContent();
      
      // Extract numbers and verify total
      const subtotal = parseFloat(subtotalText.match(/\$(\d+\.\d+)/)[1]);
      const tax = parseFloat(taxText.match(/\$(\d+\.\d+)/)[1]);
      const total = parseFloat(totalText.match(/\$(\d+\.\d+)/)[1]);
      
      expect(Math.round((subtotal + tax) * 100) / 100).toBe(total);
    });

    test('4.3 Checkout Complete', async ({ page }) => {
      // Complete checkout process
      await page.fill('[data-test="firstName"]', 'John');
      await page.fill('[data-test="lastName"]', 'Doe');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      await page.click('[data-test="finish"]');
      
      // Verify completion
      await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
      await expect(page.locator('.complete-text')).toBeVisible();
      
      // Return to products and verify cart is empty
      await page.click('[data-test="back-to-products"]');
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    });
  });

  test.describe('5. Performance and Security', () => {
    test('5.1 Page Load Performance', async ({ page }) => {
      const response = await page.goto('https://www.saucedemo.com/');
      expect(response.status()).toBe(200);
      
      // Verify critical elements load
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
      await expect(page.locator('.login_logo')).toBeVisible();
    });

    test('5.2 Session Management', async ({ page, context }) => {
      await login(page, 'standard_user', 'secret_sauce');
      
      // Verify successful login
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      
      // Clear session
      await context.clearCookies();
      
      // Try accessing protected page
      await page.goto('https://www.saucedemo.com/inventory.html');
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });
});