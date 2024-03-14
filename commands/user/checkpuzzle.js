const { SlashCommandBuilder } = require('discord.js');
const { Wordle, Connections, Mini, Strands } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkpuzzle')
		.setDescription('See a users puzzle results!')
		.addStringOption(option =>
			option
				.setName('game')
				.setDescription('The game to check')
				.addChoices(
					{name:"Wordle",value:"wordle"},
					{name:"Connections",value:"connections"},
					{name:"Mini CW",value:"mini"},
					{name:"Strands",value:"strands"},
				)
				.setRequired(true))
		.addUserOption(option =>
			option
				.setName('userid')
				.setDescription('The user to check (leave blank for yourself)')
				.setRequired(false))
		.addStringOption(option => 
			option
				.setName('puzzleid')
				.setDescription('The ID of the puzzle (Date for Mini)')
				.setRequired(true)),
	async execute(interaction) {
		const user_id = interaction.options.getUser('userid') ?? interaction.user.id;
		const puzzle_id = interaction.options.getString('puzzleid');
		const game = interaction.options.getString('game');

		switch(game){
			case "wordle":
				get_wordle(user_id, interaction.guild.id, puzzle_id);
				break;
			case "connections":
				get_connection(user_id, interaction.guild.id, puzzle_id);
				break;
			case "mini":
				get_mini(user_id, interaction.guild.id, puzzle_id);
				break;
			case "strands":
				get_strand(user_id, interaction.guild.id, puzzle_id);
				break;
		}
	},
};

async function get_wordle(user_id, server_id, puzzle_id){
	const result = await Wordle.findOne({where:{user_id: user_id, server_id: server_id, puzzle_id: puzzle_id}});
	if(result){
		return interaction.reply({content:`Puzzle ${result.puzzle_id}: Score: ${result.score}`,ephemeral:true});
	}
	return interaction.reply({content:`Could not find Wordle ${puzzle_id} for that user!`,ephemeral:true});
}
async function get_connection(user_id, server_id, puzzle_id){
	const result = await Connections.findOne({where:{user_id: user_id, server_id: server_id, puzzle_id: puzzle_id}});
	if(result){
		return interaction.reply({content:`Puzzle ${result.puzzle_id}: Score: ${result.score} Guesses: ${results.guesses}`,ephemeral:true});
	}
	return interaction.reply({content:`Could not find Connections ${puzzle_id} for that user!`,ephemeral:true});
}
async function get_mini(user_id, server_id, puzzle_id){
	const result = await Mini.findOne({where:{user_id: user_id, server_id: server_id, date: puzzle_id}});
	if(result){
		return interaction.reply({content:`Puzzle ${result.date}: Time: ${result.time}`,ephemeral:true});
	}
	return interaction.reply({content:`Could not find Mini ${puzzle_id} for that user!`,ephemeral:true});
}
async function get_strand(user_id, server_id, puzzle_id){
	const result = await Strands.findOne({where:{user_id: user_id, server_id: server_id, puzzle_id: puzzle_id}});
	if(result){
		return interaction.reply({content:`Puzzle ${result.puzzle_id}: Theme: ${result.theme} Score: ${result.score} Hints: ${result.hints}`,ephemeral:true});
	}
	return interaction.reply({content:`Could not find Strand ${puzzle_id} for that user!`,ephemeral:true});
}