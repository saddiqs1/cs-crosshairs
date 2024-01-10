// /api/auth/user

import { User, sessionOptions } from '@lib/auth/session'
import db from '@lib/kysely'
import { getIronSession } from 'iron-session'
import { sql } from 'kysely'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case 'GET': {
			return getUser(req, res)
		}
	}
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
	try {
		const sessionUser = await getIronSession<User>(req, res, sessionOptions)

		if (!sessionUser) {
			throw new Error('Session user does not exist.')
		}

		const user = await db
			.selectFrom('users')
			.selectAll()
			.where('id', '=', sessionUser.id)
			.executeTakeFirstOrThrow()

		await db
			.updateTable('users')
			.set({
				latest_login_at: sql`NOW()`,
			})
			.where('id', '=', sessionUser.id)
			.execute()

		const currentUser: User = {
			id: user.id,
			username: sessionUser.username,
			avatarUrl: sessionUser.avatarUrl,
		}

		return res.status(200).json({ message: currentUser, success: true })
	} catch (error: any) {
		const session = await getIronSession(req, res, sessionOptions)
		session.destroy()

		return res.json({
			message: new Error(error).message,
			success: false,
		})
	}
}
