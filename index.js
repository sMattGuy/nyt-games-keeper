const fs = require('node:fs');
const {Client, Collection, Intents} = require('discord.js');
const {token} = require('./config.json');
const { connection_handler,mini_handler,wordle_handler,strands_handler} = require('./game_handler.js');

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MEMBERS]});

client.commands = new Collection();

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once('ready', () => {
	console.log('Ready');
});

client.on('interactionCreate', async interaction => {
	if(!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if(!command) return;
	try{
		await command.execute(interaction, Tags);
	} catch(error){
		console.error(error);
		await interaction.reply({content:'There was an error with this command!',ephemeral:true});
	}
});

// regex definitions
const connections_regex = new RegExp('Connections \\nPuzzle #\\d+\\n');
const wordle_regex = new RegExp('Wordle (\\d+) ([1-6]|X)\\/6');
const mini_regex = new RegExp('www\\.nytimes\\.com\\/badges\\/games\\/mini\\.html');
const strands_regex = new RegExp('Strands #\\d+');

client.on('messageCreate', async message => {
	if(connections_regex.test(message.content)){
		await connection_handler(message);
	}
	else if(wordle_regex.test(message.content)){
		await wordle_handler(message);
	}
	else if(mini_regex.test(message.content)){
		await mini_handler(message);
	}
	else if(strands_regex.test(message.content)){
		await strands_handler(message);
	}

	// move to own admin command
	// if(message.author.id == message.guild.ownerId && message.content == '!connectionsUpdate'){
	// 	//admin trigger for updating database
	// 	console.log('fetching all messages');
	// 	const messages = await fetchAllMessages(message.channel);
	// 	for(let i=0;i<messages.length;i++){
	// 		if(regex.test(messages[i])){
	// 			//valid connections message
	// 			console.log('found valid message');
	// 			await insertData(messages[i].content, messages[i].author.id);
	// 			messages[i].react('✅');
	// 		}
	// 		else{
	// 			//message not valid
	// 			console.log(`message not valid: ${messages[i]}`);
	// 		}
	// 	}
	// 	console.log('finished updating channel');
	// }
});


// async function fetchAllMessages(channelId) {
// 	const channel = client.channels.cache.get(channelId.id);
// 	let messages = [];

// 	// Create message pointer
// 	let message = await channel.messages
// 		.fetch({ limit: 1 })
// 		.then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

// 	while (message) {
// 		await channel.messages
// 		.fetch({ limit: 100, before: message.id })
// 		.then(messagePage => {
// 			messagePage.forEach(msg => messages.push(msg));

// 			// Update our message pointer to be last message in page of messages
// 			message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
// 		});
// 	}
// 	return messages
// }

client.login(token);

