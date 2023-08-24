const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const cors = require('cors');
// Allow requests from a specific local IP
const corsOptions = {
    origin: 'http://10.0.8.51:3000', // Replace with your local IP
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));

// Serve static files from the 'public' folder
app.use(express.static(__dirname + '/public'));

const clients = {};

app.use("/user",(req,res)=>{
    const filePath = __dirname + '/public/user.html';
    res.sendFile(filePath);
});

app.use("/display",(req,res)=>{
    const filePath = __dirname + '/public/display.html';
    res.sendFile(filePath);
});
io.on('connection', socket => {
  console.log('User connected:', socket.id);

/*   socket.on('register', userId => {
     clients[userId] = socket; 
    console.log(`User ${userId} registered`);
  }); */

  socket.on('offer', data => {
    console.log("data from offer", data);
/*     const targetSocket = clients[data.targetUserId];
    if (targetSocket) {
      targetSocket.emit('offer', data.offer);
    } */
    socket.broadcast.emit("offer", data);
  });

  socket.on('answer', data => {
/*     const targetSocket = clients[data.targetUserId];
    if (targetSocket) {
      targetSocket.emit('answer', data.answer);
    } */
    console.log("recived answer",data)
    socket.broadcast.emit("answer", data);
  });

  socket.on('ice-candidate', data => {
/*     const targetSocket = clients[data.targetUserId];
    if (targetSocket) {
      targetSocket.emit('ice-candidate', data.candidate);
    } */
    console.log("recieved ice candedate----- sending it-----------------------",data);
    socket.broadcast.emit("ice-candidate",data)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove the disconnected user from the clients object
/*     Object.keys(clients).forEach(userId => {
      if (clients[userId] === socket) {
        delete clients[userId];
        console.log(`User ${userId} removed`);
      }
    }); */
  });
});

server.listen(3000, () => {
  console.log('Signaling server is running on port 3000');
});
