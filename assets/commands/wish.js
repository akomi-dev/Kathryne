const { SlashCommandBuilder } = require('@discordjs/builders');
const genshindb = require('genshin-db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wish')
		.setDescription('Wish for amazing rewards!')
		.addIntegerOption(opt =>
			opt.setName("quantity")
			   .setDescription("Quantity of wishes wanted: Must be 1, 5, or 10")
			   .setRequired(true)),
	async execute(interaction) {
		const wishAmt = interaction.options.get("quantity").value
		
		if (wishAmt == 1 || wishAmt == 5 || wishAmt == 10) {
			await interaction.reply("REWARDS!!");
		} else {
			await interaction.reply(
				{ 
					content: 'Quantity of wishes must be 1, 5, or 10', 
					ephemeral: true 
				}
			);
		};
	}
};