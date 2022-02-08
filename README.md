# Blogs API
Esse é um projeto de uma  API CRUD para ‘blogs’ onde é possível criar usuário e autenticar, criar publicações com categorias, pesquisar publicações, e deletar essas entidades todas essas ações (requer) autenticação do usuário.

## Descrição técnica
Foi utilizado Node.js com express para a construção dos 'endpoints', e para a autenticação json web token (JWT).
A relação da aplicação com o banco de dados é feita através de um ORM o Sequelize.
O Projeto segue padrão de arquitetura MSC e rest .

## Endpoints
 

 1. ### POST `/user`
O endpoint consegue adicionar um novo usuário do sistema, Formato esperado do corpo na requisição:
```
{
  "displayName": "Brett Wiltshire",
  "email": "brett@email.com",
  "password": "123456",
  "image": "LinkDaImagem@host.com"
}
```
Só é possível criar usuários únicos e com todos os campos preenchido, caso esteja tudo certo o endpoint retorna o código 201 com o token em seu corpo de resposta, que será utilizado para a autenticação do usuário.

 2. ### POST  `/login`
 Para autenticar um usuário já existente no sistema, É preciso passar no corpo da requisição o e-mail e senha com o formato a seguir :
```
{
  "email": "email@mail.com",
  "password": "123456"
}
```
Caso o usuário exista e a senha esteja correta o endpoint retorna o código 200 com o token em seu corpo de resposta.

 3. ### GET `/user`
Retorna todos os usuários do sistema com o código 200, a requisição deve ter o token de autenticação nos headers.

 4. ### GET `/user/:id`
Retorna os detalhes do usuário baseado no id da rota, a requisição deve ter o token de autenticação nos headers.

 5. ### POST `/categories`
 O endpoit consegue adicionar uma nova categoria a requisição deve ter o token de autenticação nos headers, Formato esperado do corpo na requisição: 

```
 {
   "name": "Inovação"
 }
```

caso esteja tudo certo o endpoint retorna o código 200 com a categoria cadastrada em seu corpo de resposta.

 6. ### GET `/categories`
 Retorna todas categorias cadastradas, a requisição deve ter o token de autenticação nos headers.
 
 7. ### POST `/post`
 O endpoint consegue adicionar um novo post e esse post irá pertencer ao usuário que esta autenticado no momento da requisição, Formato esperado do corpo na requisição:
```
{
  "title": "Latest updates, August 1st",
  "content": "The whole text for the blog post goes here in this key",
  "categoryIds": [1, 2]
}
```
Caso esteja tudo certo o endpoint retorna o código 201 e os detalhes do post que foi criado, a requisição deve ter o token de autenticação nos headers.

8. ### GET `/post`
Esse endpoint lista todos os post com todos detalhes de cada post, exemplo de resposta:
```
[
  {
    "id": 1,
    "title": "Post do Ano",
    "content": "Melhor post do ano",
    "userId": 1,
    "published": "2011-08-01T19:58:00.000Z",
    "updated": "2011-08-01T19:58:51.000Z",
    "user": {
      "id": 1,
      "displayName": "Lewis Hamilton",
      "email": "lewishamilton@gmail.com",
      "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2017_Malaysia.jpg"
    },
    "categories": [
      {
        "id": 1,
        "name": "Inovação"
      }
    ]
  }
]
```
A requisição deve ter o token de autenticação nos headers.

9.  ### GET `/post/:id`
Retorna os detalhes de um post baseado no id da rota, a requisição deve ter o token de autenticação nos headers.

10. ### PUT `/post/:id`
Com esse endpoint é possível editar o titulo ou o conteudo de um post existente baseado no id da rota o usuario só pode editar posts que são de sua autoria, Formato do corpo de requisição.
```
{
  "title": "Latest updates, August 1st",
  "content": "The whole text for the blog post goes here in this key"
}
```
A requisição deve ter o token de autenticação nos headers.

11. ### DELETE `post/:id`
O endpoint deleta um post baseado no id da rota, o usuário só pode deletar post que seja de sua autoria, A requisição deve ter o token de autenticação nos headers.

12. ### DELETE `/user/me`
O endpoint deleta o usuário do sistema que esta autenticado, A requisição deve ter o token de autenticação nos headers.

13. ### GET `/post/search?q=:searchTerm`
O endpoint retorna uma lista de posts de acordo com o termo de pesquisa passado pela rota, A requisição deve ter o token de autenticação nos headers.
