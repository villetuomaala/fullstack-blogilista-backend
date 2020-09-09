const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.length === 0 
  ? 0 
  : blogs.map(b => {
    return b.likes ? b.likes : 0
  }).reduce((total, val) => total + val)


module.exports = { dummy, totalLikes }