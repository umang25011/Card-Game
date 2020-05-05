'use strict'
var socket= io();
class Card {
    static types=["H","D","S","C"]
    static ranks=["2","3","4","5","6","7","8","9","10",'11','12','13','14']
    static dir={}
    static allCards = []
    constructor(rank,type)
    {
        this.rank=rank
        this.type=type
        this.card=document.createElement("DIV")
        this.link=`<img src="/cards/${rank}${type}.svg">`
        this.card.innerHTML=this.link
        this.card.id=rank+type
        Card.dir[rank+type]=this
    }
    //to get card
    hideCard() {
        this.card.innerHTML=`<img src="/cards/cardback.png">`
    }

    showCard() {
        this.card.innerHTML=this.link
    }

    //TO SHUFFLE CARDS...PASS THE CARDS TO SHUFFLE
    //DON'T GIVE ACCESS TO USER..OTHERWISE SOMEONE WILL SHUFFLE \
    //INBETWEEN THE GAME.
    static shuffle(cards) {
        let j,temp
        for( let i = cards.length-1 ; i > 0 ; i--)
        {
            j = Math.floor( Math.random() * i )
            temp = cards[j]
            cards[j] = cards[i]
            cards[i] = temp
        }
    }

    //IN WHICH DIV YOU WANT THE CARD.
    //table/hand/deck
    addCard(idToAdd) {
        let divNode=document.getElementById(idToAdd)
        divNode.appendChild(this.card)
        
    }

    static dealCards(allCards) {
            let index = Math.floor ( Math.random()* allCards.length)
            let card= allCards.splice(index,1)[0]
            card.addCard("hand")
            card.showCard()
    }

    static putCards() {
        let cardId=document.getElementById("cardPut").value 
        let card=Card.dir[cardId]
        card.addCard("table")
        socket.emit('cardChange',[card.id,'table'])
    }
    static startGame() {
        Card.getAllCards(Card.allCards)
        for(let card of Card.allCards) {
            card.hideCard()
            card.addCard("deck")
        }
    }
    static getAllCards(cards) {
        for (let type of Card.types) {
            for (let rank of Card.ranks) {
                cards.push(new Card(rank, type))
            }
        }
    }
}
//get all cards from server
socket.on('allCards',(data)=> {
    let createCards=data
})


let cardId=document.getElementById("cardPut").value 
let card=Card.dir[cardId]

socket.on('connection',()=> console.log('connected'))
{
    socket.on('cardChange',(data)=> {
        Card.putCards(Card.dir[data[0]].addCard(data[1]))
    }
    )
}

