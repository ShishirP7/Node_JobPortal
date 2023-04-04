const io = require('socket.io')(8000, {
    cors: {
        origin: "http://localhost:3000"
    }
})
let activeUsers = []
io.on("connection", (socket) => {

    socket.on('new-user-add', (newUserId) => {
        if (activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log("Connecter User", activeUsers)
        io.emit('get-users', activeUsers)

    })
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        console.log("User Disconnected", activeUsers)
        io.emit('get-users', activeUsers)
    })

})
