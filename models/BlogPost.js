module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('User', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return BlogPost;
};