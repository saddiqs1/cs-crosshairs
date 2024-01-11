// GET - /api/crosshair

// POST - /api/crosshair
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
import {
	GetCrosshairResponse,
	PostCrosshairResponse,
} from '@my-types/api-responses/Crosshair'
import { getIronSession } from 'iron-session'
import { User } from '@my-types/user'

interface PostRequest extends NextApiRequest {
	body: AddCrosshairFormValues
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
			return postCrosshair(req, res)
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

async function postCrosshair(
	req: PostRequest,
	res: NextApiResponse<PostCrosshairResponse>
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
