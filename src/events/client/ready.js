module.exports = class Ready extends Event {
    constructor() {
        super({
            name: "ready",
            once: false,
        });
    }

    async exec() {
        this.client.user.setActivity("/play || by thijke#1234", {
             type: "WATCHING",
        });

        let allMembers = new Set();
        this.client.guilds.cache.forEach((guild) => {
            guild.members.cache.forEach((member) => {
                allMembers.add(member.user.id);
            });
        });

        let allChannels = new Set();
        this.client.guilds.cache.forEach((guild) => {
            guild.channels.cache.forEach((channel) => {
                allChannels.add(channel.id);
            });
        });
        this.client.logger.log(`Connected into ${this.client.user.tag}`, {
            tag: "Ready",
        });
        this.client.logger.log(
            `CREATED BY THIJKE#1234 KEEP CREDITS! If consider using this Bot, make sure to credit me!!`,
            {
                tag: "Data",
            }
        );

        const guild = await this.client.guilds.fetch(process.env.EMOJIS_GUILD_ID);
        if (guild) {
            await this.client.loadEmotes(guild).then(() => {
                this.client.logger.log("Loaded emotes!", {tag: "Emotes"});
            });
        }

        for (const guild of this.client.guilds.cache.values()) {
            await this.client.loadInteractions(guild.id);
        }
    }
};
