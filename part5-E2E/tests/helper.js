const loginWith = async (page,username,password) => {
    await page.getByRole('textbox').first().fill(username);
    await page.getByRole('textbox').last().fill(password);
    await page.getByRole('button', { name: 'Submit' }).click();
}

const createBlog = async (page,title,author,url) => {
    await page.locator('input[name="title"]').fill(title);
    await page.locator('input[name="author"]').fill(author);
    await page.locator('input[name="url"]').fill(url);
    await page.getByRole('button', { name: 'Create blog' }).click();
}

const likeBlog = async (page,title,likes) => {
    const blogLocator = page.getByText(title).locator('..');
    await blogLocator.getByRole('button', { name: 'View' }).click();

    for(i in likes) {
        await blogLocator.getByRole('button', { name: 'Like' }).click();
    }
}
export {loginWith,createBlog,likeBlog}