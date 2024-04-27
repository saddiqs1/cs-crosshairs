// POST - /api/crosshair-groups
/*
    body: { crosshairGroups: CrosshairGroup[] }
*/

import type { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '@lib/auth/session'
import kysely from '@lib/kysely'
import { getIronSession } from 'iron-session'
import { User } from '@my-types/user'
import { PostCrosshairGroupsResponse } from '@my-types/api-responses/CrosshairGroups'
import { DBTypes } from '@my-types/database'
import { CrosshairGroupPostBody } from '@lib/hooks/useCrosshairGroupPost'

interface PostRequest extends NextApiRequest {
	body: CrosshairGroupPostBody
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case 'POST': {
			return postCrosshairGroups(req, res)
		}
	}
}

async function postCrosshairGroups(
	req: PostRequest,
	res: NextApiResponse<PostCrosshairGroupsResponse>
) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)
		if (sessionUser.id <= 0)
			throw new Error('You do not have access to this.')
		const { crosshairGroups } = req.body

		const groups = crosshairGroups
			.map((cg, i) => {
				if (cg.group !== null) return { ...cg.group, order: i }
			})
			.filter((cg): cg is DBTypes['crosshair_groups'] => !!cg)

		await kysely
			.insertInto('crosshair_groups')
			.values(groups)
			.onConflict((oc) =>
				oc.column('id').doUpdateSet((eb) => ({
					name: eb.ref('excluded.name'),
					order: eb.ref('excluded.order'),
				}))
			)
			.execute()

		return res
			.status(200)
			.json({ message: 'Crosshair Groups Updated.', success: true })
	} catch (error: any) {
		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}
