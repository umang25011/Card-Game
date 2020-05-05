var express = require('express')
var app = express()
var http = require('http').createServer(app)
var path = require('path')
var io = require('socket.io')(http)

var htmlPath=path.join(__dirname,"game")
app.use(express.urlencoded({extended:true}))
app.use(require('cookie-parser')())
app.get('/msg',(req,res)=> {
    res.sendFile(`${htmlPath}/message.html`)
});

io.on('connection',(socket)=> {
    socket.on('cardChange',(msg)=> {
        console.log('message : ' + msg)
        socket.broadcast.emit('cardChange',msg)
    })
})

app.use('/',express.static(htmlPath))

app.get('/login',(req,res)=> {
    res.sendFile(`${htmlPath}/login.html`); 
} )
app.post('/login',(req,res)=> {
    let username=req.body.username
    let room = req.body.room
    res.cookie('username',username)
    res.cookie('room',room)
    res.redirect('/')
})
http.listen(5000,()=> console.log("_____Server Started on 5000____"))

//Extra code for helping
function getAllCards() {
    const types = ["H", "D", "S", "C"]
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", '11', '12', '13', '14']
    let allCards = []
    for (let type of types) {
        for (let rank of ranks) {
            allCards.push([type, rank])
        }
    }
    //shuffle cards 8 times
    for(let count=0;count<8;count++) {
        let j,temp
        for( let i = allCards.length-1 ; i > 0 ; i--)
        {
            j = Math.floor( Math.random() * i )
            temp = allCards[j]
            allCards[j] = allCards[i]
            allCards[i] = temp
        }
    }
    return allCards
}

