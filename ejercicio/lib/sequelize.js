const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("database", "", "", {
  dialect: "sqlite",
  storage: "./database/database.sqlite",
}); //Conexion

//autenticar, uso de promesas
sequelize
  .authenticate()
  .then((res) => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports=sequelize;