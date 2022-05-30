const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Check your rank'),
	async execute(interaction) {
		const ranks = require(require('path').resolve('assets', 'ranks.json'));

		const rank = ranks[interaction.member.user.id]["rank"];
		const xp = ranks[interaction.member.user.id]["rankEXP"];
		const coins = ranks[interaction.member.user.id]["coins"];

		const embed = new MessageEmbed()
			.setColor("#FFFFFF")
			.setAuthor({ 
				name: `${interaction.user.username}#${interaction.user.discriminator}`
			})
			.addFields(
				{ name: `**Rank**: ${rank}`, value: "\u200B"},
				{ name: `**XP**: ${xp} / ${(rank+1)**2}`, value: "\u200B"},
				{ name: `**Coins**: ${coins}`, value: "\u200B"},
			)
			.setThumbnail("https://github.com/akomi-dev/Kathryne/blob/main/assets/genshinLogoInverted.png?raw=true")
			.setTimestamp(new Date())

		await interaction.reply({ embeds: [embed] });
	},
};