const Promise = require('bluebird');
const numeral = require('numeral');
const Discord = require('discord.js');
const db = require('./db');

const token = process.env.DISCORD_TOKEN;
const channel = process.env.DISCORD_CHANNEL;
const client = new Discord.Client();
let speaker;

const getHeistMessage = () => new Promise((resolve, reject) => {
  let i = 0;
  const day = new Date().getUTCDate();
  const month = new Date().getUTCMonth() + 1;
  const year = new Date().getUTCFullYear();
  const date = `${day}-${month}-${year}`;
  let message = `**here is the heist leaderboard for ${date}:** \n`;
  const query = 'SELECT * FROM heist WHERE date = ? ORDER BY drugs DESC LIMIT 20';
  db.queryAsync(query, date).then(users => {
    users.forEach(user => {
      i++;
      message += `\n**${i}: ${user.username}** ${numeral(user.drugs).format('0a')} DRUGS`;
    });
    resolve(message);
  }).catch(e => {
    console.log('Query heist message failed', e);
    reject();
  });
});

const getDailyMessage = () => new Promise((resolve, reject) => {
  let message = '**here is the drug production rate current positions:** \n';
  let i = 0;
  db.queryAsync('SELECT * FROM users ORDER BY drug_production_rate DESC LIMIT 20').then(users => {
    users.forEach(user => {
      i++;
      const dailyProductionRate = user.drug_production_rate * 60 * 60 * 24;
      message += `\n**${i}: ${user.username}** ${numeral(dailyProductionRate).format('0a')} DRUGS /day`;
    });
    resolve(message);
  }).catch(e => {
    console.log('Query daily message failed', e);
    reject();
  });
});

client.on('ready', () => {
  console.log(`Bot logged in as ${client.user.tag}!`);
  speaker = client.channels.get(channel);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  if (msg.content === '$heist') {
    getHeistMessage().then(message => {
      msg.reply(message);
    });
  }

  if (msg.content === '$daily') {
    getDailyMessage().then(message => {
      msg.reply(message);
    });
  }
});

client.login(token);

const log = message => {
  if (speaker) {
    return speaker.send(message);
  }
  console.log(`Missing bot message: ${message}`);
};

module.exports = log;
