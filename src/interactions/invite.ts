import { isCommand } from "@/lib/utils.js"
import { createCommand } from "@/types/Interaction.js"
import { ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"

export const command = createCommand({
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Get the bot invite link and support server."),
    async execute(client, interaction) {
        await interaction.deferReply()

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("# Invite Link"),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent("Invite the bot to your server"),
                    ).setButtonAccessory(
                        new ButtonBuilder()
                            .setLabel("Invite")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://discord.com/oauth2/authorize?client_id=1519992284811104318&permissions=0&integration_type=0&scope=bot+applications.commands"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent("Need help? Join our support server"),
                    ).setButtonAccessory(
                        new ButtonBuilder()
                            .setLabel("Support Server")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://discord.gg/your-support-server"),
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