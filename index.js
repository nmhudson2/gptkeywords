const express = require("express");
require("dotenv").config();
const{ Configuration, OpenAIApi } = require('openai');

let inText = "The new Toyota Tundra is great, with 21 in tires and more. Read on to see more about the 2023 toyota tundra!"
let keyCount = 5

const app = express();

app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

const openai = new OpenAIApi(configuration)
app.post("/request", async(req,res)=>{
    try{
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages:[
                {"role":"user", "content": `Return an array of the most important words in ${inText}.`}
            ],
            max_tokens: 500,
            temperature: 0,
            top_p: 0,
            frequency_penalty:0.0,
            presence_penalty: 0.0,
            stop:['\n'],
        });
        return res.status(200).json({
            success: true,
            data: response.data.choices[0].message.content
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data:"There is an issue on the server",
        })
    }
})
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on ${port}`))


// import { readFile, readFileSync } from 'fs';
// import { ChatGPTAPI } from 'chatgpt';

// async function retList() {
//   const api = new ChatGPTAPI({
//     apiKey: process.env.OPEN_AI_KEY,
//   });
//   let res = await api.sendMessage('What is OpenAI?')
// console.log(res.text)
// }

// // //does this second
// // readFile('./hello.txt','utf-8',(err,txt)=>{
// //     console.log(txt)
// // });

// //does this first
// // console.log("Hello")

//const{ readFile } = require('fs').promises;


// // async function hello(){
// // const file = await readFile('./hello.txt','utf-8');
// // console.log(file)
// // }

// // const MyMod = require('./my-module')

// // console.log(MyMod)

// const express = require('express');
// const { ChatGPTAPI } = require('chatgpt');

// const app = express()

// app.use(express.static('public'))

// app.get('/', (request,response) => {
//     readFile('./public/home.html','utf-8',(err,html)=>{
//         if(err){
//             response.status(500).send('Not working');
//         }
//         response.send(html);
//     })
// });


// app.listen(process.env.PORT || 3000, () => console.log('App Available on http://localhost:3000'))