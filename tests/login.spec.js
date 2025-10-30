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

test('Verify that user can change password successfully', async () => {
  await test.step('Login with existing password', async () => {
    await login1();
  });

  await test.step('Change password and verify login with new password', async () => {
    await allPages.userPage.clickOnUserProfileIcon();
    await allPages.userPage.clickOnSecurityButton();
    await allPages.userPage.enterNewPassword();
    await allPages.userPage.enterConfirmNewPassword();
    await allPages.userPage.clickOnUpdatePasswordButton();
    await allPages.userPage.getUpdatePasswordNotification();
  });
  await test.step('Verify login with new password and revert back to original password', async () => {
    // Re-login with new password
    await logout();
    await allPages.loginPage.login(process.env.USERNAME1, process.env.NEW_PASSWORD);

    // Revert back
    await allPages.userPage.clickOnUserProfileIcon();
    await allPages.userPage.clickOnSecurityButton();
    await allPages.userPage.revertPasswordBackToOriginal();
    await allPages.userPage.getUpdatePasswordNotification();
  })
});

test('Verify that the New User is able to add Addresses in the Address section', async () => {
  await login();
  await allPages.userPage.clickOnUserProfileIcon();
  await allPages.userPage.clickOnAddressTab();
  await allPages.userPage.clickOnAddAddressButton();
  await allPages.userPage.checkAddNewAddressMenu();
  await allPages.userPage.fillAddressForm();
});