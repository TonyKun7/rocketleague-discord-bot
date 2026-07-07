import config from "@/lib/config.js"

import { REST, Routes } from "discord.js"

import type { Command } from "@/types/Interaction.js"
import type { APIApplicationCommand, APIApplicationCommandOption, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js"

const comparableCommandFields = [
    "name",
    "description",
    "name_localizations",
    "description_localizations",
    "options",
    "default_member_permissions",
] as const

function normalizeValue(value: unknown): unknown {
    if (value === undefined || value === null) return undefined

    if (Array.isArray(value)) {
        const normalized = value
            .map(item => normalizeValue(item))
            .filter(item => item !== undefined)

        return normalized.length > 0 ? normalized : undefined
    }

    if (typeof value === "object") {
        const normalized: Record<string, unknown> = {}

        for (const [key, item] of Object.entries(value)) {
            if (key === "id" || key === "application_id" || key === "guild_id" || key === "version") continue
            if (key === "default_permission") continue
            if (key === "name_localized" || key === "description_localized") continue
            if ((key === "required" || key === "autocomplete" || key === "nsfw") && item === false) continue

            const nextValue = normalizeValue(item)

            if (nextValue !== undefined) {
                normalized[key] = nextValue
            }
        }

        const sortedKeys = Object.keys(normalized).sort()

        if (sortedKeys.length === 0) return undefined

        return sortedKeys.reduce<Record<string, unknown>>((sorted, key) => {
            sorted[key] = normalized[key]
            return sorted
        }, {})
    }

    return value
}

function normalizeOptions(options: readonly APIApplicationCommandOption[] | RESTPostAPIChatInputApplicationCommandsJSONBody["options"]): unknown {
    return normalizeValue(options?.map(option => ({
        ...option,
        required: "required" in option ? option.required : undefined,
        autocomplete: "autocomplete" in option ? option.autocomplete : undefined,
        options: "options" in option ? normalizeOptions(option.options) : undefined,
        choices: "choices" in option ? option.choices : undefined,
    })))
}

function normalizeCommand(command: RESTPostAPIChatInputApplicationCommandsJSONBody | APIApplicationCommand): Record<string, unknown> {
    const normalized: Record<string, unknown> = {}

    for (const field of comparableCommandFields) {
        const value = field === "options"
            ? normalizeOptions(command.options)
            : normalizeValue(command[field])

        if (value !== undefined) {
            normalized[field] = value
        }
    }

    return normalized
}

function serializeCommands(commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody | APIApplicationCommand>): string {
    return JSON.stringify(commands.map(normalizeCommand).toSorted((a, b) => {
        const left = a.name as string
        const right = b.name as string

        return left.localeCompare(right)
    }))
}

function getCommandsPayload(commands: Command[]): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    return commands.map(command => command.data.toJSON())
}

function getChangedCommandNames(
    payload: RESTPostAPIChatInputApplicationCommandsJSONBody[],
    currentCommands: APIApplicationCommand[],
): string[] {
    const currentByName = new Map(currentCommands.map(command => [command.name, JSON.stringify(normalizeCommand(command))]))

    return payload
        .filter(command => JSON.stringify(normalizeCommand(command)) !== currentByName.get(command.name))
        .map(command => command.name)
}

async function syncApplicationCommands(commands: Command[], force = false): Promise<boolean> {
    const payload = getCommandsPayload(commands)
    const nextHash = serializeCommands(payload)
    const rest = new REST().setToken(config.DISCORD_TOKEN)
    const currentCommandsRoute = `${Routes.applicationCommands(config.DISCORD_CLIENT_ID)}?with_localizations=true` as `/${string}`
    const currentCommands = await rest.get(currentCommandsRoute) as APIApplicationCommand[]
    const currentHash = serializeCommands(currentCommands)

    if (!force && currentHash === nextHash) {
        console.log("Slash commands are already synced with Discord.")
        return false
    }

    if (!force) {
        console.log(`Changed slash commands: ${getChangedCommandNames(payload, currentCommands).join(", ")}`)
    }

    console.log(`Deploying ${payload.length} slash commands...`)

    const deployedCommands = await rest.put(
        Routes.applicationCommands(config.DISCORD_CLIENT_ID),
        { body: payload },
    ) as RESTPostAPIChatInputApplicationCommandsJSONBody[]

    console.log(`Successfully deployed ${deployedCommands.length} slash commands.`)

    return true
}

export { getCommandsPayload, syncApplicationCommands }
