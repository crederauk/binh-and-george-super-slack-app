import 'dotenv/config';
import SlackBolt from '@slack/bolt';
import got from 'got';
import {
  getRandomArrayElement,
  getSimpleMessageResponse,
  sanitize,
} from './src/utils/index.js';

const { App } = SlackBolt;

const COMMANDS = {
  DALL_E: 'bgdalle',
  DALL_E_TAGLINE: 'bgdalle-tagline',
};

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.BNG_SLACK_BOT_TOKEN,
  signingSecret: process.env.BNG_SLACK_SIGNING_SECRET,
});

app.command(`/${COMMANDS.DALL_E}`, async ({ ack, command, respond }) => {
  await ack();

  const { text, user_name } = command;

  if (!text) {
    await respond(
      getSimpleMessageResponse(
        "Looks like you haven't included a query with your command. Try again with something like `/bgdalle A goose destroying Tower Bridge` 😘."
      )
    );

    return;
  }

  const sanitizedText = sanitize(text);
  got(
    `${process.env.BNG_DALL_E_SCRAPER_BASE_URL}?query_string=${sanitizedText}&username=${user_name}`
  );

  await respond(
    getSimpleMessageResponse(
      `Your query of *${sanitizedText}* has been received and, if everything goes right, you will receive your image within the next 3 minutes ☺️!`
    )
  );
});

const connectorTexts = [
  'in',
  'on',
  'at',
  'with',
  'and',
  'of',
  'over',
  'under',
  'above',
  'below',
];
app.command(
  `/${COMMANDS.DALL_E_TAGLINE}`,
  async ({ ack, command, respond }) => {
    await ack();

    const { user_name } = command;

    const { this: thisText, that: thatText } = await got(
      'https://itsthisforthat.com/api.php?json',
      {
        method: 'GET',
      }
    ).json();
    const connectorText = getRandomArrayElement(connectorTexts);
    const text = `${thatText} ${connectorText} ${thisText}`;

    const sanitizedText = sanitize(text);
    got(
      `${process.env.BNG_DALL_E_SCRAPER_BASE_URL}?query_string=${sanitizedText}&username=${user_name}`
    );

    await respond(
      getSimpleMessageResponse(
        `Your query of *${sanitizedText}* has been received and, if everything goes right, you will receive your image within the next 3 minutes ☺️!`
      )
    );
  }
);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 8080);

  console.log('⚡️ Bolt app is running!');
})();
