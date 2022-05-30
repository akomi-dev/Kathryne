const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN } = require('./assets/config.json');
const { clientId, guildId } = require("./assets/publicConfig.json")

function deploy() {
	const commands = [];
	const commandFiles = fs.readdirSync('./assets/commands').filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const command = require(`./assets/commands/${file}`);
		commands.push(command.data.toJSON());
	}
	
	const rest = new REST({ version: '9' }).setToken(TOKEN);

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
};

module.exports.deployCommands = deploy();