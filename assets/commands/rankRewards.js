const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rewards')
		.setDescription('Retrieve your guild rank rewards'),
	async execute(interaction) {
		const ranks = require("../ranks.json")
		const userRank = ranks[interaction.member.user.id]["rank"]
		await interaction.reply(`Your ranks is ${userRank}`);
	},
};