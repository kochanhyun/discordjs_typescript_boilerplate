import { Client, Events } from "discord.js";

import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";

// Event handlers
import { handleMessageCreate } from "./events/messageCreate";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMembers", "GuildVoiceStates"],
});

client.once(Events.ClientReady, () => {
    console.log("Discord bot is ready! 🤖");
    console.log("Started refreshing application (/) commands.");
    for (const guild of client.guilds.cache.values()) {
        try {
            deployCommands({ guildId: guild.id });
        } catch (error) {
            console.error(`Failed to deploy commands to guild ${guild.id}:`, error);
        }
    }
    console.log("Successfully reloaded application (/) commands.");
});


client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

// 인터랙션 핸들러
client.on(Events.InteractionCreate, async (interaction) => {
    try {
        // 슬래시 커맨드 체크
        if (!interaction.isChatInputCommand()) return;

        const command = commands[interaction.commandName as keyof typeof commands];
        if (!command) return;

        // 옵션 처리를 포함한 명령어 실행
        await command.execute(interaction).catch(async (error) => {
            console.error(`Error executing command ${interaction.commandName}:`, error);

            // 이미 응답된 경우 followUp 사용
            const replyMethod = interaction.replied ? 'followUp' : 'reply';
            await interaction[replyMethod]({
                content: '명령어 실행 중 오류가 발생했습니다.',
                ephemeral: true
            });
        });

    } catch (error) {
        console.error('Error handling interaction:', error);
    }
});

// Event listners
client.on(Events.MessageCreate, handleMessageCreate);


client.login(config.DISCORD_TOKEN);