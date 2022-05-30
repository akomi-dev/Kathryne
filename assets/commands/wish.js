const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const genshindb = require('genshin-db');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wish')
		.setDescription('Wish for amazing rewards!'),

	async execute(interaction) {
		const cost = 100;
		
		const ranksJSON = require('path').resolve('assets', 'ranks.json');
		let ranks = require(ranksJSON);
		const authorId = interaction.user.id;
		
		const write = (file, obj) => fs.writeFile(
			file, JSON.stringify(obj), err => { if (err) throw err; }
		);
		
		if (cost > ranks[authorId]["coins"]) {
			return await interaction.reply({ content: 'Insufficient Coins!', ephemeral: true });
		};

		ranks[authorId]["coins"] -= cost;

		const randNum = range => Math.floor(Math.random()*range);
		let temp;
		let item;
		let image;
		let rarity;
		
		switch (randNum(2)) {
			case 0: 
			{
				const weapons = genshindb.weapons('names', { matchCategories: true });
				const randIndexWeapons = randNum(weapons.length);
				ranks[authorId]["items"].push(item = weapons[randIndexWeapons]);
				temp = genshindb.weapons(item);
				image = temp.images.image;
				rarity = temp.rarity;
			}
			case 1: 
			{
				const characters = genshindb.characters('names', { matchCategories: true });
				const randIndexCharacters = randNum(characters.length);
				ranks[authorId]["items"].push(item = characters[randIndexCharacters]);
				temp = genshindb.characters(item);
				image = temp.images.icon;
				rarity = temp.rarity;
			}
		};

		write(ranksJSON, ranks);

		const embed = new MessageEmbed()
			.setColor('#3bc2ca')
			.setTitle('Wish!')
			.setURL('https://www.hoyolab.com/home')
			.setAuthor({ 
				name: `${interaction.user.username}#${interaction.user.discriminator}`,
				iconURL: "https://github.com/akomi-dev/Kathryne/blob/main/assets/genshinLogoInverted.png?raw=true"
			})
			.setThumbnail(image)
			.addFields({ name: item, value: `${rarity} ⭐` })
			.setTimestamp(new Date())
		
		return await interaction.reply({ embeds: [embed] });
	}
};