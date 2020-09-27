const WebSocket = require("ws");
const fs = require("fs");
const clients = [];
const Mensaje = require("./models/mensajes");
const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    ws.on("message", async (objeto) => {
      //leo el archivo y lo pongo en array
      let info = JSON.parse(objeto);
      const mensajeEnDB = await Mensaje.create({
        message: info.mensaje,
        author: info.autor,
        ts: info.tiempo,
      });
      sendMessages();
    });
  });
};
//clients no tocar
//modificar messages
const sendMessages = () => {
  Mensaje.findAll().then((result) => {
    let messages = [];
    console.log("Result " + result);
    result.forEach((element) => {
      messages.push(element.message);
    });
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
