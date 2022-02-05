const { PostsCategorie } = require('../models');

async function createPostCategorie(postId, categoriesIds) {
  const cadastreAllCategoriesPost = categoriesIds
    .map((categoryId) => PostsCategorie.create({ postId, categoryId }));

  await Promise.all(cadastreAllCategoriesPost);
}

module.exports = {
  createPostCategorie,
};