// server.js
const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.urlencoded());
app.post("/api", (req, res) => {
  const data = req.body;
  
  // 클라이언트에게 데이터 전송
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

  res.send("API called");
});

wss.on("connection", ws => {
  console.log("Client connected");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});


// 정적 파일 서빙을 위한 디렉토리 설정
app.use(express.static(path.join(__dirname, 'front')));
// 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'index.html'));
});



