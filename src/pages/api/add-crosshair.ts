// POST - /api/add-crosshair
/*
    body: {
		name: string
		crosshairCode: string
    }
*/

import type { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '@lib/auth/session'
import kysely from '@lib/kysely'
import { AddCrosshairFormValues } from '@components/AddCrosshairForm'
import { getIronSession } from 'iron-session'
import { User } from '@my-types/user'
import { PostAddCrosshairResponse } from '@my-types/api-responses/AddCrosshair'

interface PostRequest extends NextApiRequest {
	body: AddCrosshairFormValues
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case 'POST': {
			return postAddCrosshair(req, res)
		}
	}
}

async function postAddCrosshair(
	req: PostRequest,
	res: NextApiResponse<PostAddCrosshairResponse>
) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)
		if (sessionUser.id <= 0)
			throw new Error('You do not have access to this.')
		const { crosshairCode, name } = req.body

		await kysely
			.insertInto('crosshairs')
			.values({ crosshair: crosshairCode, name, user_id: sessionUser.id })
			.execute()

		return res
			.status(200)
			.json({ message: 'Crosshair added successfully!', success: true })
	} catch (error: any) {
		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}
