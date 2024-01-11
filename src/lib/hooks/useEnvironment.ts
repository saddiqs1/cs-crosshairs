type Environment = { url: string; label: string; color: string }

const LOCAL = { url: 'http://localhost:3000', label: 'Local', color: 'yellow' }
const PROD = {
	url: 'https://cs-crosshairs.vercel.app/',
	label: 'Prod',
	color: 'green',
}

const ENVIRONMENTS: Environment[] = [LOCAL, PROD]

export function useEnvironment() {
	const env =
		ENVIRONMENTS.find((e) => e.url === process.env.NEXT_PUBLIC_DOMAIN) ??
		LOCAL

	return { env, isLocal: env.label === 'Local' }
}
