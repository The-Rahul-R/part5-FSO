import { useState } from 'react'
import '../App.css'

const Blog = ({ blog,updateLike,deleteBlog }) => {
  const [showDetails,setShowDetails] = useState(false)
  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }
  const loggeduser = window.localStorage.getItem('loggedUser')
  const user = JSON.parse(loggeduser)
  return(
    <div className="individual">
      <div className='blog-title'>
        {blog.title} <button onClick={toggleVisibility}>{showDetails? 'Hide' : 'View' }</button>
      </div>
      {showDetails &&
        <div className='blog-details'>
          <p> URL: <a href={blog.url}>{blog.url}</a></p>
          <p> Likes: {blog.likes} <button onClick={() => updateLike(blog)}>Like</button></p>
          <p> Author: {blog.author}</p>
          {blog.user.username === user.username && <button onClick={() => deleteBlog(blog)}>delete</button> }
        </div>
      }
    </div>
  )
}

export default Blog