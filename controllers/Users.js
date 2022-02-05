const { create } = require('../service/Users');

const createUser = async (req, res) => {
  const response = await create(req.body);
  if (response.message) {
    return res.status(response.code).json({ message: response.message });
  }
  res.status(201).json({ token: response.token });
};

module.exports = {
  createUser,
};