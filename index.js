const TelegrambotApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')

const token = `6779182680:AAED_owvclmtEiCWSuk7jTaMws6vd-93ajs`


const bot = new TelegrambotApi(token, {polling:true})

bot.setMyCommands([
    {command:'/start', description:"Greeting with visitors"},
    {command:'/info', description:"Info about bot"},
    {command:'/game', description:"Start game"}
])

const chats={}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Now i make a wish one number from 0 to 9, and you should guess right this number.')

    const randomNumber = Math.floor(Math.random() * 10)

    chats[chatId] = randomNumber;

    return bot.sendMessage(chatId,'Guess number', gameOptions)
}



const start = ( ) =>{
    bot.setMyCommands([
        {command:'/start', description:"Greeting with visitors"},
        {command:'/info', description:"Info about bot"}
    ])

    bot.on('message',async msg =>{
        const text = msg.text
        const chatId = msg.chat.id;

        if(text === '/start'){
            await bot.sendSticker(chatId,'https://tlgrm.eu/_/stickers/8dc/431/8dc43104-5d6c-3f40-abb0-90e09b7575b6/1.webp')
            return bot.sendMessage(chatId, `Welcome to bot in telegram author of this bot is Alex`)
        }

        if(text === '/info'){
            const lastname = msg.from.last_name ? msg.from.last_name : ''
            return  bot.sendMessage(chatId, `Your name ${msg.from.first_name} ${lastname}`)
        }
        if(text === '/game') {
           return startGame(chatId)
        }

       return bot.sendMessage(chatId,`I don't understand you}`)

    })

    bot.on('callback_query', msg=>{
        const data = msg.data
        const chatId=msg.message.chat.id

        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return bot.sendMessage(chatId,`Congratulations, you guessed right number ${chats[chatId]} `, againOptions)
        } else {
            return bot.sendMessage(chatId,`Unfortunately you didn't guess number ${chats[chatId]}`, againOptions)
        }
    })
}

start()