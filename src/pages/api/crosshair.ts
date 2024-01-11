// GET - /api/crosshair

// POST - /api/crosshair
/*
    body: {
		crosshairs: DBTypes['crosshairs'][]
		crosshairsToDelete: number[]
    }
*/

import type { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '@lib/auth/session'
import kysely from '@lib/kysely'
import {
	GetCrosshairResponse,
	PostCrosshairResponse,
} from '@my-types/api-responses/Crosshair'
import { getIronSession } from 'iron-session'
import { User } from '@my-types/user'
import { EditCrosshairFormValues } from '@components/EditCrosshairsForm'

interface PostRequest extends NextApiRequest {
	body: EditCrosshairFormValues
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case 'GET': {
			return getCrosshairs(req, res)
		}

		case 'POST': {
			return postCrosshairs(req, res)
		}
	}
}

async function getCrosshairs(
	req: NextApiRequest,
	res: NextApiResponse<GetCrosshairResponse>
) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)
		if (sessionUser.id <= 0)
			throw new Error('You do not have access to this.')

		const crosshairs = await kysely
			.selectFrom('crosshairs')
			.selectAll()
			.where('crosshairs.user_id', '=', sessionUser.id)
			.execute()

		return res.status(200).json({ message: crosshairs, success: true })
	} catch (error: any) {
		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}

async function postCrosshairs(
	req: PostRequest,
	res: NextApiResponse<PostCrosshairResponse>
) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)
		if (sessionUser.id <= 0)
			throw new Error('You do not have access to this.')
		const { crosshairs, crosshairsToDelete } = req.body

		if (crosshairs.length <= 0 && crosshairsToDelete.length <= 0)
			throw new Error('There is nothing to update.')

		let response: string[] = []

		if (crosshairsToDelete.length > 0) {
			await kysely
				.deleteFrom('crosshairs')
				.where('id', 'in', crosshairsToDelete)
				.execute()

			response.push(
				`Successfully deleted ${crosshairsToDelete.length} crosshair(s)`
			)
		}

		if (crosshairs.length > 0) {
			await kysely
				.insertInto('crosshairs')
				.values(crosshairs)
				.onConflict((oc) =>
					oc.column('id').doUpdateSet((eb) => ({
						name: eb.ref('excluded.name'),
						crosshair: eb.ref('excluded.crosshair'),
					}))
				)
				.execute()

			response.push(`Upserted ${crosshairs.length} crosshair(s)`)
		}

		return res
			.status(200)
			.json({ message: response.join(', '), success: true })
	} catch (error: any) {
		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}
