const blog = require('../models/blog')

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

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }