import { User } from '@my-types/user'
import { SessionOptions } from 'iron-session'

export const sessionOptions: SessionOptions = {
	password: process.env.SESSION_SECRET ?? '',
	cookieName: 'cs-crosshairs',
	cookieOptions: {
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		secure: process.env.NODE_ENV === 'production',
	},
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
	interface IronSessionData {
		user?: User
	}
}
