const express = require('express')

const app = express()

const path = require('path')

// Socketio setup

const http = require('http')

const socketio = require('socket.io')

const server = http.createServer(app)

const io = socketio(server)

// ejs and public setup

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

// receive and send location to frontend
io.on('connection', function(socket){
    socket.on('send-location', function(data){
        io.emit('receive-location', { id: socket.id, ...data})
    })
    
    socket.on('disconnect', function(){
        io.emit('user-disconnected', socket.id)
    })
})

//route
app.get('/', function (req, res) {
    res.render('index');
});

server.listen(3001, () => {
    console.log('Server is running on port 3000');
});