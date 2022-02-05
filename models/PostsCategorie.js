module.exports = (sequelize, DataTypes) => {
  const PostsCategorie = sequelize.define('PostsCategorie',
    { postId: DataTypes.INTEGER, categoryId: DataTypes.INTEGER },
    { timestamps: false });

  PostsCategorie.associate = (models) => {
    models.Categorie.belongsToMany(models.BlogPost, {
      through: PostsCategorie,
      foreignKey: 'categoryId',
      as: 'posts',
      otherKey: 'postId',
    });
    models.BlogPost.belongsToMany(models.Categorie, {
      through: PostsCategorie,
      as: 'categories',
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
  };

  return PostsCategorie;
};