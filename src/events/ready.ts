import { createEvent } from "@/types/Event.js"

export default createEvent({
    name: "clientReady",
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user?.tag}!`)
    },
})