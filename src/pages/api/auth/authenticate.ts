// /api/auth/authenticate

import { NextApiRequest, NextApiResponse } from 'next'
import { getIronSession } from 'iron-session'
import { steamAuth } from '@lib/auth/steamAuth'
import { sessionOptions } from '@lib/auth/session'
import db from '@lib/kysely'
import { User } from '@my-types/user'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		try {
			const steamUser = await steamAuth.authenticate(req)

			const demodiveId = await retrieveOrCreateUser(steamUser.steamid)
			const session = await getIronSession<User>(req, res, sessionOptions)

			session.id = demodiveId
			session.username = steamUser.username
			session.avatarUrl = steamUser.avatar.large

			await session.save()

			return res.redirect('/manager')
		} catch (error: any) {
			return res.redirect(`/?loginError=true`)
		}
	}
}

async function retrieveOrCreateUser(steamUserId: string) {
	const existingUser = await db
		.selectFrom('users')
		.select('id')
		.where('steam_uid', '=', steamUserId)
		.executeTakeFirst()

	if (existingUser) {
		return existingUser.id
	}

	const newUser = await db
		.insertInto('users')
		.values({ steam_uid: steamUserId })
		.returning('id')
		.executeTakeFirst()

	if (newUser) {
		return newUser.id
	}

	throw new Error('Error creating/retrieving user from database.')
}
