// /api/auth/logout

import { sessionOptions } from '@lib/auth/session'
import { getIronSession } from 'iron-session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		try {
			const session = await getIronSession(req, res, sessionOptions)
			session.destroy()
			return res.redirect('/')
		} catch (error: any) {
			return res.json({
				message: new Error(error).message,
				success: false,
			})
		}
	}
}
