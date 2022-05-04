const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wish')
		.setDescription('Wish for amazing rewards!'),
	async execute(interaction) {
		await interaction.reply("REWARDS!!"); 
        // apply rewards to a json file that is callable by the user
	},
};