const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.length === 0 
  ? 0 
  : blogs.map(b => {
    return b.likes ? b.likes : 0
  }).reduce((total, val) => total + val)

const favoriteBlog = (blogs) => {
  if (blogs === undefined || blogs.length === 0 ) return null
  return blogs.reduce((prev, current) => current.likes > prev.likes ? current : prev)
}

const mostBlogs = (blogs) => {
  const author = _.chain(blogs.map(b => b.author)).countBy().toPairs().max(_.last).head().value()
  const authorBlogs = blogs.map(b => b.author).filter((a) => a === author).length

  return { author: author, blogs: authorBlogs }
}

  


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }