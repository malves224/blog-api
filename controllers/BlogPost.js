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

const updatePost = async (req, res) => {
  const { id: idUser } = req.userAuthenticated;
  const { id: idPost } = req.params;
  const responseUpdatePost = await BlogPosts.update(req.body, idPost, idUser);
  
  if (responseUpdatePost.message) {
    return res.status(responseUpdatePost.code)
      .json({ message: responseUpdatePost.message });
  }

  return res.status(200).json(responseUpdatePost);
};

const deletePost = async (req, res) => {
  const { id: idPost } = req.params;
  const { id: idUser } = req.userAuthenticated;

  const responseDelete = await BlogPosts.deletePost(idPost, idUser);

  if (responseDelete.message) {
    return res.status(responseDelete.code)
      .json({ message: responseDelete.message });
  }

  return res.status(204).end();
};

const searchPost = async (req, res) => {
  const { q: searchTerm } = req.query;
  const responseSearch = await BlogPosts.searchPost(searchTerm);
  res.status(200).json(responseSearch);
};

module.exports = {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
  searchPost,
};