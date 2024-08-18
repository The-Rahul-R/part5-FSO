import Blog from './Blog'

const CreateForm = ({ handleCreate,title,author,url,setTitle,setAuthor,setUrl }) => {
  return (
    <div>
      <div>
        <h2>Create a new blog</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label id='title'>
              Title
              <input type='text' name='title' value={title} onChange={e => setTitle(e.target.value)}/>
            </label>
          </div>
          <div>
            <label id='author'>
              Author
              <input type='text' name='author' value={author} onChange={e => setAuthor(e.target.value)}/>
            </label>
          </div>
          <div>
            <label id='url'>
              URL
              <input type='text' name='url' value={url} onChange={e => setUrl(e.target.value)}/>
            </label>
          </div>
          <button type='submit'>Create blog</button>
        </form>
      </div>
    </div>
  )
}

export default CreateForm