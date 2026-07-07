import path from "path"

import { isInteraction, loadRecursively } from "@/lib/utils.js"
import { syncApplicationCommands } from "@/services/commandDeployment.js"
import { InteractionType } from "@/types/Interaction.js"
import { Client, Collection } from "discord.js"
import { fileURLToPath } from "url"
import { pathToFileURL } from "url"

import type { AnyInteraction, Autocomplete, Button, Command, Modal, SelectMenu } from "@/types/Interaction.js"
import type { ClientOptions } from "discord.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class CustomClient extends Client {
    public interactions: Collection<string, Command | Button | SelectMenu | Modal | Autocomplete>
    public rateLimits: Collection<string, number[]>

    public constructor(options: ClientOptions) {
        super(options)
        this.interactions = new Collection()
        this.rateLimits = new Collection()
    }

    private async loadInteractions(): Promise<void> {
        const interactionFiles: string[] = []
        const commands: Command[] = []
        const interactionsPath = path.join(__dirname, "..", "interactions")

        await loadRecursively(interactionsPath, interactionFiles)

        for (const file of interactionFiles) {
            const interactionModule = await import(pathToFileURL(file).href) as { [key: string]: AnyInteraction | any }
        
            const exports = Object.values(interactionModule)

            for (const item of exports) {
                if (isInteraction(item)) {
                    if (item.type === InteractionType.Command && "data" in item) {
                        this.interactions.set(`${item.type}:${item.data.name}`, item)
                        commands.push(item)
                    } else if ("customId" in item) {
                        this.interactions.set(`${item.type}:${item.customId}`, item)
                    }
                }
            }
        }

        await syncApplicationCommands(commands)
    }

    private async loadEvents(): Promise<void> {
        const eventFiles: string[] = []
        const eventsPath = path.join(__dirname, "..", "events")

        await loadRecursively(eventsPath, eventFiles)

        for (const file of eventFiles) {
            const eventModule = await import(pathToFileURL(file).href)
            const event = eventModule.default

            if (event && event.name && event.execute) {
                const handler = (...args: any[]) => event.execute(this, ...args)

                if (event.once) {
                    this.once(event.name, handler)
                } else {
                    this.on(event.name, handler)
                }
            }
        }
    }

    public async start(token: string): Promise<void> {
        await this.loadInteractions()
        await this.loadEvents()
        await this.login(token)
    }
}

export default CustomClient