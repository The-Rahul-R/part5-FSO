const { test, expect, describe, beforeEach } = require('@playwright/test');
const {loginWith,createBlog} = require('../tests/helper')

describe('blog app tests', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testUser',
        password: 'testUser'
      }
    });
    await page.goto('http://localhost:5173');
  });

  test('login form is shown', async ({ page }) => {    
    const locator = page.getByText('Log in to the application');
    await expect(locator).toBeVisible();
    const firstName = page.getByRole('textbox').first();
    await expect(firstName).toBeVisible();
    const lastName = page.getByRole('textbox').last();
    await expect(lastName).toBeVisible();
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible();
  });

  describe('login tests', () => {
    test('successful login with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('testUser');
      await page.getByRole('textbox').last().fill('testUser');
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('testUser logged in')).toBeVisible();
    });

    test('unsuccessful login with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('testUser');
      await page.getByRole('textbox').last().fill('testUser2');
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('testUser logged in')).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page,request }) => {
      await page.getByRole('textbox').first().fill('testUser');
      await page.getByRole('textbox').last().fill('testUser');
      await page.getByRole('button', { name: 'Submit' }).click();
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.locator('input[name="title"]').fill('blog1');
      await page.locator('input[name="author"]').fill('Test User');
      await page.locator('input[name="url"]').fill('blog1.com');
      await page.getByRole('button', { name: 'Create blog' }).click();
      await expect(page.getByText('blog1 View')).toBeVisible()
    });

    describe('A blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click();
        await page.locator('input[name="title"]').fill('blog2');
        await page.locator('input[name="author"]').fill('Test User');
        await page.locator('input[name="url"]').fill('blog2.com');
        await page.getByRole('button', { name: 'Create blog' }).click();
        await expect(page.getByText('blog2 View')).toBeVisible()
        // await createBlog(page,'blog2','Test User','blog2.com')
      });

      test('the blog can be liked', async ({ page }) => {
        const blogLocator = page.getByText('blog2').locator('..');
        await blogLocator.getByRole('button', { name: 'View' }).click();
        await expect(blogLocator.getByText('Likes: 0')).toBeVisible();
        await blogLocator.getByRole('button', { name: 'Like' }).click();
        await expect(blogLocator.getByText('Likes: 1')).toBeVisible();
      });

      test('the user can delete their own blog', async ({ page }) => {
        page.on('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm');
          await dialog.accept();
        });      
        const blogLocator = page.locator('.blog-title', { hasText: 'blog2' }).locator('..');
        await blogLocator.getByRole('button', { name: 'View' }).click();
        await blogLocator.getByRole('button', { name: 'delete' }).click();
        await expect(page.locator('.blog-title', { hasText: 'blog2' })).not.toBeVisible();
      });
      test('other users cant delete the blog', async ({page,request}) => {
        await page.getByRole('button', { name: 'log out' }).click();
        const locator = page.getByText('Log in to the application');
        await expect(locator).toBeVisible();
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Test User',
            username: 'testUser2',
            password: 'testUser2'
          }
        });
        await loginWith(page,'testUser2','testUser2')
        const blogLocator = page.locator('.blog-title', { hasText: 'blog2' }).locator('..');
        await blogLocator.getByRole('button', { name: 'View' }).click();
        await expect(blogLocator.getByRole('button', { name: 'delete' })).not.toBeVisible();
      })
      test('blogs are arranged in order of likes', async ({page}) => {
        await page.locator('input[name="title"]').fill('blog3');
        await page.locator('input[name="author"]').fill('Test User');
        await page.locator('input[name="url"]').fill('blog23.com');
        await page.getByRole('button', { name: 'Create blog' }).click();
        await expect(page.getByText('blog3 View')).toBeVisible()

        const blogLocator = page.locator('.blog-title', { hasText: 'blog3' }).locator('..');
        await blogLocator.getByRole('button', { name: 'View' }).click();
        await expect(blogLocator.getByText('Likes: 0')).toBeVisible();
        await blogLocator.getByRole('button', { name: 'Like' }).click();
        await expect(blogLocator.getByText('Likes: 1')).toBeVisible();
        await blogLocator.getByRole('button', { name: 'Like' }).click();
        await expect(blogLocator.getByText('Likes: 2')).toBeVisible();

        const blogTitles = page.locator('.blog-title');
        const blogTitlesText = await blogTitles.evaluateAll(elements => elements.map(e => e.textContent));
      
        // Validate the order
        expect(blogTitlesText[0]).toBe('blog3 Hide');
        expect(blogTitlesText[1]).toBe('blog2 View');

      })
    });
  });
});
