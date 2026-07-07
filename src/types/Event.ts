import type CustomClient from "@/core/CustomClient"

import type { ClientEvents } from "discord.js"

export interface Event<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (client: CustomClient, ...args: ClientEvents[K]) => Promise<void> | void;
}

export const createEvent = <K extends keyof ClientEvents>(event: Event<K>) => event