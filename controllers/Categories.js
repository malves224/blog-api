const { create, getAll } = require('../service/Categories');

const createCategorie = async (req, res) => {
  const responseCreate = await create(req.body);
  console.log(req.body.name);
  if (responseCreate.message) {
    return res.status(responseCreate.code).json({ message: responseCreate.message });
  }
  return res.status(201).json(responseCreate);
};

const getAllCategories = async (req, res) => {
  const responseCategories = await getAll();
  if (responseCategories.message) {
    return res.status(responseCategories.code).json({ message: responseCategories.message });
  }
  return res.status(200).json(responseCategories);
};

module.exports = {
  createCategorie,
  getAllCategories,
};