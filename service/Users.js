require('dotenv').config();
const { User } = require('../models');

function validFormatEmail(email) {
  const regex = new RegExp(/^([\w-]+\.)*[\w\- ]+@([\w\- ]+\.)+([\w-]{2,3})$/); // fonte dessa expresão https://www.devmedia.com.br/iniciando-expressoes-regulares/6557
  return regex.test(email);
}

function validEmail(email) {
  if (!email) {
    return { message: '"email" is required' }; 
  }
  if (!validFormatEmail(email)) {
    return { message: '"email" must be a valid email' };
  }
  return {};
}

function validPassword(password) {
  if (!password) {
    return { message: '"password" is required' }; 
  }
  if (password.length < 6) {
    return { message: '"password" length must be 6 characters long' };
  }
  return {};
}

async function verifyIfExist(email) {
  const responseUser = await User.findOne({ where: { email } });
    if (!responseUser) {
      return {};
   } 
  return { message: 'User already registered', code: 409 };
}

function validUser({ displayName, email, password }) {
  if (!displayName || displayName.length < 8) {
  return { 
      message: '"displayName" length must be at least 8 characters long',
      code: 400 };
  }
  const emailIsValid = validEmail(email);
  if (emailIsValid.message) {
    return { message: emailIsValid.message, code: 400 };
  }
  const passwordIsValid = validPassword(password);
  if (passwordIsValid.message) {
    return { message: passwordIsValid.message, code: 400 };
  }
  return {};
}

function login({ _email, _password }) {
  // verifica se o password e email ta correto
  // se sim retorna o token
  return { token: 'token muito doido' };
}

async function create(user) {
  const userIsValid = validUser(user);
  if (userIsValid.message) {
    return { code: userIsValid.code, message: userIsValid.message };
  }

  const userAlreadyExist = await verifyIfExist(user.email);
  if (userAlreadyExist.message) {
    return { code: userAlreadyExist.code, message: userAlreadyExist.message };
  }

  const { displayName, email, password, image } = user;
  await User.create({ displayName, email, password, image });
  const token = login({ email, password }); // async
  return {
    token,
  };
}

module.exports = {
   create,
};