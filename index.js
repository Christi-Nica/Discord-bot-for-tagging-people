const { Client, GatewayIntentBits } = require('discord.js');
const schedule = require('node-schedule');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
	],
});


// list of names for current day
const currentDayNames = ["ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/ , "ID" /*Name*/];


client.on("messageCreate", async message => {
  let currentTime = new Date();
  if (message.content === "/checktime") {
    message.channel.send("The current time is: " + currentTime.toLocaleString());
  }
  if(message.content === "/list"){
  let c = 0;
  let msg = "> `DATE         CLAN_NAME        `\n";
  while (c < 10) {
  currentTime.setDate(currentTime.getDate() + 1);
  const user1 = await client.users.fetch(currentDayNames[c]);
  msg += "> `" + currentTime.toLocaleDateString() + "    " + user1.username.padEnd(14) + "`\n";
  c++;
}
message.channel.send(msg);
}});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  scheduleCheckReaction();
});

// function to schedule checking for reaction
function scheduleCheckReaction() {
  schedule.scheduleJob('30 2 * * *',sendInitialMessage);
  schedule.scheduleJob('30 8 * * *', checkReaction1);
  schedule.scheduleJob('30 14 * * *', checkReaction1);
  schedule.scheduleJob('30 20 * * *', checkReaction1);
  schedule.scheduleJob('30 0 * * *', checkReaction2);
}

// function to send initial message with current day names and react with ✅
async function sendInitialMessage() {
    const channel = client.channels.cache.get('CHANNEL_ID');
    let message = 'Buying today: ';
    let name = currentDayNames[0];
    message += `<@${name}> \n`;
    message += 'React with ✅ if you bought and don\'t want to be tagged.'
    message += '\n\nBuying order:\n'
    let c = 0;
    message += "> `DATE         CLAN_NAME        `\n";
    let currentTime = new Date();
    while (c < 10) {
    const user1 = await client.users.fetch(currentDayNames[c]);
    message += "> `" + currentTime.toLocaleDateString() + "    " + user1.username.padEnd(14) + "`\n";
    currentTime.setDate(currentTime.getDate() + 1);
      c++;
    }
        channel.send(message).then(msg => {
            msg.react('✅');
        });
        console.log(`Done initial message!`);
}

function checkReaction1() {
  let name = currentDayNames[0];
  // retrieve the initial message
  const channel = client.channels.cache.get('CHANNEL_ID');
  channel.messages.fetch({ limit: 1 }).then(messages => {
      const initialMessage = messages.first();
      // check reactions and send the message
      initialMessage.reactions.cache.get('✅').users.fetch().then(users => {
          let needsToBuy = "";
        if (!users.has(name)) {
              needsToBuy += `<@${name}>`;
          }
          if (needsToBuy.length > 0) {
            channel.send(`Needs to buy: ${needsToBuy} \nReact with ✅ to this message if you bought and don\'t want to be tagged.`).then(sentMessage => {
                sentMessage.react('✅');
            });
          }
      });
  });
  console.log(`Checked`);
}

function checkReaction2() {
  let name = currentDayNames.shift();
  // retrieve the initial message
  const channel = client.channels.cache.get('CHANNEL_ID');
  channel.messages.fetch({ limit: 1 }).then(messages => {
      const initialMessage = messages.first();
      // check reactions and send appropriate message
      initialMessage.reactions.cache.get('✅').users.fetch().then(users => {
          let needsToBuy = "";
        if (!users.has(name) && initialMessage.content.includes(name)) {
              needsToBuy += `<@${name}>`;
          }
          if (needsToBuy.length > 0) {
            channel.send(`Needs to buy: ${needsToBuy} \nReact with ✅ to this message if you bought and don\'t want to be tagged.`).then(sentMessage => {
                sentMessage.react('✅');
            });
          }
      });
  });
  currentDayNames.push(name);
}    

client.login('TOKEN');