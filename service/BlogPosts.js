const { Op } = require('sequelize');
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
  if (!responsePost) {
    return { code: 404, message: 'Post does not exist' };
  }
  if (idUser !== responsePost.userId) {
    return { code: 401, message: 'Unauthorized user' };
  }
  return {};
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

async function deletePost(idPost, idUser) {
  const userIsOwnerPost = await checkAuthorPost(idPost, idUser);
  if (userIsOwnerPost.message) {
    return { code: userIsOwnerPost.code, message: userIsOwnerPost.message };
  }

  try {
    await BlogPost.destroy({ where: { id: idPost } });
    return {};
  } catch (error) {
    console.log(error.message);
  }
}
async function searchPost(searchTerm = '') {
  if (!searchTerm) {
    const allPost = await getAll();
    return allPost;
  }
  const responseSearch = await BlogPost.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `${searchTerm}%` } },
        { content: { [Op.like]: `${searchTerm}%` } },
      ],
    },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }, 
    { model: Categorie, as: 'categories', through: { attributes: [] } }],
  });
  return responseSearch;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deletePost,
  searchPost,
};