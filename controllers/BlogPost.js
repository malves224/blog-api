const BlogPosts = require('../service/BlogPosts');

const createPost = async (req, res) => {
  const { userAuthenticated } = req;
  const responseCreatePost = await BlogPosts.create(req.body, userAuthenticated.id);
  if (responseCreatePost.message) {
    return res.status(responseCreatePost.code)
      .json({ message: responseCreatePost.message });
  }

  return res.status(201).json(responseCreatePost);
};

module.exports = {
  createPost,
};