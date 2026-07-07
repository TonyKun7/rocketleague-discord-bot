import config from "@/lib/config.js"
import ky, { isHTTPError } from "ky"

import { playersSchema, leaderboardSchema, statsSchema, platformSchema, playlistSchema, seasonSchema, statsSeasonSchema } from "@/types/RocketLeague.js"

import type { z } from "zod"

class ApiManager {
    private client: typeof ky
    
    public constructor() {
        this.client = ky.create({
            prefixUrl: "https://rocket-league10.p.rapidapi.com/",
            headers: {
                "X-RapidAPI-Key": config.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "rocket-league10.p.rapidapi.com",
                "Content-Type": "application/json",
            },
        })
    }

    public platforms = platformSchema
    public playlists = playlistSchema
    public seasons = seasonSchema
    
    private async get<T>(url: string, schema: z.ZodType<T>): Promise<T | "not_found" | null> {
        try {
            const response = await this.client.get(url).json()
            return schema.parse(response)
        } catch (error) {
            console.error(error)
            if (isHTTPError(error)) {
                if (error.response.status === 404 && error.response.statusText === "Not Found") {
                    return "not_found"
                }
            }
            return null
        }
    }

    public getLeaderboard(platform: string, playlist: string) {
        return this.get(`leaderboard/${platform}/${playlist}`, leaderboardSchema)
    }

    public getPlayers(platform: string) {
        return this.get(`players/${platform}`, playersSchema)
    }

    public getStats(platform: string, username: string) {
        return this.get(`stats/${platform}/${username}`, statsSchema)
    }

    public getStatsSeason(platform: string, username: string, season: number) {
        return this.get(`stats/${platform}/${username}/${season}`, statsSeasonSchema)
    }
}

export default new ApiManager()