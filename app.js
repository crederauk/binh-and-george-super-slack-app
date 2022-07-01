import 'dotenv/config';
import SlackBolt from '@slack/bolt';
import got from 'got';
import { sanitize } from './src/utils/index.js';

const { App } = SlackBolt;

const COMMANDS = {
  DALL_E: 'bgdalle',
};

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command(
  `/${COMMANDS.DALL_E}`,
  async ({ ack, message, client, command, respond }) => {
    console.dir({ message, client, command });

    await ack();

    const { text } = command;

    if (!text) {
      await respond({
        response_type: 'ephemeral',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "Looks like you haven't included a query with your command. Try again with something like `bgdalle A goose destroying Tower Bridge` 😘.",
            },
          },
        ],
      });

      return;
    }

    const sanitizedText = sanitize(text);
    got(`${process.env.DALL_E_SCRAPER_BASE_URL}?query_string=${sanitizedText}`);

    await respond({
      response_type: 'ephemeral',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Your query of *${sanitizedText}* has been received and, if everything goes right, you will receive your image within the next 3 minutes ☺️!`,
          },
        },
      ],
    });
  }
);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
