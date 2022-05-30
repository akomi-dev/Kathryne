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
				temp = genshindb.weapons(item = weapons[randIndexWeapons]);
				if (!ranks[authorId]["items"]["weapons"][item]) {
					ranks[authorId]["items"]["weapons"][item] = 1;
				} else {
					ranks[authorId]["items"]["weapons"][item] += 1;
				};
				image = temp.images.image || temp.images.cover1 || temp.images.cover2;
				rarity = temp.rarity;
				break;
			};
			case 1: 
			{
				const characters = genshindb.characters('names', { matchCategories: true });
				const randIndexCharacters = randNum(characters.length);
				temp = genshindb.characters(item = characters[randIndexCharacters]);
				if (!ranks[authorId]["items"]["characters"][item]) {
					ranks[authorId]["items"]["characters"][item] = 1;
				} else {
					ranks[authorId]["items"]["characters"][item] += 1;
				}
				image = temp.images.icon || temp.images.image || temp.images.awakenicon;
				rarity = temp.rarity;
				break;
			};
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