const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { Wordle, Connections, Mini, Strands } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkstats')
		.setDescription('See a users stats!')
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
				.setRequired(false)),
	async execute(interaction, Tags) {
		let user_id = interaction.options.getUser('userid') ?? interaction.user;
		const game = interaction.options.getString('game');
    user_id = user_id.id;

		switch(game){
			case "wordle":
				wordle_stats(user_id, interaction.guild.id, interaction);
				break;
			case "connections":
				connection_stats(user_id, interaction.guild.id, interaction);
				break;
			case "mini":
				mini_stats(user_id, interaction.guild.id, interaction);
				break;
			case "strands":
				strand_stats(user_id, interaction.guild.id, interaction);
				break;
		}
	},
};

async function connection_stats(user_id, server_id, interaction){
	const tag = await Connections.findAll({where:{user_id: user_id, server_id: server_id}});
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
}
async function wordle_stats(user_id, server_id, interaction){
	const tag = await Wordle.findAll({where:{user_id: user_id, server_id: server_id}});	
	if(tag.length != 0){
		//if puzzles are found
		let scoreList = [0,0,0,0,0,0,0];
		for(let i=0;i<tag.length;i++){
			let scoreValue = parseInt(tag[i].score);
			if(isNaN(scoreValue)){
				scoreValue = 7;
			}
			scoreValue--;
			scoreList[scoreValue]++;
		}
		let scoreForAverage = scoreList[0]*1 + scoreList[1]*2 + scoreList[2]*3 + scoreList[3]*4 +scoreList[4]*5 + scoreList[5]*6 + scoreList[6]*7;
		let totalScore = scoreList[0]*6 + scoreList[1]*5 + scoreList[2]*4 + scoreList[3]*3 +scoreList[4]*2 + scoreList[5]*1;
		let averageScore = scoreForAverage / tag.length;
		averageScore = averageScore.toFixed(2);
		return interaction.reply({content:codeBlock(`Results for Wordle Stats\n1:${scoreList[0]}\n2:${scoreList[1]}\n3:${scoreList[2]}\n4:${scoreList[3]}\n5:${scoreList[4]}\n6:${scoreList[5]}\nX:${scoreList[6]}\nTotal Puzzles: ${tag.length}\nTotal Score: ${totalScore}\nAverage Score: ${averageScore}`),ephemeral:true});
	}
	return interaction.reply({content:`Could not find any Wordle for that user!`,ephemeral:true});
}
async function mini_stats(user_id, server_id, interaction){
	const tag = await Mini.findAll({where:{user_id: user_id, server_id: server_id}});	
	if(tag.length != 0){
		//if puzzles are found
		const total_puzzles = tag.length;
		let total_time = 0;
		for(let i=0;i<tag.length;i++){
			total_time += tag[i].time;
		}
		const average_time = Math.floor(total_time / total_puzzles);
		return interaction.reply({content:codeBlock(`Results for Mini Stats\nTotal Puzzles: ${total_puzzles}\nAverage Time: ${average_time}`),ephemeral:true});
	}
	return interaction.reply({content:`Could not find any Wordle for that user!`,ephemeral:true});
}
async function strand_stats(user_id, server_id, interaction){
	const tag = await Strands.findAll({where:{user_id: user_id, server_id: server_id}});	
	if(tag.length != 0){
		//if puzzles are found
		const total_puzzles = tag.length;
		let total_score = 0;
		let total_hints = 0;
		for(let i=0;i<tag.length;i++){
			total_score += tag[i].score;
			total_hints += tag[i].hints;
		}
		return interaction.reply({content:codeBlock(`Results for Strands Stats\nTotal Puzzles: ${total_puzzles}\nTotal Score: ${total_score}\nTotal Hints: ${total_hints}`),ephemeral:true});
	}
	return interaction.reply({content:`Could not find any Wordle for that user!`,ephemeral:true});
}
