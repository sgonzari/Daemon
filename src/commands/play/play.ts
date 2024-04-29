import { Client, CommandInteraction, CommandInteractionOptionResolver, ComponentType, GuildMember, MessageComponentInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import ICommand from "../../interfaces/command.interface";
import notInVoiceChat from "../../component/embed/not-voice-chat.embed";
import musicInfo from "../../component/embed/music-info.embed";
import playGroupButton from "../../component/buttons/play-group.button";
import { handleButtonAction } from "../../component/buttons/handlers/button.handler";
import { musicClient } from "../..";
import SongNotFoundException from "../../music/apis/exceptions/song-not-found.exception";

const playCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play a song')
        .addStringOption((option: SlashCommandStringOption): SlashCommandStringOption => (
            option
                .setName('query')
                .setDescription('add name/url of song')
                .setRequired(true)
        )),
    run: async (client: Client, interaction: CommandInteraction) => {
        const member: GuildMember = (interaction.member as GuildMember);

        if (!member.voice.channel) {
            interaction.reply({
                embeds: [notInVoiceChat(client, interaction)]
            });
            return;
        }

        const reply = await interaction.reply({
            embeds: [musicInfo(client, interaction, 'play')],
            components: [playGroupButton]
        });

        // Query + music
        const query: string | null = (interaction.options as CommandInteractionOptionResolver).getString('query');

        if (!query) return; // TODO: Respuesta del mensaje

        try {
            await musicClient.playSong(member.voice.channel, query);
        } catch (error: any) {
            switch (error.constructor) {
                case SongNotFoundException:
                    await interaction.followUp({ content: error.message, ephemeral: true });
                    break;
                default:
                    console.error('Error reproduciendo la canción:', error);
                    await interaction.followUp({ content: 'No se pudo reproducir la canción.', ephemeral: true });
                    break;
            }
            return;
        }
        // End Query + music

        // TODO: Refactor collector
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button
        });

        collector.on('collect', (interactionCollector: MessageComponentInteraction) => {
            handleButtonAction(interactionCollector);
        });
    }


};

export default playCommand;