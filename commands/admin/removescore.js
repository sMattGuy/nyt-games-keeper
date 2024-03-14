const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Wordle, Mini, Connections, Strands } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removescore')
		.setDescription('Removes a users score')
		.addUserOption(option =>
			option
				.setName('userid')
				.setDescription('The user to modify')
				.setRequired(true))
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
		.addStringOption(option =>
			option
				.setName('puzzleid')
				.setDescription('The ID of the puzzle to remove (use date if Mini)')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const user_id = interaction.options.getUser('userid').id;
		const game = interaction.options.getString('game');
		const puzzle_id = interaction.options.getString('puzzleid');
		
		let rowcount = 0;

		switch(game){
			case "wordle":
				rowcount = await Wordle.destroy({where:{user_id: user_id, server_id: interaction.guild.id, puzzle_id: puzzle_id}});
				break;
			case "connections":
				rowcount = await Connections.destroy({where:{user_id: user_id, server_id: interaction.guild.id, puzzle_id: puzzle_id}});
				break;
			case "mini":
				rowcount = await Mini.destroy({where:{user_id: user_id, server_id: interaction.guild.id, date: puzzle_id}});
				break;
			case "strands":
				rowcount = await Strands.destroy({where:{user_id: user_id, server_id: interaction.guild.id, puzzle_id: puzzle_id}});
				break;
		}
		
		if(!rowcount)
			return interaction.reply({content:`Could not find that puzzle for that user!`,ephemeral:true});
		return interaction.reply({content:`Deleted puzzle ${puzzle_id} (${rowcount} row removed)!`,ephemeral:true});
	},
};