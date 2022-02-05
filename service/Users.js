require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const secret = process.env.JWT_SECRET;

function validFormatEmail(email) {
  const regex = new RegExp(/^([\w-]+\.)*[\w\- ]+@([\w\- ]+\.)+([\w-]{2,3})$/); // fonte dessa expresão https://www.devmedia.com.br/iniciando-expressoes-regulares/6557
  return regex.test(email);
}

function validEmail(email) {
  if (email === '') {
    return { message: '"email" is not allowed to be empty' };
  }
  if (!email) {
    return { message: '"email" is required' }; 
  }
  if (!validFormatEmail(email)) {
    return { message: '"email" must be a valid email' };
  }
  return {};
}

function validPassword(password) {
  if (password === '') {
    return { message: '"password" is not allowed to be empty' };
  }
  if (!password) {
    return { message: '"password" is required' }; 
  }
  if (password.length < 6) {
    return { message: '"password" length must be 6 characters long' };
  }
  return {};
}

function generateToken(data) {
  const jwtConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };
  const token = jwt.sign(data, secret, jwtConfig);
  return token;
}

async function verifyIfExist(email) {
  const responseUser = await User.findOne({ where: { email } });
    if (!responseUser) {
      return {};
   } 
  return { message: 'User already registered', code: 409 };
}

async function verifyLogin({ email, password }) {
  const responseUser = await User.findOne({ where: { email } });
  if (!responseUser) {
    return { message: 'Invalid fields', code: 400 };
 }
 const { email: emailToVerify, password: passwordToVerify, id } = responseUser;
 if (email === emailToVerify && password === passwordToVerify) {
  const token = generateToken({ id, email: emailToVerify });
  return { token };
 }
 return { message: 'Invalid fields', code: 400 };
}

function validDataUser({ displayName, email, password }) {
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

function validDataLogin({ email, password }) {
  const emailIsValid = validEmail(email);
  if (emailIsValid.message) {
    return { code: 400, message: emailIsValid.message };
  }
  const passwordIsValid = validPassword(password);
  if (passwordIsValid.message) {
    return { code: 400, message: passwordIsValid.message };
  }
  return {};
}

async function login({ email, password }) {
  const dataLoginIsValid = validDataLogin({ email, password });
  if (dataLoginIsValid.message) {
    return { code: dataLoginIsValid.code, message: dataLoginIsValid.message };
  }

  const loginIsCorrect = await verifyLogin({ email, password });
  if (loginIsCorrect.message) {
    return { code: loginIsCorrect.code, message: loginIsCorrect.message };
  }

  return { token: loginIsCorrect.token };
}

async function create(user) {
  const userIsValid = validDataUser(user);
  if (userIsValid.message) {
    return { code: userIsValid.code, message: userIsValid.message };
  }

  const userAlreadyExist = await verifyIfExist(user.email);
  if (userAlreadyExist.message) {
    return { code: userAlreadyExist.code, message: userAlreadyExist.message };
  }

  const { displayName, email, password, image } = user;
  await User.create({ displayName, email, password, image });
  const loginIsCorrect = await verifyLogin({ email, password });
  return {
    token: loginIsCorrect.token,
  };
}

module.exports = {
   create,
   login,
};