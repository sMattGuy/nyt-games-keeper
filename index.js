const fs = require('node:fs');
const path = require('path')
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');
const { connection_handler,mini_handler,wordle_handler,strands_handler} = require('./game_handler.js');

const client = new Client({intents:[GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions]});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
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
		await command.execute(interaction);
	} catch(error){
		console.error(error);
		await interaction.reply({content:'There was an error with this command!',ephemeral:true});
	}
});

// regex definitions
const connections_regex = new RegExp('Connections\\nPuzzle #\\d+\\n');
const wordle_regex = new RegExp('Wordle (\\d{1,3}(,\\d{3})*).+([1-6]|X)\\/6\\*?');
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
});

client.login(token);

