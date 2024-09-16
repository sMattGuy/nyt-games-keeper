const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { connection_handler,mini_handler,wordle_handler,strands_handler} = require('../../game_handler.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fetchscores')
		.setDescription('Gets all valid scores in a channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.deferReply();

		const connections_regex = new RegExp('Connections\\nPuzzle #\\d+\\n');
		const wordle_regex = new RegExp('Wordle (\\d{1,3}(,\\d{3})*).+([1-6]|X)\\/6\\*?');
		const mini_regex = new RegExp('www\\.nytimes\\.com\\/badges\\/games\\/mini\\.html');
		const strands_regex = new RegExp('Strands #\\d+');

		console.log('fetching all messages');
		const messages = await fetchAllMessages(interaction.channel, interaction.client);
		for(let i=0;i<messages.length;i++){
			if(connections_regex.test(messages[i].content)){
				await connection_handler(messages[i]);
			}
			else if(wordle_regex.test(messages[i].content)){
				await wordle_handler(messages[i]);
			}
			else if(mini_regex.test(messages[i].content)){
				await mini_handler(messages[i]);
			}
			else if(strands_regex.test(messages[i].content)){
				await strands_handler(messages[i]);
			}
		}
		console.log('finished updating channel');
		interaction.editReply('Processed all data')
	},
};

async function fetchAllMessages(channelId, client) {
	const channel = client.channels.cache.get(channelId.id);
	let messages = [];

	// Create message pointer
	let message = await channel.messages
		.fetch({ limit: 1 })
		.then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

	while (message) {
		await channel.messages
		.fetch({ limit: 100, before: message.id })
		.then(messagePage => {
			messagePage.forEach(msg => messages.push(msg));
			// Update our message pointer to be last message in page of messages
			message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
		});
	}
	return messages
}
