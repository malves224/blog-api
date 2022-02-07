const express = require('express');
const bodyParser = require('body-parser');
const validateToekn = require('./auth/validateToken');
const { Users, Categories, BlogPost } = require('./controllers');

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
app.delete('/user/me', Users.deleteUser);
app.post('/categories', Categories.createCategorie);
app.get('/categories', Categories.getAllCategories);
app.post('/post', BlogPost.createPost);
app.get('/post', BlogPost.getAllPost);
app.get('/post/:id', BlogPost.getPostById);
app.put('/post/:id', BlogPost.updatePost);
app.delete('/post/:id', BlogPost.deletePost);

app.listen(3000, () => console.log('  ouvindo porta 3000!'));
