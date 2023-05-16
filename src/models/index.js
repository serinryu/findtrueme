import Sequelize from "sequelize";
import User from "./user.js";
import Post from "./post.js";
import Hashtag from "./hashtag.js";
import Comment from "./comment.js";
import Image from "./image.js";
import Config from "../config/config.js";

const env = process.env.NODE_ENV || 'development';
const config = Config[env];
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User(sequelize, Sequelize);
db.Post = Post(sequelize, Sequelize);
db.Hashtag = Hashtag(sequelize, Sequelize);
db.Comment = Comment(sequelize, Sequelize);
db.Image = Image(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

export default db;