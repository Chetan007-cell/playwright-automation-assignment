# Playwright + TypeScript QA Automation Assignment

This repository contains a test automation framework built with [Playwright](https://playwright.dev/) and TypeScript. It implements Page Object Models (POM) for end-to-end UI testing against [SauceDemo](https://www.saucedemo.com/) and headless API tests against [ReqRes](https://reqres.in/).

---

## 📁 Project Structure

```text
.
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── README.md
├── pages/
│   ├── LoginPage.ts         # Selectors & actions for authentication & errors
│   ├── ProductsPage.ts      # Product listing, badge verification, and sorting
│   └── CheckoutPage.ts      # Cart checkout flow (info, overview, and completion)
└── tests/
    ├── ui/
    │   ├── login.spec.ts    # Standard user login & locked-out user validation
    │   ├── cart.spec.ts     # Adding products & verifying shopping cart badge
    │   ├── checkout.spec.ts # End-to-end checkout with order confirmation assertion
    │   └── sorting.spec.ts  # Price low-to-high sorting verification
    └── api/
        └── users.spec.ts    # ReqRes GET, POST, and contract assertions (API fixture only)
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers (Chromium)
```bash
npx playwright install chromium
```

---

## 🧪 Running Tests

### Run All Tests (Headless)
```bash
npx playwright test
```
*or using npm script:*
```bash
npm test
```

### Run UI Tests Only
```bash
npm run test:ui
# or: npx playwright test tests/ui
```

### Run API Tests Only
```bash
npm run test:api
# or: npx playwright test tests/api
```

### Run Tests in Headed Mode
```bash
npm run test:headed
# or: npx playwright test --headed
```

### View HTML Test Report
```bash
npm run test:report
# or: npx playwright show-report
```

---

## 🔍 Test Coverage Overview

### UI Tests (SauceDemo)
1. **Login Flow (`tests/ui/login.spec.ts`)**:
   - Standard user logs in successfully and lands on `/inventory.html`.
   - Locked-out user receives the `Epic sadface: Sorry, this user has been locked out.` error message and remains on the login page.
2. **Cart Flow (`tests/ui/cart.spec.ts`)**:
   - Standard user adds two products to the cart and verifies the cart badge displays `2`.
3. **Checkout Flow (`tests/ui/checkout.spec.ts`)**:
   - Standard user adds two items, navigates through cart, inputs sample customer information, confirms summary, finishes the order, and verifies the order confirmation header contains `"Thank you for your order"`.
4. **Sorting Flow (`tests/ui/sorting.spec.ts`)**:
   - Standard user sorts products by "Price (low to high)" and verifies the first displayed item has the lowest numeric price, as well as confirming numeric prices are strictly sorted ascending across all items.

### API Tests (ReqRes)
1. **GET `/api/users?page=2`**:
   - Status code `200`.
   - `data` property is an array.
   - Every user in the array has required attributes: `id`, `email`, `first_name`, and `last_name`.
2. **POST `/api/users`**:
   - Status code `201`.
   - Echoed properties `name: "morpheus"` and `job: "leader"`.
   - Presence of non-empty `id` and valid timestamp string `createdAt`.
3. **Bonus Create-Then-Verify Contract**:
   - Validates contract schema and payload consistency on the POST response without assuming ReqRes persists created mock records.
   - Uses Playwright's lightweight `request` fixture with no browser overhead.

---

## 🏗️ Design Decisions & Trade-Offs

- **Page Object Model (POM)**:
  - Encapsulates UI interaction methods and locators within reusable classes (`LoginPage`, `ProductsPage`, `CheckoutPage`).
  - Keeps tests expressive and readable while keeping test assertions inside spec files.
- **Robust Semantic Locators**:
  - Favored SauceDemo's dedicated `data-test` attributes (e.g. `[data-test="username"]`, `[data-test="inventory-item-price"]`, `[data-test="product-sort-container"]`) over fragile CSS paths or XPath.
- **Flake-Free Synchronization**:
  - Leverages Playwright's built-in auto-waiting and web-first assertions (`expect(locator).toBeVisible()`, `expect(page).toHaveURL()`).
  - Completely avoids arbitrary `page.waitForTimeout()` sleeps, ensuring fast, deterministic, and parallel-safe test runs.
- **Headless API Testing**:
  - API tests use Playwright's native `request` fixture without launching a browser instance, keeping execution fast (<500ms).
