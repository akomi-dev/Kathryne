const { TOKEN } = require("./config.json");

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => console.log(`\n${client.user.tag} has been logged in.\n`));

//#region Slash Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands')
                       .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
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
	}
});
//#endregion

//#region onMessage JSON leveling/ranking system
client.on("messageCreate", (msg) => {
	if (msg.author.bot) return; 
	
	const guildId = msg.guild.id;
	const authorId = msg.author.id;

	let ranks = require("./ranks.json");

	if (!ranks[guildId]) {
		const temp = {[guildId]: {}};
		fs.writeFile("./ranks.json", JSON.stringify(temp), err => { if (err) throw err; });
	} else {
		if (!ranks[guildId][authorId]) {
			ranks = require("./ranks.json");
			const temp = {[guildId]: {[authorId]: {rank: 0, rankEXP: 0, coins: 0, items: []}}};
			fs.writeFile("./ranks.json", JSON.stringify(temp), err => { if (err) throw err; });
		}
		else if (ranks[guildId][authorId]) {
			const randXpAmt = () => Math.floor(Math.random()*10)+1;
			ranks[guildId][authorId]["rankEXP"] += randXpAmt();
		
			if (ranks[guildId][authorId]["rankEXP"] >= (ranks[guildId][authorId]["rank"]+1)**2) {
				ranks[guildId][authorId]["rankEXP"] = 0;
				ranks[guildId][authorId]["rank"] += 1;
				ranks[guildId][authorId]["coins"] += 100;
			};
			fs.writeFile("./ranks.json", JSON.stringify(ranks), err => { if (err) throw err; });
		};
	};
});
//#endregion

client.login(TOKEN);