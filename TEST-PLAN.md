# Sauce Demo Website - Test Plan

## Application Overview

The Sauce Demo website (https://www.saucedemo.com/) is an e-commerce demonstration application that showcases common shopping functionality. The application features:

- **User Authentication**: Login system with different user types
- **Product Catalog**: Display of available products with images, descriptions, and prices
- **Shopping Cart**: Add/remove items and manage quantities
- **Checkout Process**: Multi-step checkout with personal information and payment
- **Sorting and Filtering**: Product list manipulation options

## Test Scenarios

### 1. Authentication

#### 1.1 Standard User Login
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter username "standard_user"
3. Enter password "secret_sauce"
4. Click the login button

**Expected Results:**
- User is successfully logged in
- User is redirected to the products page
- Product list is visible
- Shopping cart is accessible

#### 1.2 Locked Out User
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter username "locked_out_user"
3. Enter password "secret_sauce"
4. Click the login button

**Expected Results:**
- Error message is displayed
- User remains on login page
- Message indicates user is locked out

#### 1.3 Invalid Login Attempts
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter invalid username "invalid_user"
3. Enter invalid password "wrong_password"
4. Click the login button

**Expected Results:**
- Error message is displayed
- Login form is not cleared
- User remains on login page

### 2. Product Catalog

#### 2.1 Product Sorting
**Steps:**
1. Login as standard user
2. Click the sort dropdown menu
3. Test each sorting option:
   - Name (A to Z)
   - Name (Z to A)
   - Price (low to high)
   - Price (high to low)

**Expected Results:**
- Products are correctly sorted for each option
- Sort persists when navigating back to product page
- Visual indication of current sort selection

#### 2.2 Product Details
**Steps:**
1. Click on a product name
2. Verify product details page
3. Click back to products

**Expected Results:**
- Detailed product information is displayed
- Image is loaded correctly
- Price is visible
- Add to cart button is present
- Back navigation works correctly

### 3. Shopping Cart

#### 3.1 Add Products to Cart
**Steps:**
1. Click "Add to cart" on multiple products
2. Verify cart badge updates
3. Click cart icon

**Expected Results:**
- Products are added to cart
- Cart badge shows correct count
- Cart page shows all added items
- Total price is calculated correctly

#### 3.2 Remove Products from Cart
**Steps:**
1. Add multiple products to cart
2. Remove one product using remove button
3. Verify cart updates

**Expected Results:**
- Product is removed from cart
- Cart badge updates correctly
- Total price updates
- Remove button changes to "Add to cart" on product page

### 4. Checkout Process

#### 4.1 Checkout Information
**Steps:**
1. Add items to cart
2. Click checkout
3. Enter first name
4. Enter last name
5. Enter postal code
6. Click continue

**Expected Results:**
- Form accepts valid input
- Navigation to checkout step two
- Error messages for empty required fields
- Cart summary remains visible

#### 4.2 Checkout Overview
**Steps:**
1. Complete checkout information
2. Review order on overview page
3. Verify item total
4. Verify tax amount
5. Verify total amount
6. Click finish

**Expected Results:**
- All prices are calculated correctly
- Item list matches cart
- Tax is calculated correctly
- Total includes tax
- Finish button proceeds to confirmation

#### 4.3 Checkout Complete
**Steps:**
1. Complete checkout process
2. Verify confirmation page
3. Click back home

**Expected Results:**
- Success message displayed
- Order confirmation shown
- Back home button returns to products
- Cart is emptied

### 5. Performance and Security

#### 5.1 Page Load Performance
**Steps:**
1. Navigate through main pages
2. Monitor load times
3. Check image loading

**Expected Results:**
- Pages load within acceptable time
- Images load properly
- No broken links
- Smooth navigation between pages

#### 5.2 Session Management
**Steps:**
1. Login successfully
2. Close browser
3. Reopen and navigate to products page

**Expected Results:**
- Session is cleared
- User is redirected to login
- Secure information is not cached

## Test Environment

- **Browsers**: Chrome, Firefox, Safari
- **Devices**: Desktop, Tablet, Mobile
- **Network**: Various connection speeds
- **Operating Systems**: Windows, macOS, Linux

## Test Data

- **Standard User**: username: "standard_user" / password: "secret_sauce"
- **Locked Out User**: username: "locked_out_user" / password: "secret_sauce"
- **Problem User**: username: "problem_user" / password: "secret_sauce"
- **Performance Glitch User**: username: "performance_glitch_user" / password: "secret_sauce"