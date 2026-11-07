import { decodeCrosshairShareCode } from 'csgo-sharecode'
import { z } from 'zod'

export const crosshairCodeSchema = z.string().trim().refine(
	(code) => {
		try {
			decodeCrosshairShareCode(code)
			return true
		} catch {
			return false
		}
	},
	{ message: 'Enter a valid crosshair code.' }
)

export const addCrosshairSchema = z.object({
	name: z.string(),
	crosshairCode: crosshairCodeSchema,
})

export const editCrosshairsSchema = z.object({
	crosshairs: z.array(
		z.object({
			id: z.number().optional(),
			name: z.string(),
			crosshair: crosshairCodeSchema,
			user_id: z.number().nullable(),
		})
	),
	crosshairsToDelete: z.array(z.number()),
})
