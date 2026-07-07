import CustomClient from "@/core/CustomClient.js"
import config from "@/lib/config.js"

import { ActivityType, GatewayIntentBits } from "discord.js"

import type { ClientOptions } from "discord.js"

const options: ClientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
    presence: {
        activities: [
            {
                name: "Rocket League",
                type: ActivityType.Playing,
            },
        ],
    },
}

const client = new CustomClient(options)

client.start(config.DISCORD_TOKEN).catch(console.error)