const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const handler = (req, res) => {
  fs.readFile(`${__dirname}/index.html`, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);
const io = socketio(app);

let playerOneScore = 0;
let playerTwoScore = 0;

io.on('connection', (socket) => {

  const broadcastScore = () => {
    io.emit('score', { 
      playerOne: playerOneScore, 
      playerTwo: playerTwoScore,
    });
  };

  broadcastScore();

  socket.on('tug', (data) => {
    const team = data.team;

    if (team === '1') {
      playerOneScore += 1;
    } else if (team === '2') {
      playerTwoScore += 1;
    };

    broadcastScore();
  });

  socket.on('reset', () => {
    playerOneScore = 0;
    playerTwoScore = 0;

    broadcastScore();
  });
});

app.listen(8181);