import path from "path"

import { isInteraction, loadRecursively } from "@/lib/utils.js"
import { syncApplicationCommands } from "@/services/commandDeployment.js"
import { InteractionType } from "@/types/Interaction.js"
import { fileURLToPath, pathToFileURL } from "url"

import type { AnyInteraction, Command } from "@/types/Interaction.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands: Command[] = []

try {
    const interactionFiles: string[] = []
    await loadRecursively(path.join(__dirname, "interactions"), interactionFiles)

    for (const file of interactionFiles) {
        const interactionModule = await import(pathToFileURL(file).href) as { [key: string]: AnyInteraction | any }

        const exports = Object.values(interactionModule)

        for (const item of exports) {
            if (isInteraction(item) && item.type === InteractionType.Command && "data" in item) {
                commands.push(item)
            }
        }
    }

    await syncApplicationCommands(commands, true)

} catch (error) {
    console.error("Error deploying commands:", error)
}