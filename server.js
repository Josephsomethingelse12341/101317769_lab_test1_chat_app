var express = require("express")
var mongoose = require("mongoose")
var socket = require("socket.io")

var userModel = require("./models/Users")


var app = express()

app.use(express.json());

var PORT = 8088

var server = app.listen(PORT, () => {
    console.log("Socket Server running at 8088: http://localhost:8088/")
})

//http://localhost:8088/
app.get("/", (req, res) => {
    res.sendFile( __dirname + "/login.html")
})

var io = socket(server)

io.on("connection", (client) => {
    console.log("Client Connection request")
    console.log(client.id)

    client.emit("welcome", "Welcome to Socket.io Chat Server")

    client.on("hello", (data) => {
        console.log(data)

        const notice = {
            status: false,
            message: "Message to all"
        }
        
        client.broadcast.emit("notice", notice)
    })

   
    client.on("disconnect", () => {
        console.log(`Client disconnected : ${client.id}`)
    })
})

mongoose.connect('mongodb+srv://Josephadmin:7HYpxGTzZiOnEocy@cluster0.gsshbsu.mongodb.net/lab_test_1?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.get('/register', async (req, res) => {
    res.sendFile(__dirname + '/register.html')
});

app.post('/register', async (req, res) => {
    console.log(req.body)
    const user = new userModel(req.body)

    try {
        await user.save((err) => {
          if(err){
            res.send(err)
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
















