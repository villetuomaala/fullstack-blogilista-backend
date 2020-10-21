const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'admin',
    password: 'adminmaster2000',
    name: 'The true admin'
  },
  {
    username: 'root',
    password: 'root2000',
    name: 'The root user'
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

const usersInBd = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { 
  initialBlogs, 
  newBlog, 
  blogsInDb, 
  newBlogWithoutLikes, 
  newInvalidBlog, 
  updateBlog, 
  initialUsers, 
  usersInBd 
}