const { create, login, getAllUsers, getUserById } = require('../service/Users');

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

const getUser = async (req, res) => {
  const { id } = req.params;
  const userResponse = await getUserById(id);
  if (userResponse.message) {
    return res.status(userResponse.code).json({ message: userResponse.message });
  }
  return res.status(200).json(userResponse);
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUser,
};