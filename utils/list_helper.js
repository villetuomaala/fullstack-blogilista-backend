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

module.exports = { dummy, totalLikes, favoriteBlog }