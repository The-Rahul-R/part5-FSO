/* eslint-disable no-undef */
import { render,screen } from '@testing-library/react'
import Blog from './Blog'
import CreateForm from './CreateForm'
import { beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'

let container
const user = {
  id: 1,
  username: 'test-user',
}
const blog = {
  title: 'test blog',
  url: 'test url',
  author: 'test author',
  likes: 5,
  user: {
    id: 1,
    username: 'test-user',
  }
}

describe('basic tests', () => {
  beforeEach(() => {
    window.localStorage.setItem('loggedUser', JSON.stringify(user))
    container = render(<Blog blog={blog}/>).container
  })

  test('checks if only title in visible', () => {
    expect(container.querySelector('.blog-title')).toBeDefined()
    expect(container.querySelector('.blog-details')).toBeNull()
  })

  test('checks that url and likes are visible after clicking the button',async () => {
    const user1 = userEvent.setup()
    const button = screen.getByText('View')
    await user1.click(button)
    expect(container.querySelector('.blog-title')).toBeDefined()
    expect(container.querySelector('.blog-details')).toBeDefined()
  })
})


describe('tests with mock calls', () => {
  test('updateLikes event handler is called twice',async () => {
    const updateLike = vi.fn()
    const user = userEvent.setup()
    render(<Blog blog={blog} updateLike={updateLike}/>)
    const button = screen.getByText('View')
    await user.click(button)
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateLike.mock.calls).toHaveLength(2)
  })

  test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup()

    render(
      <CreateForm
        title=""
        author=""
        url=""
        setTitle={vi.fn()}
        setAuthor={vi.fn()}
        setUrl={vi.fn()}
        handleCreate={vi.fn()}
      />
    )

    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    const createButton = screen.getByRole('button', { name: /create/i })

    await user.type(titleInput, 'New Blog Title')
    await user.type(authorInput, 'New Blog Author')
    await user.type(urlInput, 'https://newblogurl.com')
    await user.click(createButton)

    expect(handleCreate).toHaveBeenCalledTimes(1)
    expect(handleCreate).toHaveBeenCalledWith(expect.any(Object)) // Ensuring the event object is passed
    expect(handleCreate.mock.calls[0][0].preventDefault).toBeDefined()
  })

  test('method 2: form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()
    const handleCreate = async (e) => {
      e.preventDefault()
      createBlog({
        title: 'New Blog Title',
        author: 'New Blog Author',
        url: 'https://newblogurl.com'
      })
    };

    render(
      <CreateForm
        title=""
        author=""
        url=""
        setTitle={vi.fn()}
        setAuthor={vi.fn()}
        setUrl={vi.fn()}
        handleCreate={handleCreate}
      />
    )

    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    const createButton = screen.getByRole('button', { name: /create/i })

    await user.type(titleInput, 'New Blog Title')
    await user.type(authorInput, 'New Blog Author')
    await user.type(urlInput, 'https://newblogurl.com')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'https://newblogurl.com'
    })
  })
})