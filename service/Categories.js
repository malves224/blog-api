const { Categorie } = require('../models');

function validateDataName(name) {
  if (!name) {
    return { message: '"name" is required' };
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

module.exports = {
  create,
};