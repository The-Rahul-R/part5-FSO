import axios from 'axios'
const BlogsBaseUrl = '/api/blogs'
const loginBaseUrl = '/api/login'

let token

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(BlogsBaseUrl)
  return request.then(response => response.data)
}

const login = async (cred) => {
  const request = axios.post(loginBaseUrl,cred)
  const response = await request
  return response.data
}

const createBlog = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(BlogsBaseUrl,blogObject,config)
  const response = await request
  return response.data
}

const deleteBlog = async(blogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${BlogsBaseUrl}/${blogObject.id}`,config)
  return response.data
}

const updateLike = async (blogObject) => {
  const blogUpdated = {
    ...blogObject,
    likes: Number(blogObject.likes) + 1
  }
  const request = axios.put(`${BlogsBaseUrl}/${blogObject.id}`,blogUpdated)
  const response = await request
  return response.data
}

export default { getAll,login,createBlog,setToken,updateLike,deleteBlog }