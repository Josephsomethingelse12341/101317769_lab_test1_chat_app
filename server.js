var express = require("express")
var mongoose = require("mongoose")
var socket = require("socket.io")
const http = require('http').createServer(app)
const cors = require('cors')




var userModel = require("./models/Users")


var app = express()


app.use(express.json());
app.use(cors())
app.use(express.urlencoded())


var io = socket(server)


var PORT = 8088

var server = app.listen(PORT, () => {
    console.log("Socket Server running at 8088: http://localhost:8088/")
})

mongoose.connect('mongodb+srv://Josephadmin:7HYpxGTzZiOnEocy@cluster0.gsshbsu.mongodb.net/lab_test_1?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

//http://localhost:8088/
app.get("/", (req, res) => {
    res.sendFile( __dirname + "/login.html")
})



app.get('/register', async (req, res) => {
    res.sendFile(__dirname + '/register.html')
});

//http://localhost:8088/register
app.post('/register', async (req, res) => {
    console.log(req.body)
    const user = new userModel(req.body)
    const test = userModel.findOne({username: user.username})
    // validation in the schema works but i cant send a response if there happens to be a duplicate username,
    // of course it will not save whatever data there is if theres a duplicate username but the user wont know
    // that the username is already taken

    try {
        await user.save((err) => {
          if(err){
            return res.send(err)
          }else if(test == req.body.username){
            return res.send(JSON.stringify({status:false, message: "User already exist"}))
          }else{
            res.sendFile(__dirname + '/login.html')
          }
        });
      } catch (err) {
        res.status(500).send(err);
      }
      res.sendFile(__dirname + '/login.html')

});

app.get(['/', '/login'], async (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post('/login', async (req, res) => {
    const user = await userModel.findOne({username: req.body.username, password: req.body.password})
    console.log(user)
    try {
        if(user != null){
            res.cookie('username', user.username)
            res.sendFile(__dirname + "/chatroom.html")
        }else{
          res.send(JSON.stringify({status:false, message: "No user found"}))
        }
      } catch (err) {
        res.status(500).send(err);
      }
})





io.on('connection', (socket) => {
  console.log('Connection created....')
  //console.log(socket.id)
  //console.log(socket)

  //Send welcome message
  socket.emit('welcome', `Welcome to Chat. Your ID is ${socket.id}`)

  //New message from client
  socket.on('message', (data) => {
      //These will send to current client
      //socket.emit('newMessage', data)

      //These will send to all the client including sender
      const msg = {
          sender: socket.id,
          message: data
      }
     //io.sockets.emit('newMessage', msg)

     //These will send to all the client except sender
     socket.broadcast.emit('newMessage', msg)
  })

  //Join New room
  socket.on('join', (roomName) => {
      socket.join(roomName)
      //Send all client 
      const msg = {
          sender: socket.id,
          message: 'Joined the room successfully'
      }
      io.sockets.emit('newMessage', msg)
  })

  socket.on('room_message', (data) => {
      //console.log(data)
      const msg = {
          sender: socket.id,
          message: data.message
      }
      //Direct message/1-to-1 message using socket ID
      //socket.broadcast.to('socketidtosend').emit('message', msg)
      //io.to('socketidtosend').emit('message', msg)

      //To all client in room
      socket.broadcast.to(data.room).emit('newMessage', msg)
  })

  //Dicsonected
  socket.on('disconnect', () => {
      console.log(`${socket.id} Client Disconnected...`)
  })
})


















