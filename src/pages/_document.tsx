import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en' {...mantineHtmlProps}>
			<Head>
				<ColorSchemeScript forceColorScheme='dark' />
				<link rel='icon' href='/favicon.ico' sizes='any' />
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon-32.png'
				/>
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/apple-touch-icon.png'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
