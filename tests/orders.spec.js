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

test('Verify that the New User is able to add Addresses in the Address section @andriod', async () => {
    await login();
    await allPages.userPage.clickOnUserProfileIcon();
    await allPages.userPage.clickOnAddressTab();
    await allPages.userPage.clickOnAddAddressButton();
    await allPages.userPage.checkAddNewAddressMenu();
    await allPages.userPage.fillAddressForm();
});

test('Verify that user can purchase multiple quantities in a single order @andriod', async () => {
    const productName = 'GoPro HERO10 Black';
    await login();
    await allPages.inventoryPage.clickOnShopNowButton();
    await allPages.inventoryPage.clickOnAllProductsLink();
    await allPages.inventoryPage.searchProduct(productName);
    await allPages.inventoryPage.verifyProductTitleVisible(productName);
    await allPages.inventoryPage.clickOnAddToCartIcon();

    await allPages.cartPage.clickOnCartIcon();
    await allPages.cartPage.verifyCartItemVisible(productName);
    await allPages.cartPage.clickIncreaseQuantityButton();
    await allPages.cartPage.verifyIncreasedQuantity('3');
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.verifyProductInCheckout(productName);
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
});
