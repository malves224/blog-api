const express = require('express');
const bodyParser = require('body-parser');
const validateToekn = require('./auth/validateToken');
const Users = require('./controllers/Users');

const app = express();

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.post('/user', Users.createUser);
app.post('/login', Users.loginUser);

app.get('/user', validateToekn, Users.getUsers);

app.listen(3000, () => console.log('  ouvindo porta 3000!'));
