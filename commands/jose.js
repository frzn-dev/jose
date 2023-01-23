const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jose')
		.setDescription('jose'),
	async execute(interaction) {
		return interaction.reply('**j**o**s**e');
	},
};
