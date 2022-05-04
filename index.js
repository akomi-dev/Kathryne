const { TOKEN } = require("./assets/config.json");

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => console.log(`\n${client.user.tag} has been logged in.\n`));

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
		await interaction.reply(
            { 
                content: 'There was an error while executing this command!', ephemeral: true 
            }
        );
	};
});
//#endregion

//#region onMessage JSON leveling/ranking system
client.on("messageCreate", (msg) => {
	if (msg.author.bot) return; 
	
	const guildId = msg.guild.id;
	const authorId = msg.author.id;
	const ranksJSON = "./assets/ranks.json";
	const write = (file, obj) => fs.writeFile(
		file, JSON.stringify(obj), err => { if (err) throw err; }
	);

	let ranks = require(ranksJSON);

	if (!ranks[guildId]) {
		const temp = {[guildId]: {}};
		write(ranksJSON, temp);
	} else {
		if (!ranks[guildId][authorId]) {
			ranks = require(ranksJSON);
			const temp = {[guildId]: {[authorId]: {rank: 0, rankEXP: 0, coins: 0, items: []}}};
			write(ranksJSON, temp);
		}
		else if (ranks[guildId][authorId]) {
			ranks[guildId][authorId]["rankEXP"] += Math.floor(Math.random()*10)+1;
		
			if (ranks[guildId][authorId]["rankEXP"] >= (ranks[guildId][authorId]["rank"]+1)**2) {
				ranks[guildId][authorId]["rankEXP"] = 0;
				ranks[guildId][authorId]["rank"] += 1;
				ranks[guildId][authorId]["coins"] += 100;
			};
			write(ranksJSON, ranks);
		};
	};
});
//#endregion

client.login(TOKEN);