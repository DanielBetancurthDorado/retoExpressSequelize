const express = require("express");
const router = express.Router();
const ws = require("../wslib");
const Joi = require("joi");
const fs = require("fs");

const Mensaje = require("../models/mensajes");
const { response } = require("express");
express().listen(300, () => console.log("Listening on port 3000"));
express().use(express.json());

const validateMensaje = (mensaje) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
      .required(),
  });
  return schema.validate(mensaje);
};

router.get("/chat/api/messages", function (req, res, next) {
  //Conectarme a la BD
  //traer todos los mensajes
  Mensaje.findAll().then((result) => {
    //enviar la respuesta
    res.send(result);
  });
});

router.get("/chat/api/messages/:id", function (req, res, next) {
  Mensaje.findByPk(req.params.id).then((response) => {
    console.log(response);
    if (response === null)
      return res
        .status("404")
        .send("The message qith the given id was not found");
    res.send(response);
  });
});

router.post("/chat/api/messages", function (req, res) {
  const { error } = validateMensaje(req.body);
  if (error) {
    console.log(error);
    return res.status(412).send(error);
  } else {
    Mensaje.create({
      message: req.body.message,
      author: req.body.author,
      ts: new Date().getTime(),
    }).then((response) => {
      console.log(response);
      res.send(response);
    });
  }
  ws.sendMessages();
});

router.put("/chat/api/messages/:id", (req, res) => {
  const { error } = validateMensaje(req.body);
  if (error) {
    console.log(error);
    return res.status(412).send(error);
  } else {
    Mensaje.update(req.body, { where: { id: req.params.id } }).then(
      (response) => {
        console.log(response);
        if (response[0] !== 0) res.send({ message: "Mensaje actualizado" });
        else
          return res.status(400).send("We can not update the message you want");
      }
    );
  }
  ws.sendMessages();
});

router.delete("/chat/api/messages/:id", (req, res) => {
  Mensaje.destroy({ where: { id: req.params.id } }).then((response) => {
    console.log(response);
    if (response === 0)
      return res.status(400).send("We can not delete the message you want");
    else res.send({ message: "Mensaje eliminado" });
  });
  ws.sendMessages();
});

router;
module.exports = router;
