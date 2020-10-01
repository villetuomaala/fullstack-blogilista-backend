const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Blog about nonsense',
    author: 'Ville Tuomaala',
    url: 'https://google.com/villetuomaala',
    likes: 121212
  },
  {
    title: 'Blog about awesome things',
    author: 'Ville Tuomaala',
    url: 'https://google.com/villetuomaalakk',
    likes: 3
  }
]

const newBlog = {
  title: 'Blog about Java5',
  author: 'Java Dude',
  url: 'https://oracle.com',
  likes: 0
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, newBlog, blogsInDb }