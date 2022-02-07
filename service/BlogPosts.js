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

async function getById(id) {
  const responsePost = await BlogPost.findOne({
    where: { id },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }, 
    { model: Categorie, as: 'categories', through: { attributes: [] } }],
  });
  if (!responsePost) {
    return { code: 404, message: 'Post does not exist' };
  }
  return responsePost;
}

async function validateDataPostUpdate({ title, content, categoryIds }) {
  if (!title) {
    return { message: '"title" is required' };
  }
  if (!content) {
    return { message: '"content" is required' };
  }
  if (categoryIds) {
    return { message: 'Categories cannot be edited' };
  }
  return {};
}

async function checkAuthorPost(idPost, idUser) {
  const responsePost = await BlogPost.findOne({ where: { id: idPost } });
  if (idUser !== responsePost.userId) {
    return { message: 'Unauthorized user' };
  }
  return {};
}

async function update(dataBody, idPost, idUser) {
  const dataBodyIsValid = await validateDataPostUpdate(dataBody);
  if (dataBodyIsValid.message) {
    return { code: 400, message: dataBodyIsValid.message };
  }

  const postBelongsToUser = await checkAuthorPost(idPost, idUser);
  if (postBelongsToUser.message) {
    return { code: 401, message: postBelongsToUser.message };
  }

  const { title, content } = dataBody;
  await BlogPost.update({ title, content }, { where: { id: idPost } });
  const postUpdated = await BlogPost.findOne(
    {
    where: { id: idPost },
    include: [{ model: Categorie, as: 'categories', through: { attributes: [] } }],
    attributes: { exclude: ['id', 'updated', 'published'] },
    },
  );
  return postUpdated;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
};