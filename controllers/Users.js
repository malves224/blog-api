const { create, login, getAllUsers } = require('../service/Users');

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

const getUsers = async (req, res) => {
  const response = await getAllUsers();
  res.status(200).json(response);
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
};