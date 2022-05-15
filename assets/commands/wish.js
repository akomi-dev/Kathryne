const { SlashCommandBuilder } = require('@discordjs/builders');
const genshindb = require('genshin-db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wish')
		.setDescription('Wish for amazing rewards!')
		.addIntegerOption(option =>
			option.setName("quantity")
			      .setDescription("Quantity of wishes wanted: Must be 1, 5, or 10")
			      .setRequired(true)),
	async execute(interaction) {
		const wishAmt = interaction.options.get("quantity").value;
		const cost = wishAmt*100;
		
		const ranksJSON = "./assets/ranks.json";
		let ranks = require(ranksJSON);
		
		const write = (file, obj) => fs.writeFile(
			file, JSON.stringify(obj), err => { if (err) throw err; }
		);
		
		if (wishAmt == 1 || wishAmt == 5 || wishAmt == 10) {
			if (cost <= ranks[authorId]["coins"]) {
				ranks[authorId]["coins"] -= cost;
				for (let i=1; i <= wishAmt; i++) {
					// genshinDB items
				}
				write(ranksJSON, ranks);
			} else {
				await interaction.reply({
					content: 'Insufficient Coins!', 
					ephemeral: true
				});
			}
		} else {
			await interaction.reply({
				content: 'Quantity of wishes must be 1, 5, or 10', 
				ephemeral: true
			});
		};
	}
};