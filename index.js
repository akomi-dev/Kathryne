const { TOKEN } = require("./config.json");

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => console.log(`\n${client.user.tag} has been logged in.\n`));

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
                content: 'There was an error while executing this command!', 
                ephemeral: true 
            }
        );
	}
});

client.login(TOKEN);