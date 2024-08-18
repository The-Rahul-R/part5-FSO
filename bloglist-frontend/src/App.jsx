import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage,setErrorMessage] = useState(null)
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)

  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const existingUser = window.localStorage.getItem('loggedUser')
    if(existingUser){
      const user = JSON.parse(existingUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogout = async e => {
    e.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      const loggedUser = await blogService.login({ username,password })
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedUser',JSON.stringify(loggedUser))
      console.log('logged user =', loggedUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const createdBlog = await blogService.createBlog({ title, author, url })
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setErrorMessage(`${createdBlog.title} is successfully created`)
    } catch (exception) {
      console.log('error creating blog')
      setErrorMessage('Error creating blog')
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const updateLike = async (blog) => {
    try{
      const updatedBlog = await blogService.updateLike(blog)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch(exception) {
      setErrorMessage('could not update like')
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const handleDelete = async(blog) => {
    const confirmation = window.confirm(`do you want to delete ${blog.title}`)
    if(confirmation) {
      try{
        const result = await blogService.deleteBlog(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch(exception) {
        setErrorMessage('could not delete blog')
      }
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  if(user === null ) {
    return (
      <div>
        <h1>Log in to the application</h1>
        <Notification message={errorMessage} type={'error'}/>
        <form onSubmit={handleLogin}>
          <div>
            <label id='username'>
              Username
              <input type='text' name='username' value={username} onChange={e => setUsername(e.target.value)}/>
            </label>
          </div>
          <div>
            <label id='password'>
              Password
              <input type='text' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
            </label>
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Blogs</h1> {console.log('blogs',blogs)}
        <span>{user.username} logged in</span>
        <Notification message={errorMessage} type='success'/>
        <span>{user !== null && <button onClick={handleLogout}>log out</button>}</span>
        <Togglable buttonLabel = 'new blog'>
          <CreateForm
            title={title}
            url={url}
            author={author}
            setAuthor={setAuthor}
            setUrl={setUrl}
            setTitle={setTitle}
            handleCreate={handleCreate}
          />
        </Togglable>
        <div>
          {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={handleDelete} />
          )}
        </div>
      </div>
    )
  }
}

export default App