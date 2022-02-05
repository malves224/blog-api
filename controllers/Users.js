const { create, login } = require('../service/Users');

const createUser = async (req, res) => {
  const response = await create(req.body);
  if (response.message) {
    return res.status(response.code).json({ message: response.message });
  }
  res.status(201).json({ token: response.token });
};

const loginUser = async (req, res) => {
  const response = await login(req.body);
  if (response.message) {
    return res.status(response.code).json({ message: response.message });
  }
  res.status(200).json({ token: response.token });
};

module.exports = {
  createUser,
  loginUser,
};