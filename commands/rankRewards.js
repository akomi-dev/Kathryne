const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rewards')
		.setDescription('Retrieve your guild rank rewards'),
	async execute(interaction) {
		await interaction.reply('REWARDS!');
	},
};