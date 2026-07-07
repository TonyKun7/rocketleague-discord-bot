# Rocket League Bot

A TypeScript Discord bot that shows how easy it is to build a project around the **Rocket League API**.

## Purpose

This project proves that creating a rich, functional Discord bot doesn't have to be complicated. By combining **TypeScript**, **discord.js**, and the **[Rocket League API on RapidAPI](https://rapidapi.com/TonyKun7/api/rocket-league10)**, you get a useful and pleasant tool with minimal effort.

## What this project demonstrates

The main goal is to show how **easy it is to develop a project with the Rocket League API**. With just a few endpoints, the bot fetches live data (player stats, leaderboards, season stats, player counts) and displays it cleanly inside Discord.

An API call is as simple as:

```typescript
const response = await ApiManager.getStats(platform, username)
```

The rest of the code focuses on formatting and Discord interaction, not on API complexity.

## Features

The bot exposes several slash commands powered by the **Rocket League API** via RapidAPI:

- **`/help`** — Lists available commands.
- **`/stats <platform> <username>`** — Fetches a player's stats.
- **`/season-stats <platform> <username> <season>`** — Fetches a player's season stats.
- **`/leaderboard <platform> <playlist>`** — Displays a playlist leaderboard.
- **`/players <platform>`** — Shows player counts per playlist.
- **`/invite`** — Get the bot invite link and support server.

All replies use Discord's modern **Components V2 containers** for a clean, native look.

## Tech Stack

- **TypeScript** for typed, maintainable code.
- **discord.js v14** to talk to the Discord API.
- **ky** as a lightweight HTTP client.
- **Zod** to validate Rocket League API responses.
- **tsx** to run and watch the code during development.

## Architecture

```
src/
├── core/
│   ├── ApiManager.ts       # HTTP client + calls to the Rocket League API (RapidAPI)
│   └── CustomClient.ts     # Extended Discord client: auto-loads interactions and events
├── events/
│   ├── interactionCreate.ts
│   └── ready.ts
├── interactions/
│   ├── help.ts
│   ├── leaderboard.ts
│   ├── players.ts
│   ├── season-stats.ts
│   └── stats.ts
├── lib/
│   ├── config.ts
│   └── utils.ts
└── index.ts                # Entry point
```

`CustomClient` automatically:

- Scans the `src/interactions` folder to register slash commands.
- Scans the `src/events` folder to wire up Discord events.
- Syncs commands with Discord through the REST API.

So adding a new command is just a matter of dropping a file into `src/interactions`.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=your_discord_token
DISCORD_CLIENT_ID=your_discord_client_id
RAPIDAPI_KEY=your_rapidapi_key
```

Get your Rocket League API key from [RapidAPI](https://rapidapi.com/TonyKun7/api/rocket-league10).

### 3. Deploy slash commands

```bash
npm run deploy
```

### 4. Run in development

```bash
npm run dev
```

## Adding a Command

Create a file under `src/interactions/`:

```typescript
import { createCommand } from "@/types/Interaction.js"
import { SlashCommandBuilder } from "discord.js"

export const command = createCommand({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(client, interaction) {
        await interaction.reply("Pong!")
    },
})
```

Then restart the bot or run `npm run deploy` to sync the new command with Discord.

## Available Scripts

- `npm run dev` — Starts the bot with hot reload.
- `npm run deploy` — Deploys slash commands to Discord.
- `npm run build` — Compiles the project to JavaScript.
- `npm start` — Runs the compiled project.

## Docker

A `Dockerfile` is included for containerized deployment.

```bash
docker build -t rocket-league-bot .
docker run --env-file .env rocket-league-bot
```

## Invite & Support

- **[Invite the bot](https://discord.com/oauth2/authorize?client_id=1519992284811104318&permissions=0&integration_type=0&scope=bot+applications.commands)** to your own server.
- **[Join the support server](https://discord.gg/your-support-server)** if you need help or want to test the bot.

## API Reference

The bot uses the **[Rocket League API by TonyKun7 on RapidAPI](https://rapidapi.com/TonyKun7/api/rocket-league10)**.
