import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import theme from '@lib/theme'
import DefaultLayout from '@layouts/DefaultLayout'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
			<Notifications />
			<DefaultLayout>
				<Component {...pageProps} />
			</DefaultLayout>
		</MantineProvider>
	)
}
