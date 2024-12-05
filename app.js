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
      const phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
      const messageId = message.id;
      const from = message.from;
      console.log("From: " + from);
      console.log("Message ID: " + messageId);

      let response_message = "Hello! How can I help you?";
      if (processedMessages.has(messageId)) {
        return res.sendStatus(200);
      }
      processedMessages.add(messageId);
      let msg_type;
      
      // Identify the message type and msg
      if (message.text) {
        msg_type = "text";
        const msg_body_text = message.text.body;
        console.log("Msg type:", msg_type, "\nMsg body:", msg_body_text);
      }
      
      
      else if (message.image) {
        msg_type = "image";
        const msg_body_imageId = message.image.id;
        console.log("Msg type:", msg_type, "Msg body:", msg_body_imageId);


         // Fetch the image and convert it to Base64
         try {
          const imageResponse = await axios({
            method: "GET",
            url: `https://graph.facebook.com/v13.0/${msg_body_imageId}/?access_token=${accesstoken}`,
            responseType: "arraybuffer",
            headers: {
              Authorization: `Bearer ${accesstoken}`,
            },
          });

          // Convert the image to Base64
          const base64EncodedImage = Buffer.from(imageResponse.data, "binary").toString("base64");
          const filePart = {
            inline_data: {
              data: base64EncodedImage,
              mimeType: 'image/jpeg',
            },
          };
          console.log("File part created:",  typeof filePart);

        } catch (error) {
          console.error("Error fetching or converting image:", error.message);
        }
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
          console.error(
            "Error sending message:",
            error.response ? error.response.data : error.message
          );
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
