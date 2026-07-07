import ApiManager from "@/core/ApiManager.js"

import { createCommand } from "@/types/Interaction.js"
import { ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"

function numberToEmoji(number: number): string {
    const emojis = ["🥇", "🥈", "🥉"]
    return emojis[number - 1] || `#${number}`
}

export const command = createCommand({
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays a playlist leaderboard.")
        .addStringOption(option =>
            option.setName("platform")
                .setDescription("The platform to get stats for")
                .setRequired(true)
                .setChoices(...ApiManager.platforms.options.map(platform => ({ name: platform, value: platform }))),
        )
        .addStringOption(option =>
            option.setName("playlist")
                .setDescription("The playlist to get stats for")
                .setRequired(true)
                .setChoices(...ApiManager.playlists.options.map(playlist => ({ name: playlist, value: playlist }))),
        ),
    async execute(client, interaction) {
        await interaction.deferReply()

        const platform = interaction.options.getString("platform", true)
        const playlist = interaction.options.getString("playlist", true)

        const response = await ApiManager.getLeaderboard(platform, playlist)

        if (response === null || response === "not_found") {
            await interaction.followUp({ content: "An error occurred while fetching stats" })
            return
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("# Leaderboard for " + playlist + " on " + platform),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        response.map((player, index) => `${numberToEmoji(index + 1)} **${player.username}**: \`${player.rating}\``).slice(0, 10).join("\n"),
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
