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
import { CrosshairItems, GetCrosshairResponse, PostCrosshairResponse } from '@my-types/api-responses/Crosshair'
import { getIronSession } from 'iron-session'
import { User } from '@my-types/user'
import { EditCrosshairFormValues } from '@components/EditCrosshairsForm'
import { sql } from 'kysely'
import { DBTypes } from '@my-types/database'

interface PostRequest extends NextApiRequest {
	body: EditCrosshairFormValues
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET': {
			return getCrosshairs(req, res)
		}

		case 'POST': {
			return postCrosshairs(req, res)
		}
	}
}

async function getCrosshairs(req: NextApiRequest, res: NextApiResponse<GetCrosshairResponse>) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)
		if (sessionUser.id <= 0) throw new Error('You do not have access to this.')

		// TODO - can we make the raw sql statements type safe helpers?
		const aggregatedCrosshairs = await kysely
			.with('aggregated_crosshairs', (db) =>
				db
					.selectFrom('crosshair_groups as cg')
					.select((eb) =>
						eb
							.case()
							.when('cg.id', 'is', null)
							.then('GROUP-NULL')
							.else(sql<string>`concat('GROUP-', cg.id)`)
							.end()
							.as('group')
					)
					.fullJoin('crosshairs as c', 'cg.id', 'c.crosshair_group_id')
					.select(sql<DBTypes['crosshairs'][]>`json_agg(c ORDER BY c."order")`.as('crosshairs'))
					.where('c.user_id', '=', sessionUser.id)
					.groupBy('cg.id')
					.orderBy(['cg.order'])
			)
			.selectFrom('aggregated_crosshairs')
			.select([sql<CrosshairItems>`jsonb_object_agg("group", "crosshairs")`.as('crosshairItems')])
			.executeTakeFirstOrThrow()

		const crosshairs = await kysely
			.selectFrom('crosshairs as c')
			.selectAll()
			.where('c.user_id', '=', sessionUser.id)
			.execute()

		const groups = await kysely
			.selectFrom('crosshair_groups as g')
			.selectAll()
			.where('g.user_id', '=', sessionUser.id)
			.orderBy(['g.order'])
			.execute()

		return res.status(200).json({
			message: { crosshairItems: aggregatedCrosshairs.crosshairItems, crosshairs: crosshairs, groups: groups },
			success: true,
		})
	} catch (error: any) {
		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}

async function postCrosshairs(req: PostRequest, res: NextApiResponse<PostCrosshairResponse>) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)
		if (sessionUser.id <= 0) throw new Error('You do not have access to this.')
		const { crosshairs, crosshairsToDelete } = req.body

		if (crosshairs.length <= 0 && crosshairsToDelete.length <= 0) throw new Error('There is nothing to update.')

		let response: string[] = []

		if (crosshairsToDelete.length > 0) {
			await kysely.deleteFrom('crosshairs').where('id', 'in', crosshairsToDelete).execute()

			response.push(`Successfully deleted ${crosshairsToDelete.length} crosshair(s)`)
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

		return res.status(200).json({ message: response.join(', '), success: true })
	} catch (error: any) {
		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}
