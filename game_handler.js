const {Wordle,Connections,Mini,Strands} = require('./dbObjects.js');

async function connection_handler(message){
    const idRegex = new RegExp('\\d+');
	let searchResults = message.content.match(idRegex);
	const puzzleId = searchResults[0];
	
	const checktag = await Connections.findOne({where:{user_id: message.author.id, server_id: message.guild.id, puzzle_id: puzzleId}});
	if(checktag){
		//tag already in system
		console.log(`connections ${puzzleId} for user ${message.author.id} already recorded`);
	}
	else{
		//calculate score
		const lvl1Reg = new RegExp('🟨🟨🟨🟨');
		const lvl2Reg = new RegExp('🟩🟩🟩🟩');
		const lvl3Reg = new RegExp('🟦🟦🟦🟦');
		const lvl4Reg = new RegExp('🟪🟪🟪🟪');
		const totalGuess = /\n(🟨|🟦|🟪|🟩)/gm;
		let score = 0;
		let correctGuesses = 0;
		let guessCount = 0;

		if(lvl1Reg.test(message.content)){
			score += 2
			correctGuesses += 1;
		}
		if(lvl2Reg.test(message.content)){
			score += 2
			correctGuesses += 1;
		}
		if(lvl3Reg.test(message.content)){
			score += 4
			correctGuesses += 1;
		}
		if(lvl4Reg.test(message.content)){
			score += 6
			correctGuesses += 1;
		}
		if(totalGuess.test(message.content)){
			guessCount = message.content.match(totalGuess)
			score -= 1 * (guessCount.length - correctGuesses)
		}
		if(score < 0){
			score = 0;
		}
		if(score == 14){
			score = 15;
		}
		try{
			Connections.create({
				user_id: message.author.id,
                server_id: message.guild.id,
				puzzle_id: puzzleId,
				score: score,
				guesses: guessCount.length,
				desc: message.content
			});
			console.log(`connections ${puzzleId} added for user ${message.author.id}`);
            message.react('✅');
		} catch(error){
			console.error(error);
		}
	}
}
async function mini_handler(message){
    const url_params = new URLSearchParams(message.content);
    const date = url_params.get('https://www.nytimes.com/badges/games/mini.html?d');
    const time = url_params.get('t');
    const checktag = await Mini.findOne({where:{user_id: message.author.id, server_id: message.guild.id, date: date}});
	if(checktag){
		//tag already in system
		console.log(`mini ${date} for user ${message.author.id} already recorded`);
	}
	else{
		try{
			await Mini.create({
				user_id: message.author.id,
                server_id: message.guild.id,
				date: date,
				time: time
			});
			console.log(`mini ${date} added for user ${message.author.id}`);
            message.react('✅');
		} catch(error){
			console.error(error);
		}
	}
}
async function wordle_handler(message){
	const puzzleId = parseInt(message.content.match(/(\d{1,3}(,\d{3})*)/g)[0].replaceAll(",",""));
	const score = message.content.match(/([1-6]|X)\/6/g)[0][0]
	const checktag = await Wordle.findOne({where:{user_id: message.author.id, server_id: message.guild.id, puzzle_id: puzzleId}});
	if(checktag){
		//tag already in system
		console.log(`wordle ${puzzleId} for user ${message.author.id} already recorded`);
	}
	else{
		try{
			await Wordle.create({
				user_id: message.author.id,
                server_id: message.guild.id,
				puzzle_id: puzzleId,
				score: score
			});
			console.log(`wordle ${puzzleId} added for user ${message.author.id}`);
            message.react('✅');
		} catch(error){
			console.error(error);
		}
	}
}
async function strands_handler(message){
    const idRegex = new RegExp('\\d+');
	let searchResults = message.content.match(idRegex);
	const puzzleId = searchResults[0];
	
	const checktag = await Strands.findOne({where:{user_id: message.author.id, server_id: message.guild.id, puzzle_id: puzzleId}});
	if(checktag){
		//tag already in system
		console.log(`strands ${puzzleId} for user ${message.author.id} already recorded`);
	}
	else{
		//calculate score
		const theme_regex = new RegExp('“.+”');
		const hint_regex = new RegExp('💡');
        const score_regex = new RegExp('🔵|🟡')

        const theme = message.content.match(theme_regex)
        let hints = message.content.match(hint_regex)
        const score = message.content.match(score_regex)

		try{
            if(!hints){
                hints = [];
            }
			Strands.create({
				user_id: message.author.id,
                server_id: message.guild.id,
				puzzle_id: puzzleId,
                theme: theme[0],
				score: score.length,
				hints: hints.length
			});
			console.log(`strands ${puzzleId} added for user ${message.author.id}`);
            message.react('✅');
		} catch(error){
			console.error(error);
		}
	}
}
module.exports = {connection_handler, mini_handler, wordle_handler, strands_handler}
