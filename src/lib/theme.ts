import { MantineThemeOverride } from '@mantine/core'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const theme: MantineThemeOverride = {
	fontFamily: inter.style.fontFamily,
}

export default theme
