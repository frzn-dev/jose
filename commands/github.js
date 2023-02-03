const axios = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jose = require("./jose");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("h")
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addStringOption(option => option.setName('user').setDescription('The user').setRequired(true))
        )
        .addSubcommand(subcommand =>
          subcommand
              .setName('repo')
              .setDescription('Info about a repository')
              .addStringOption(option => option.setName('user').setDescription('The user').setRequired(true))
              .addStringOption(option => option.setName('repo').setDescription('The repository').setRequired(true))
        ),
	async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        
        if (subCommand === "user") {
          const username = interaction.options.getString('user')
          try {
            const res = await axios.get(`https://api.github.com/users/${username}`);
            const user = res.data;
            const embed = new EmbedBuilder()
              .setColor("#ff9900")
              .setTitle(user.login)
              .setURL(user.html_url)
              .setThumbnail(user.avatar_url)
              .addFields({ name: "Repository Count", value: `${user.public_repos}`, inline: true})
              .setFooter({text: `Profile created at ${user.created_at}`});
            if (user.name) embed.addFields({ name: "Real Name", value: user.name, inline: true});
            if (user.bio) embed.setDescription(user.bio);
            if (user.blog) embed.addFields({ name: "Website", value: user.blog, inline: true});
            if (user.email) embed.addFields({ name: "Public Email", value: user.email, inline: true});
            return interaction.reply({embeds:[embed]});
          } catch (error) {
            console.error(error);
            return interaction.reply(`Error: Unable to retrieve information for ${username.replace("@", "(at)")}`);
          }
        } else if (subCommand === "repo") {
          const username = interaction.options.getString('user')
          const repository = interaction.options.getString('repo')
          try {
            const res = await axios.get(`https://api.github.com/repos/${username}/${repository}`);
            const lang_res = await axios.get(`https://api.github.com/repos/${username}/${repository}/languages`);
            const repo = res.data;
            const langs = lang_res.data;
            const embed = new EmbedBuilder()
              .setColor("#ff9900")
              .setTitle(repo.full_name)
              .setURL(repo.html_url)
              .setThumbnail(repo.owner.avatar_url)
              .addFields(
                { name: "Stars", value: `${repo.stargazers_count}`, inline: true},
                { name: "Watchers", value: `${repo.watchers_count}`, inline: true},
                { name: "Forks", value: `${repo.forks_count}`, inline: true}
              )
              .setFooter({text: `Repository created at ${repo.created_at}`});
            if (repo.description) embed.setDescription(`${repo.description} []()`);
            if (repo.homepage) embed.addFields({ name: "Website", value: repo.homepage, inline: true});
            if (repo.langs !== {}) embed.addFields({ name: "Languages", value: Object.keys(langs).join(", "), inline: true});
            if (repo.topics.length >= 1) embed.addFields({ name: "Topics", value: repo.topics.join(", "), inline: false});
            return interaction.reply({embeds:[embed]});
          } catch (error) {
            console.error(error);
            return interaction.reply(`Error: Unable to retrieve information for ${username.replace("@", "(at)")}/${repository.replace("@", "(at)")}`);
          }
        }

    }
};

/*const githubCommand = new SlashCommandBuilder()
  .setName("github")
  .setSubCommands([
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Get information about a GitHub user")
  ]);

exports.github = githubCommand;*/
