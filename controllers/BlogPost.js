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

const getAllPost = async (_req, res) => {
  const responsePosts = await BlogPosts.getAll();
  return res.status(200).json(responsePosts);
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const responseGetById = await BlogPosts.getById(id);
  if (responseGetById.message) {
    return res.status(responseGetById.code)
      .json({ message: responseGetById.message });
  }

  return res.status(200).json(responseGetById);
};

module.exports = {
  createPost,
  getAllPost,
  getPostById,
};