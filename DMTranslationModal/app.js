const { App } = require('@slack/bolt');
const { config } = require('dotenv');

config();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

/**
 * Messages can be listened for, using specific words and phrases.
 * Note: your Slack app *must* be subscribed to the following events
 * and scopes, as well as be present in the channels where they occur.
 * 
 * Please see the 'Event Subscriptions' and 'OAuth & Permissions'
 * sections of your app's configuration to add the following:
 * 
 * Event subscription required:   messages.channels
 * OAuth scope required:          chat:write
 * 
 * Further Information & Resources
 * https://slack.dev/bolt-js/concepts#message-listening
 * https://api.slack.com/messaging/retrieving#permissions
 */
app.message('hello', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>!`);

  console.log("HI!");
});


// TODO :: bring doc string up to same quality as previous examples

/* Listening for Reaction Emojis */
// Your app *must* be in the channel of the message
// Event subscription: reaction_added
// Required scope(s): reactions:read
app.event('reaction_added', async ({ event, client }) => {
  const { reaction, user, item: { channel, ts } } = event;

  // Warning: some flags don't contain 'flag-' (US, Japan)
  console.log("REACTION!");
  if (!reaction.includes('flag-')) return;

  const [x, country] = reaction.split('-');

  let translatedText;

  // TODO :: better to turn this into a map of emoji country codes with values 
  // of the corresponding API country code if they differ (unverified)
  switch (country) {
    case 'mx':
      // TODO :: call translation API
      translatedText = 'This is in Spanish';
      break;
    case 'jp':
      // TODO :: call translation API
      translatedText = 'This is in Japanese';
      break;
  }

  if (translatedText) {
    await client.chat.postMessage({
      channel,
      thread_ts: ts,
      text: translatedText
    });
  }

});


app.shortcut('dm_translation', async ({ack, shortcut, client }) => {
  await ack();  
  const {trigger_id } = shortcut;
  await client.dialog.open(
  {
        trigger_id: trigger_id,
        dialog: {
          "callback_id": "ryde-46e2b0",
          "title": "Request a Ride",
          "submit_label": "Request",
          "notify_on_cancel": true,
          "state": "Limo",
          "elements": [
              {
                  "type": "text",
                  "label": "Pickup Location",
                  "name": "loc_origin"
              },
              {
                  "type": "text",
                  "label": "Dropoff Location",
                  "name": "loc_destination"
              }
          ]
        } 
    }
  );
});
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running! ⚡️');
})();



/*
,
              {
                "accessory": {
                  "type": "radio_buttons",
                  "action_id": "dm-or-thread",
                  "initial_option": {
                    "value": "A1",
                    "text": {
                      "type": "plain_text",
                      "text": "DM"
                    }
                  },
                  "options": [
                    {
                      "value": "A1",
                      "text": {
                        "type": "plain_text",
                        "text": "In Thread"
                      }
                    }
                  ]
                }
            }
*/
