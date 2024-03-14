const { SlashCommandBuilder } = require('@discordjs/builders');
const { codeBlock } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkstats')
		.setDescription('See a users stats!')
		.addUserOption(option =>
			option
				.setName('userid')
				.setDescription('The user to check (leave blank for yourself)')
				.setRequired(false))
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
				.setRequired(true)),
	async execute(interaction, Tags) {
		let uid = interaction.options.getUser('userid');
		if(uid == null){
			uid = interaction.user.id
		}
		else{
			uid = uid.id;
		}
		const tag = await Tags.findAll({where:{uid: uid}});
		
		if(tag.length != 0){
			//if puzzles are found
			let totalScore = 0;
			let totalGuesses = 0;
			let averageScore = 0;
			let averageGuesses = 0;
			let totalPuzzles = tag.length;

			for(let i=0;i<tag.length;i++){
				totalScore += tag[i].score
				totalGuesses += tag[i].guesses
			}
			averageScore = totalScore/totalPuzzles
			averageGuesses = totalGuesses/totalPuzzles

			averageScore = averageScore.toFixed(2);
			averageGuesses = averageGuesses.toFixed(2);

			return interaction.reply({content:codeBlock(`Results for Connections Stats\nTotal Puzzles: ${totalPuzzles}\nTotal Score: ${totalScore}\nAverage Score: ${averageScore}\nAverage Guesses: ${averageGuesses}`),ephemeral:true});
		}
		return interaction.reply({content:`Could not find any Connections for that user!`,ephemeral:true});
	},
};

async function connection_stats(){

}
async function wordle_stats(){

}
async function mini_stats(){

}
async function strand_stats(){

}