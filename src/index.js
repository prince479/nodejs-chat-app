//create a express web server
const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words') 

// UTILS FUNCTION
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,getUser,userList,removeUser} = require('./utils/users')

const app = express()
const server = http.createServer(app)

const io = socketio(server)
let message = ''
io.on('connection',(socket)=>{
    socket.on('join',(options,ack)=>{
        const {error,user} = addUser({id:socket.id,...options})
        if(error){
            return ack(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome to the chat room'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username}`, ` is Online`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:userList(user.room)
        })
        ack()
    })
    socket.on('sendMessage',(usermsg,ack)=>{
        const user = getUser(socket.id)
        const filter  = new Filter()
        if(filter.isProfane(usermsg)){
            return ack('Profanity is Not Allowed')
        }
        //socket.broadcast.emit('message',usermsg) ack= Acknowledgement
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username,usermsg))
        ack()
    })
    socket.on('sendLocation',(data,ack)=>{
        const user = getUser(socket.id)
        if(user)
        socket.broadcast.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${data.latitude},${data.longitude}`))
        ack()
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('message',generateMessage(`${user.username}`,` has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:userList(user.room)
            })
            
        }
        
    })
})  

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

server.listen(80,'localhost',()=>{
    console.log(" express server starts serving requests")
})

// socket.on('clicked',()=>{
    //     
    // })
    // socket.on('clicked',()=>{
    //     count++;
    //     io.emit('user-joined',count)
    // })

    //console.log(username,room)
        // socket.emit io.emit ,socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit