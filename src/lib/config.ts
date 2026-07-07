import "dotenv/config"

const rawConfig = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,

    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
}

for (const [key, value] of Object.entries(rawConfig)) {
    if (!value) {
        throw new Error(`❌ Missing environment variable: ${key}`)
    }
}

const config = rawConfig as { [K in keyof typeof rawConfig]: string }
export default config