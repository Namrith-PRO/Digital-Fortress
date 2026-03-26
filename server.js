const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

let clients = {};

wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substr(2, 9);
  clients[id] = ws;

  ws.send(JSON.stringify({ type: "id", id }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.target && clients[data.target]) {
      clients[data.target].send(JSON.stringify({
        ...data,
        sender: id
      }));
    }
  });

  ws.on("close", () => {
    delete clients[id];
  });
});

console.log("Server running on port 3000");