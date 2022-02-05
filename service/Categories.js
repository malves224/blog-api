const { Categorie } = require('../models');

function validateDataName(name) {
  if (!name) {
    return { message: '"name" is required' };
  }
  return {};
}

async function validExistCategorie(categoryId) {
  const responseCategorie = await Categorie
    .findOne({ where: { id: categoryId } });
    if (!responseCategorie) {
      return { code: 400, message: '"categoryIds" not found' };
    }
    return {};
}

async function create({ name }) {
  const nameIsValid = validateDataName(name);
  if (nameIsValid.message) {
    return { code: 400, message: nameIsValid.message };
  }
  try {
    const responseCreate = await Categorie.create({ name });
    return responseCreate;
  } catch (error) {
    return { code: 500, message: error.message };
  }
}

async function getAll() {
  try {
    const responseCategories = await Categorie.findAll();
    return responseCategories;
  } catch (error) {
    return { code: 500, message: error.message };
  }
}

module.exports = {
  create,
  getAll,
  validExistCategorie,
};