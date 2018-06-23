const express = require('express')
const server = express()
const axios = require('axios')
const bodyParser = require('body-parser')

const {
  dialogflow,
  BasicCard,
  Permission,
} = require('actions-on-google')

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

const port= process.env.PORT || 3000
let queueObject={a: 1}

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {color}) => {
 const luckyNumber = color.length;
 const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
 if (conv.data.userName) {
   // If we collected user name previously, address them by name and use SSML
   // to embed an audio snippet in the response.
   conv.ask(`<speak>${conv.data.userName}, your lucky number is ` +
     `${luckyNumber*2+10}.<audio src="${audioSound}"></audio>` +
     `Would you like to hear some fake colors?</speak>`);
 } else {
   conv.ask(`<speak>Your lucky number is ${luckyNumbe*2+10}.` +
     `<audio src="${audioSound}"></audio>` +
     `Would you like to hear some fake colors?</speak>`);
 }
});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
// app.intent('Default Welcome Intent', (conv) => {
//   conv.ask(new Permission({
//     context: 'Hi there, to get to know you better',
//     permissions: 'NAME'
//   }));
// });

app.intent('Default Welcome Intent - yes', (conv) => {
    conv.ask('It seems that Jurong Branch has ' + queueObject.a + ' people and the least waiting time. Would you like to proceed with booking an appointment at Jurong Branch?');
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask(`Ok, no worries. What's your favorite color?`);
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
  }
});

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
'indigo taco': new BasicCard({
  title: 'Indigo Taco',
  image: {
    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
    accessibilityText: 'Indigo Taco Color',
  },
  display: 'WHITE',
}),
'pink unicorn': new BasicCard({
  title: 'Pink Unicorn',
  image: {
    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
    accessibilityText: 'Pink Unicorn Color',
  },
  display: 'WHITE',
}),
'blue grey coffee': new BasicCard({
  title: 'Blue Grey Coffee',
  image: {
    url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
    accessibilityText: 'Blue Grey Coffee Color',
  },
  display: 'WHITE',
}),
};

app.intent('favorite fake color', (conv, {fakeColor}) => {
  conv.close(`Here's the color`, colorMap[fakeColor]);
});


server.use(bodyParser.json())

server.get('/', function (req, res) {
  res.send("server working")
})

server.post('/sendQueue', function(req,res) {
  queueObject = req.body.queue
  console.log(req.body)
  res.send(queueObject.a)
})

server.use(bodyParser.json(), app).listen(port, ()=>{
  console.log("app listening on port: ", port)
})
