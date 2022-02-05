const { BlogPost, User, Categorie } = require('../models');
const { validExistCategorie } = require('./Categories');
const { createPostCategorie } = require('./PostCategorie');

function validDataPost({ title, content, categoryIds }) {
  if (!title) {
    return { message: '"title" is required' };
  }
  if (!content) {
    return { message: '"content" is required' };
  }
  if (!categoryIds) {
    return { message: '"categoryIds" is required' };
  }
  return {};
}

async function verifyIfAllCategoriesExist(categoriesIds) {
  const verifyAllCategorie = categoriesIds
  .map((categorieId) => validExistCategorie(categorieId));

  const allResponseList = await Promise.all(verifyAllCategorie)
    .then((responseList) => responseList);
  return !allResponseList.some((response) => response.message); // se tem message, é pq alguma categoria nao existe
}

async function create(post, userId) {
  const dataPostIsValid = validDataPost(post);
  if (dataPostIsValid.message) {
    return { code: 400, message: dataPostIsValid.message };
  }

  const allIdCategorieExist = await verifyIfAllCategoriesExist(post.categoryIds);
  if (!allIdCategorieExist) {
    return { code: 400, message: '"categoryIds" not found' };
  }

  const { title, content, categoryIds } = post;

  const responseCreatePost = await BlogPost.create({ title, content, userId });

   await createPostCategorie(responseCreatePost.id, categoryIds);
   return responseCreatePost;
}

async function getAll() {
  const responseAllPost = await BlogPost.findAll({
    include: [{ model: User, as: 'user' }, 
    { model: Categorie, as: 'categories', through: { attributes: [] } }],
  });
  return responseAllPost;
}

module.exports = {
  create,
  getAll,
};