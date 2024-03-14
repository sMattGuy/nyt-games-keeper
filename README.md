# NYT Games Keeper
This is a combination of my other keeper bots into one. It can be easily modified to add more games.  
This bot automatically adds posted games to a database to be viewed later.  
It currently supports **Wordle, Connections, Mini Crossword, and Strands**
## Commands
There are only 2 commands in this bot for users.
|Name|Parameters|Description|
|--|--|--|
|checkpuzzle|game,puzzle,user|Gets the results of a specific game|
|checkstats|game,user|Gets the results of an entire game|
## Admin Commands
There are 2 admin commands to help with moderation
|Name|Parameters|Description|
|--|--|--|
|fetchscores|none|Searches a channel for all valid games|
|removescores|game,user|puzzle|Removes a users puzzle|