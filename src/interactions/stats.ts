import ApiManager from "@/core/ApiManager.js"

import { createCommand } from "@/types/Interaction.js"
import { ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"

export const command = createCommand({
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get stats for a player")
        .addStringOption(option =>
            option.setName("platform")
                .setDescription("The platform to get stats for")
                .setRequired(true)
                .setChoices(...ApiManager.platforms.options.filter(platform => platform !== "all").map(platform => ({ name: platform, value: platform }))),
        )
        .addStringOption(option =>
            option.setName("username")
                .setDescription("The username to get stats for")
                .setRequired(true),
        ),
    async execute(client, interaction) {
        await interaction.deferReply()

        const platform = interaction.options.getString("platform", true)
        const username = interaction.options.getString("username", true)

        const response = await ApiManager.getStats(platform, username)
        if (response === "not_found") {
            await interaction.followUp({ content: "Player not found" })
            return
        }

        if (response === null) {
            await interaction.followUp({ content: "An error occurred while fetching stats" })
            return
        }

        console.log(response)

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("# Stats for " + response.username),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`## Overall Stats\n👑 \`${response.lifetime.wins}\` wins | ⚽ \`${response.lifetime.goals}\` goals | 💾 \`${response.lifetime.saves}\` saves\n🤝🏻 \`${response.lifetime.assists}\` assists | 🎯 \`${response.lifetime.shots}\` shots | ⭐ \`${response.lifetime.mvps}\` mvps`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        [
                            "## Ranked Stats",
                            response.ranked.length === 0 ?
                                "No ranked stats" :
                                response.ranked.map((rank) => `**${rank.playlistName}**\n↪ Actual: \`${rank.tier}\` \`${rank.division}\` \`${rank.rating}\`\n↪ Peak: \`${rank.peakTier}\` \`${rank.peakDivision}\` \`${rank.peakRating}\``).join("\n"),
                        ].join("\n"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        [
                            "## Additional Stats",
                            response.additional.length === 0 ?
                                "No additional stats" :
                                response.additional.map((stat) => `**${stat.playlistName}**: \`${stat.tier}\` \`${stat.division}\` \`${stat.rating}\``).join("\n"),
                        ].join("\n"),
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