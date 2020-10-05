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

const updateBlog = {
  title: 'Blog about Java6',
  author: 'Java6 Dude',
  url: 'https://oracle.com/6',
  likes: 1
}

const newBlogWithoutLikes = {
  title: 'Blog about...',
  author: 'The Dude',
  url: 'https://oracle.com'
}

const newInvalidBlog = {
  author: "Cromet Monster",
  likes: 0
 }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, newBlog, blogsInDb, newBlogWithoutLikes, newInvalidBlog, updateBlog }