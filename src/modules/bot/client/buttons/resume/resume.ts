import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";

import IButton from "../../../interfaces/button.interface";
import ExtendedClient from "../../extended-client.interface";
import error from "../../../component/embed/error.embed";

const resumeButton: IButton = {
    data: new ButtonBuilder()
        .setCustomId('resume-button')
        .setLabel('▶️')
        .setStyle(ButtonStyle.Success),
    run: (client: ExtendedClient, interaction: ButtonInteraction) => {
        interaction.reply({
            embeds: [error(`You mustn't look this ${interaction.customId} interaction`)]
        });
    }
}

export default resumeButton;