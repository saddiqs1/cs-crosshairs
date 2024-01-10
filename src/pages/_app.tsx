import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import theme from '@lib/theme'
import DefaultLayout from '@layouts/DefaultLayout'
import { useUser } from '@lib/hooks/useUser'
import { UserContext } from '@contexts/UserContext'

export default function App({ Component, pageProps }: AppProps) {
	const { user, isLoading } = useUser()

	return (
		<UserContext.Provider value={{ user, isLoading }}>
			<MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
				<Notifications />
				<DefaultLayout>
					<Component {...pageProps} />
				</DefaultLayout>
			</MantineProvider>
		</UserContext.Provider>
	)
}
