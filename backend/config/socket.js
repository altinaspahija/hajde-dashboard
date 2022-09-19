const io = require("socket.io");

var instance = null;

function initSocket(server) {
    instance = io(server, {
      cors: {
        origin: '*',
      }
    });
}

function getInstance() {
  return instance;
}

module.exports = {
    initSocket,
    getInstance
}