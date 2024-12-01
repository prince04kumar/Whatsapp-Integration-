const express = require("express");
const body_parser = require("body-parser");
const app = express().use(body_parser.json());
const axios = require("axios");

const port = 8000;
const { keyValuePairs } = require("./config");
const accesstoken = keyValuePairs[0].value;

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
   const mytoken = req.query["hub.verify_token"];

  if (mode && mytoken) {
    if (mode === "subscribe" && mytoken === mytoken) {
      console.log("Verified");
      
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Forbidden");
    }
  } else {
    res.status(400).send("Bad Request");
  }
});

const processedMessages = new Set();
app.post("/webhook", async (req, res) => {
  let body_param = req.body;
  res.sendStatus(200);

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      const message = body_param.entry[0].changes[0].value.messages[0];

      //const msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
      const phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
      const messageId = message.id;
      const from = message.from;
     // console.log("Message: " + msg_body);
      console.log("Phone Number ID: " + phone_no_id);
      console.log("Message ID: " + messageId);
     


      let response_message = "Hello! How can I help you?";


          
      if (processedMessages.has(messageId)){
        return res.sendStatus(200); 
      }
      processedMessages.add(messageId);

   // Identify the message type

   if (message.text) {
    console.log(" Message Type : text " + message.text.body);
    response_message = "You sent a text message.";
  } else if (message.image) {
    console.log("Message Type : image " + message.image.id);
    response_message = "You sent an image.";
  } else if (message.document) {
    console.log("Message Type : docs " + message.document.id);
    response_message = "You sent a document.";
  } else if (message.video) {
    console.log("Message Type : Video msg " + message.video.id);
    response_message = "You sent a video.";
  }  else if (message.audio) {
    console.log("Message Type : audio msg " + message.audio.id);
    response_message = "You sent an audio.";
  } else {
    console.log("Unknown Message Type");
    response_message = "I'm not sure what you sent.";
  }

     // to send msg
     axios({
      method: "POST",
      url: `https://graph.facebook.com/v13.0/${phone_no_id}/messages?access_token=${accesstoken}`,
      data: {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: response_message,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Message sent:");
      })
      .catch((error) => {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
      });
  }

  } else {
    res.sendStatus(400);
  }
});

// Start the server
app.listen(port, () => {
  console.log("Webhook is listening on port 8000");
});