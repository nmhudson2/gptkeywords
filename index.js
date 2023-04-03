const express = require("express");
const router = express.Router();
require("dotenv").config();
const path = require('path');
const{ Configuration, OpenAIApi } = require('openai');

// new
const googleTrends = require("google-trends-api");
const Chart = require("chart.js");
// end new
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
        {"role":"user", "content": `Return an array of the most important individual words in ${req.body.input}, between 5 and 15 words long. These words should be the most likely to increase sclick rates and Google ranking for SEO.`}
      ],
      max_tokens: 1000,
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



  app.post('/trends', (req, res) => {
    const { keyword } = req.body;
    const startTime = new Date(Date.now()-730*24*60*60*1000)
  
    if (!keyword) {
      return res.status(400).send({ error: "Must have a keyword field" });
    }
  
    googleTrends.interestOverTime({ keyword,startTime })
      .then(function(results){
          var resultsJson = JSON.parse(results);
          var data = resultsJson["default"];
          var timelineData = data["timelineData"];
          var responseData = [];
  
          timelineData.forEach(function(timestamp){
            if (timestamp.value !== undefined){
              responseData.push({ date: timestamp['formattedTime'], value: timestamp.value });}
          });
  
          res.send(responseData);
        })
        .catch(function(err){
            console.error("Error: ",err);
            res.status(500).send({ error: err.message });
        });
  });
  
