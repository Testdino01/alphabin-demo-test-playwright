// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

async function login(username = process.env.USERNAME, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function login1(username = process.env.USERNAME1, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function logout() {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.clickOnLogoutButton();
}

test('Verify user can place and cancel an order', async () => {
  const productName = 'GoPro HERO10 Black';
  const productPriceAndQuantity = '₹49,999 × 1';
  const productQuantity = '1';
  const orderStatusProcessing = 'Processing';
  const orderStatusCanceled = 'Canceled';

  await test.step('Verify that user can login successfully', async () => {
    await login();
    await allPages.inventoryPage.clickOnAllProductsLink();
    await allPages.inventoryPage.searchProduct(productName);
    await allPages.inventoryPage.verifyProductTitleVisible(productName);
    await allPages.inventoryPage.clickOnAddToCartIcon();
  })

  await test.step('Add product to cart and checkout', async () => {
   await allPages.cartPage.clickOnCartIcon();
    await allPages.cartPage.verifyCartItemVisible(productName);
    await allPages.cartPage.clickOnCheckoutButton();
  })

  await test.step('Place order and click on continue shopping', async () => {
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.verifyProductInCheckout(productName);
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    await allPages.checkoutPage.verifyOrderItemName(productName);
    await allPages.inventoryPage.clickOnContinueShopping();
  })

  await test.step('Verify order in My Orders', async () => {
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.orderPage.clickOnMyOrdersTab();
    await allPages.orderPage.verifyMyOrdersTitle();
    await allPages.orderPage.clickOnPaginationButton(2);
    await allPages.orderPage.verifyProductInOrderList(productName);
    await allPages.orderPage.verifyPriceAndQuantityInOrderList(productPriceAndQuantity);
    await allPages.orderPage.verifyOrderStatusInList(orderStatusProcessing, productName);
    await allPages.orderPage.clickOnPaginationButton(1);
    await allPages.orderPage.clickViewDetailsButton(1);
    await allPages.orderPage.verifyOrderDetailsTitle();
    await allPages.orderPage.verifyOrderSummary(productName, productQuantity, '₹49,999', orderStatusProcessing); 
  })

  await test.step('Cancel order and verify status is updated to Canceled', async () => {
    await allPages.orderPage.clickCancelOrderButton(2);
    await allPages.orderPage.confirmCancellation();
    await allPages.orderPage.verifyCancellationConfirmationMessage();
    await allPages.orderPage.verifyMyOrdersCount();
    await allPages.orderPage.clickOnMyOrdersTab();
    await allPages.orderPage.verifyMyOrdersTitle();
    await allPages.orderPage.clickOnPaginationButton(2);
    await allPages.orderPage.verifyOrderStatusInList(orderStatusCanceled, productName);
  })
});

test('Verify That a New User Can Successfully Complete the Journey from Registration to a Multiple Order Placement', async () => {
    const email = `test+${Date.now()}@test.com`;
    const firstName = 'Test';
    const lastName = 'User';

    let productName= `Rode NT1-A Condenser Mic`;

  await test.step('Verify that user can register successfully', async () => {
    // Signup
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.clickOnSignupLink();
    await allPages.signupPage.assertSignupPage();
    await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
    await allPages.signupPage.verifySuccessSignUp();
  })

  await test.step('Verify that user can login successfully', async () => {
    // Login as new user
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.login(email, process.env.PASSWORD);
    await allPages.loginPage.verifySuccessSignIn();
    await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
  })

  await test.step('Navigate to All Products and add view details of a random product', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.allProductsPage.clickNthProduct(1);
    await allPages.productDetailsPage.clickOnReviewsTab();
    await allPages.productDetailsPage.assertReviewsTab();
    await allPages.productDetailsPage.clickOnAdditionalInfoTab();
    await allPages.productDetailsPage.assertAdditionalInfoTab();
  })

  await test.step('Add product to cart, change quantity, add new address and checkout', async () => {
    await allPages.productDetailsPage.clickAddToCartButton();
    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.clickIncreaseQuantityButton();
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.fillShippingAddress(process.env.SFIRST_NAME, email, process.env.SCITY, process.env.SSTATE, process.env.SSTREET_ADD, process.env.SZIP_CODE, process.env.SCOUNTRY);
    await allPages.checkoutPage.clickSaveAddressButton();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    await allPages.checkoutPage.verifyOrderConfirmedTitle();
    await allPages.checkoutPage.clickOnContinueShoppingButton();
  })

  await test.step('Add another product to cart, select existing address and checkout', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.allProductsPage.clickNthProduct(1);
    await allPages.productDetailsPage.clickAddToCartButton();
    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
  })
});

