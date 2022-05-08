const paginationEmbed = require("../../utils/Pagination");
const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = class Queue extends Interaction {
  constructor() {
    super({
      name: "queue",
      description: "Displays the queue of songs | by thijke#1234",
    });
  }

  async exec(int, data) {
    let channel = int.member.voice.channel;

    if (!channel)
      return int.reply({
        content: `${this.client.emotes.get(
          "nomic"
        )} You must be in a voice channel to use this command!`,
        ephemeral: true,
      });
    if (int.guild.me.voice.channel && channel !== int.guild.me.voice.channel)
      return int.reply({
        content: `${this.client.emotes.get(
          "nomic"
        )} You must be in the same voice channel as me to use this command!`,
        ephemeral: true,
      });

    let isAllowed = data.voiceChannels.find((c) => c === channel.id);

    if (data.voiceChannels.length > 0 && !isAllowed) {
      return int.reply({
        content: `${this.client.emotes.get(
          "nomic"
        )} You must be in one of the allowed voice channels to use this command!`,
        ephemeral: true,
      });
    }

    let queue = this.client.player.getQueue(int.guild.id);
    if (!queue || !queue.songs.length)
      return int.reply({
        content: "There is nothing in the queue!",
        ephemeral: true,
      });

    let btn1 = new MessageButton()
      .setCustomId("previousbtn")
      .setLabel("Previous")
      .setStyle("SECONDARY");

    const btn2 = new MessageButton()
      .setCustomId("nextbtn")
      .setLabel("Next")
      .setStyle("PRIMARY");

    let currentEmbedItems = [];
    let embedItemArray = [];
    let pages = [];

    let buttonList = [btn1, btn2];

    if (queue.songs.length > 11) {
      queue.songs.forEach((s, i) => {
        s.index = i;
        if (s.name !== queue.nowPlaying.name) {
          if (currentEmbedItems.length < 10) currentEmbedItems.push(s);
          else {
            embedItemArray.push(currentEmbedItems);
            currentEmbedItems = [s];
          }
        }
      });
      embedItemArray.push(currentEmbedItems);

      embedItemArray.forEach((x) => {
        let songs = x
          .map((s) => `[${s.index}. ${s.name}](${s.url})`)
          .join("\n");
        let emb = new MessageEmbed()
          .setTitle("Songs list")
          .setColor("#2f3136")
          .setThumbnail(int.guild.iconURL())
          .setDescription(
            `**Now playing**\n[**${queue.nowPlaying.name}**](${queue.nowPlaying.url})\n\n${songs}`
          );
        pages.push(emb);
      });

      await paginationEmbed(int, pages, buttonList);
    } else {
      let songs = queue.songs
        .map((s, i) => {
          if (s.name !== queue.nowPlaying.name) {
            return `[${i}. ${s.name}](${s.url})`;
          }
        })
        .join("\n");

      let emb = new MessageEmbed()
        .setTitle("Songs list")
        .setColor("#2f3136")
        .setThumbnail(int.guild.iconURL())
        .setDescription(
          `**Now playing**\n[**${queue.nowPlaying.name}**](${queue.nowPlaying.url})\n\n${songs}`
        )
        .setFooter("Page 1 / 1");
      return int.reply({ embeds: [emb] });
    }
  }
};
