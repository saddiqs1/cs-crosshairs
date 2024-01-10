// /api/auth/login

import { steamAuth } from '@lib/auth/steamAuth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		try {
			const redirectUrl = await steamAuth.getRedirectUrl();
			return res.redirect(redirectUrl);
		} catch (error: any) {
			return res.json({
				message: new Error(error).message,
				success: false,
			});
		}
	}
}
