const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Bot Help'),
	async execute(interaction) {

		const embed = new MessageEmbed()
			.setColor("#00FF08")
			.setTitle("Help!")
			.setTimestamp(new Date())
			.addFields(
				{ name: "This is a gacha game, nothing is guaranteed.", value: "\u200B"},
				{ name: "/wish", value: "Wish For a vast amount of items!" },
				{ name: "/rank", value: "Check your traveler info!"}
			)

		await interaction.reply({ embeds: [embed] }); 
	},
};