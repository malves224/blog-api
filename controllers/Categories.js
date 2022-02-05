const { create } = require('../service/Categories');

const createCategorie = async (req, res) => {
  const responseCreate = await create(req.body);
  console.log(req.body.name);
  if (responseCreate.message) {
    return res.status(responseCreate.code).json({ message: responseCreate.message });
  }
  return res.status(201).json(responseCreate);
};

module.exports = {
  createCategorie,
};