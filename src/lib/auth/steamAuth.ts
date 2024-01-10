import SteamAuth from 'node-steam-openid';

export const steamAuth = new SteamAuth({
	realm: `${process.env.NEXT_PUBLIC_DOMAIN}`,
	returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/authenticate`,
	apiKey: `${process.env.STEAM_API_KEY}`,
});
