const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Bot Help'),
	async execute(interaction) {
		await interaction.reply("HELP!!"); 
	},
};