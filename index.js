const express = require("express");
require("dotenv").config();
const path = require('path');
const{ Configuration, OpenAIApi } = require('openai');

const app = express();

app.use(express.json());


//GPT API SECTION


const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

const openai = new OpenAIApi(configuration);

app.post("/request", async(req,res)=>{
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {"role":"user", "content": `Return an array of the most important words in ${req.body.input}, no less than 5 words long.`}
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response ? error.response.data : "There is an issue on the server",
    })
  }
});

const port = process.env.PORT || 5000;


//END API SECTION

//START PAGE SERVER

app.listen(port, () => console.log(`Server listening on ${port}`))

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  });

//END PAGE SERVER

app.all("/post", (req, res) => {
    // Handle GET and POST requests
  });



