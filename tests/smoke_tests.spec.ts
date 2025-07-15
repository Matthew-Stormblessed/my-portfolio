import 'dotenv/config';
import { test, expect } from '@playwright/test';


// Determine the base URL based on the environment variable
let baseURL;

// If the environment variable NEXT_PUBLIC_LOCAL_DEV is not set, use the production URL
// Otherwise, use the local development URL
if (!process.env.NEXT_PUBLIC_LOCAL_DEV) {
  baseURL = 'https://matthew-johnson-portfolio.netlify.app/';
} else {
  baseURL = 'http://localhost:3000/';
}

test('has title', async ({ page }) => {
  await page.goto(baseURL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Matthew Johnson/);
});

test('has home content', async ({ page }) => {
  await page.goto(baseURL);

  // Expect an element with the text "Hi! I'm Matthew Johnson".
  await expect(page.getByText("Hi, I'm Mathew")).toBeVisible();
  await expect(page.getByText("A Software Engineer who builds modern web experiences with React, TypeScript, and automation.")).toBeVisible();
  await expect(page.getByRole('link', { name: 'View My Work' })).toBeVisible();
});

test('has about page content', async ({ page }) => {
  await page.goto(`${baseURL}About`);

  // Expect an element with the text "About Me".
  await expect(page.getByText("About Me")).toBeVisible();
  await expect(page.getByText("Hi! I'm Matthew Johnson, a passionate Software Engineer dedicated to building modern, scalable web applications.")).toBeVisible();
  await expect(page.getByText("My journey in software development started with a desire to create projects that give others enjoyment.")).toBeVisible();
});

test('has projects page content', async ({ page }) => {
  await page.goto(`${baseURL}projects`);

  // Expect an element with the text "My projects".
  await expect(page.getByText("My projects").first()).toBeVisible();
  await expect(page.getByText("A personal portfolio website showcasing my projects and skills.")).toBeVisible();
  await expect(page.getByRole('link', { name: 'View on GitHub' }).first()).toBeVisible();
});

test('has actions page content', async ({ page }) => {
  await page.goto(`${baseURL}actions`);

  // Expect an element with the text "GitHub Actions".
  await expect(page.getByText("GitHub Actions")).toBeVisible();
  await expect(page.getByText("Latest GitHub Action Runs")).toBeVisible();
});

test('has navbar links', async ({ page }) => {
  await page.goto(baseURL);

  // Check if the navbar links are present
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Github Actions' })).toBeVisible();
});

test('navigates to about page', async ({ page }) => {
  await page.goto(baseURL);

  // Click on the "About" link in the navbar
  await page.getByRole('link', { name: 'About' }).click();

  // Expect to be on the about page
  await expect(page).toHaveURL(`${baseURL}About`);
});

test('navigates to projects page', async ({ page }) => {
  await page.goto(baseURL);

  // Click on the "Projects" link in the navbar
  await page.getByRole('link', { name: 'Projects' }).click();

  // Expect to be on the projects page
  await expect(page).toHaveURL(`${baseURL}projects`);
});

test('navigates to actions page', async ({ page }) => {
  await page.goto(baseURL);

  // Click on the "GitHub Actions" link in the navbar
  await page.getByRole('link', { name: 'GitHub Actions' }).click();

  // Expect to be on the actions page
  await expect(page).toHaveURL(`${baseURL}actions`);
});

test('navigates to home page from navbar', async ({ page }) => {
  await page.goto(`${baseURL}About`);

  // Click on the "Home" link in the navbar
  await page.getByRole('link', { name: 'Home' }).click();

  // Expect to be back on the home page
  await expect(page).toHaveURL(baseURL);
});

test('navigates to contact page', async ({ page }) => {
  await page.goto(baseURL);

  // Click on the "Contact" link in the navbar
  await page.getByRole('link', { name: 'Contact' }).click();

  // Expect to be on the contact page
  await expect(page).toHaveURL(`${baseURL}Contact`);
});

test('contact page content', async ({ page }) => {
  await page.goto(`${baseURL}Contact`);

  // Expect an element with the text "Contact Me".
  await expect(page.getByText("Get in Touch")).toBeVisible();
  await expect(page.getByText("Feel free to reach out to me through any of the following methods:")).toBeVisible();
  await expect(page.getByRole('link', { name: 'matthewisaacjohnson@gmail.com' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'https://github.com/Matthew-Stormblessed' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'linkedin.com/in/matthew-johnson-950631152' })).toBeVisible();
});
