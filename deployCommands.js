const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, TOKEN } = require('./assets/config.json');

const commands = [];
const commandFiles = fs.readdirSync('./assets/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./assets/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('\nSuccessfully registered application commands.\n'))
	.catch(console.error);