import fs from "fs"
import path from "path"

import { InteractionType } from "@/types/Interaction.js"

import type { AnyInteraction, Command } from "@/types/Interaction.js"
async function loadRecursively(dir: string, filesRec: string[]): Promise<void> {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
    
        if (stat.isDirectory()) {
            await loadRecursively(filePath, filesRec)
        } else if (file.endsWith(".js") || (file.endsWith(".ts") && !file.endsWith(".d.ts"))) {
            filesRec.push(filePath)
        }
    }
}

function isInteraction(item: any): item is AnyInteraction {
    return item && typeof item === "object" && "type" in item && "execute" in item
}

function isCommand(item: AnyInteraction): item is Command {
    return item.type === InteractionType.Command
}

export { isCommand, isInteraction, loadRecursively }