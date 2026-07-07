import ApiManager from "@/core/ApiManager.js"

import { createCommand } from "@/types/Interaction.js"
import { ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"

export const command = createCommand({
    data: new SlashCommandBuilder()
        .setName("players")
        .setDescription("Get players for a platform")
        .addStringOption(option =>
            option.setName("platform")
                .setDescription("The platform to get players for")
                .setRequired(true)
                .setChoices(...ApiManager.platforms.options.map(platform => ({ name: platform, value: platform }))),
        ),
    async execute(client, interaction) {
        await interaction.deferReply()
        
        const platform = interaction.options.getString("platform", true)
        
        const response = await ApiManager.getPlayers(platform)
        
        if (response === null || response === "not_found") {
            await interaction.followUp({ content: "An error occurred while fetching players" })
            return
        }
        
        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`# Players for ${platform}`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        response.players.map(player => `• ${player.playlist}: \`${player.players}\``).join("\n"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("-# API provided by [TonyKun](https://rapidapi.com/TonyKun7/api/rocket-league10)"),
            )

        await interaction.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 })
        return
    },
})