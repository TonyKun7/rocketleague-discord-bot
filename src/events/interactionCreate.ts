import { createEvent } from "@/types/Event.js"
import { InteractionType } from "@/types/Interaction.js"
import { MessageFlags } from "discord.js"

import type { Autocomplete, Button, Command, Modal, SelectMenu } from "@/types/Interaction.js"

const RATE_LIMIT = 5
const RATE_LIMIT_WINDOW = 60 * 60 * 1000

export default createEvent({
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        try {
            let action: Command | Button | SelectMenu | Modal | Autocomplete | undefined

            if (interaction.isChatInputCommand()) action = client.interactions.get(`${InteractionType.Command}:${interaction.commandName}`) as Command
            else if (interaction.isButton()) action = client.interactions.get(`${InteractionType.Button}:${interaction.customId}`) as Button
            else if (interaction.isStringSelectMenu()) action = client.interactions.get(`${InteractionType.SelectMenu}:${interaction.customId}`) as SelectMenu
            else if (interaction.isModalSubmit()) action = client.interactions.get(`${InteractionType.Modal}:${interaction.customId}`) as Modal
            else if (interaction.isAutocomplete()) action = client.interactions.get(`${InteractionType.Autocomplete}:${interaction.commandName}`) as Autocomplete
            
            if (action) {
                if (interaction.isChatInputCommand() && interaction.commandName !== "help") {
                    const now = Date.now()
                    const timestamps = client.rateLimits.get(interaction.user.id) ?? []
                    const recentTimestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW)

                    if (recentTimestamps.length >= RATE_LIMIT) {
                        await interaction.reply({ content: "You have reached the limit of 5 interactions per hour. Please try again later.", flags: MessageFlags.Ephemeral })
                        return
                    }

                    recentTimestamps.push(now)
                    client.rateLimits.set(interaction.user.id, recentTimestamps)
                }

                await action.execute(client, interaction as any)
            }

        } catch (error) {
            console.error("Error handling interaction:", error)
        }
    },
})