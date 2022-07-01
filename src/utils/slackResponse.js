export function getSimpleMessageResponse(message, { isInChannel } = {}) {
  return {
    response_type: isInChannel ? 'in_channel' : 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      },
    ],
  };
}
