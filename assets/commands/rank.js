const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check your rank'),
	async execute(interaction) {
		const ranks = require(require('path').resolve('assets', 'ranks.json'))
		const userRank = ranks[interaction.member.user.id]["rank"]
		await interaction.reply(`Your ranks is ${userRank}`);
	},
};