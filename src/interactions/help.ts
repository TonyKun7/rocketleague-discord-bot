import { isCommand } from "@/lib/utils.js"
import { createCommand } from "@/types/Interaction.js"
import { ContainerBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"

export const command = createCommand({
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help"),
    async execute(client, interaction) {
        await interaction.deferReply()

        const commands = client.interactions.filter(interaction => isCommand(interaction))

        const registeredCommands = await interaction.client.application.commands.fetch()
        const commandListing = commands.map(command => {
            const registered = registeredCommands.find(cmd => cmd.name === command.data.name)
            return registered ? `• </${command.data.name}:${registered.id}> - ${command.data.description}` : `• \`/${command.data.name}\` - ${command.data.description}`
        }).join("\n")

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("# Available Commands"),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(commandListing),
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