import Botkit from 'botkit';
import { listRecord, addRecord, removeRecord } from './dns';
import Config from './config';
const config = new Config();

const controller = Botkit.slackbot({
  debug: false
  // include "log: false" to disable logging
  // or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: config.slackToken,
  retry: Infinity
}).startRTM();

controller.on('rtm_close', () => {
  controller.shutdown();
});

const eventType = ['direct_message', 'direct_mention', 'mention'];

controller.hears(['help'], eventType, (bot, message) => {
  const helpMessage = '*Usage*: send direct message or `@yobot <subcommand>` in channel\n' +
    'Available subcommands are:\n' +
    '>>>------------\n' +
    'domain list\n' +
    'domain set [domain] [ip] [login_token] [domain_id]\n' +
    '------------\n' +
    'record list [domain]\n' +
    'record add [site]\n' +
    'record remove [domain] [record_id]';
  bot.reply(message, helpMessage);
});

const statusReply = (text, success = false) => ({
  attachments: [{
    fallback: text,
    text,
    color: success ? '#36A64F' : '#D00000'
  }]
});

controller.hears('record add .*\\|(.*)\\.(.*\\..*)>', eventType, (bot, message) => {
  const subdomain = message.match[1];
  const domain = message.match[2];

  addRecord(domain, subdomain)
  .then((data) => {
    const text = `http://${subdomain}.${domain} added ${data.record.id}`;
    bot.reply(message, statusReply(text, true));
  })
  .catch((error) => {
    bot.reply(message, statusReply(error.message));
  });
});

controller.hears('record remove .*\\|(.*)> (.*)', eventType, (bot, message) => {
  const domain = message.match[1];
  const recordId = message.match[2];

  removeRecord(domain, recordId)
  .then(() => {
    bot.reply(message, statusReply(`${recordId} deleted success`, true));
  })
  .catch((error) => {
    bot.reply(message, statusReply(error.message));
  });
});

controller.hears('record list .*\\|(.*)>', eventType, (bot, message) => {
  const domain = message.match[1];

  listRecord(domain)
  .then(json =>
    json.records
    .filter(record => record.type === 'A')
    .map(record => `${record.name}, ${record.id}`)
    .reduce((r1, r2) => `${r1}\n${r2}`)
  )
  .then(data => bot.reply(message, data))
  .catch((error) => {
    bot.reply(message, statusReply(error.message));
  });
});
