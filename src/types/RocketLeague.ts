import { z } from "zod"

export const statsSchema = z.object({
    username: z.string(),
    lifetime: z.object({
        wins: z.number(),
        goals: z.number(),
        saves: z.number(),
        assists: z.number(),
        shots: z.number(),
        mvps: z.number(),
    }),
    ranked: z.array(
        z.object({
            playlistName: z.string(),
            playlistId: z.number(),
            tier: z.string(),
            division: z.string(),
            rating: z.number(),
            peakRating: z.number(),
            peakTier: z.string(),
            peakDivision: z.string(),
            matchesPlayed: z.number(),
        }),
    ),
    additional: z.array(
        z.object({
            playlistName: z.string(),
            playlistId: z.number(),
            tier: z.string(),
            division: z.string(),
            rating: z.number(),
            peakRating: z.number(),
            peakTier: z.string(),
            peakDivision: z.string(),
            matchesPlayed: z.number(),
        }),
    ),
})

export const statsSeasonSchema = z.object({
    username: z.string(),
    season: z.number(),
    ranked: z.array(
        z.object({
            playlistName: z.string(),
            playlistId: z.number(),
            tier: z.string(),
            division: z.string(),
            rating: z.number(),
            peakRating: z.number(),
            peakTier: z.string(),
            peakDivision: z.string(),
            matchesPlayed: z.number(),
        }),
    ),
    additional: z.array(
        z.object({
            playlistName: z.string(),
            playlistId: z.number(),
            tier: z.string(),
            division: z.string(),
            rating: z.number(),
            peakRating: z.number(),
            peakTier: z.string(),
            peakDivision: z.string(),
            matchesPlayed: z.number(),
        }),
    ),
})

export const playersSchema = z.object({
    platform: z.string(),
    players: z.array(
        z.object({
            playlist: z.string(),
            players: z.number(),
        }),
    ),
})

export const leaderboardSchema = z.array(
    z.object({
        id: z.string().optional(),
        username: z.string().optional(),
        rating: z.number(),
    }),
)

export const platformSchema = z.enum(["all", "steam", "epic", "xbox", "ps4", "switch"])
export const playlistSchema = z.enum([
    "ranked-1v1",
    "ranked-2v2",
    "ranked-3v3",
    "ranked-4v4",
    "hoops",
    "rumble",
    "dropshot",
    "snowday",
])
export const seasonSchema = z.enum(Array.from({ length: 36 }, (_, i) => (i + 1).toString()))
