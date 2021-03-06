const { TOKEN } = require("./assets/config.json");
const { deployCommands } = require("./deployCommands")

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
	deployCommands;
	client.user.setPresence({
		activities: [{
			type: "WATCHING",
			name: "for Wishes! | /wish"
		}],
		status: "online"
	});
	console.log(`${client.user.tag} has been logged in.`);
});

//#region Slash Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./assets/commands')
                       .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./assets/commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	const command = client.commands.get(interaction.commandName);

    if (!interaction.isCommand()) return;

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ 
            content: 'There was an error while executing this command!', 
			ephemeral: true 
        });
	};
});
//#endregion

//#region onMessage JSON leveling/ranking system
client.on("messageCreate", (msg) => {
	if (msg.author.bot) return; 

	const write = (file, obj) => fs.writeFile(
		file, JSON.stringify(obj), err => { if (err) throw err; }
	);
	
	const ranksJSON = "./assets/ranks.json";
	const authorId = msg.author.id;
		
	let ranks = require(ranksJSON);

	if (!ranks[authorId]) {
		ranks[authorId] = {rank: 0, rankEXP: 0, coins: 0, items: {characters:{}, weapons: {}}}
	} 

	ranks[authorId]["rankEXP"] += Math.floor(Math.random()*10)+1;

	if (ranks[authorId]["rankEXP"] >= (ranks[authorId]["rank"]+1)**2) {
		ranks[authorId]["rankEXP"] = 0;
		ranks[authorId]["rank"] += 1;
		ranks[authorId]["coins"] += 100;
	};
	write(ranksJSON, ranks);
});
//#endregion

client.login(TOKEN);