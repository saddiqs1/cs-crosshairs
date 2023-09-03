import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import theme from '@lib/theme'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <Notifications />
            <Component {...pageProps} />
        </MantineProvider>
    )
}
