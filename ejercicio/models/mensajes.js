const { allow } = require("joi");
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../lib/sequelize")
class Mensaje extends Model {}
Mensaje.init({
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ts:{
      type: DataTypes.FLOAT,
      allowNull:false,
  }
}, {
    sequelize, //Conexion
    modelName: "Mensaje"
});
//Sincronizar modelo con la base de datos cada vez que yo llamo a init
Mensaje.sync();

module.exports=Mensaje;