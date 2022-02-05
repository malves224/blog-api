const express = require('express');
const bodyParser = require('body-parser');
const validateToekn = require('./auth/validateToken');
const { Users, Categories } = require('./controllers');

const app = express();

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.post('/user', Users.createUser);
app.post('/login', Users.loginUser);

app.use(validateToekn);

app.get('/user', Users.getUsers);
app.get('/user/:id', Users.getUser);
app.post('/categories', Categories.createCategorie);
app.get('/categories', Categories.getAllCategories);

app.listen(3000, () => console.log('  ouvindo porta 3000!'));
