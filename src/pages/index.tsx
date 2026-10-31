import { CrosshairConverter } from '@components/CrosshairConverter'
import { Stack, Text } from '@mantine/core'

export default function Home() {
	return (
		<Stack spacing={'xl'}>
			<Text ta={'center'} c={'dimmed'}>
				Paste a current or older crosshair code to copy commands or a
				share code for the latest CS2 update.
			</Text>
			<CrosshairConverter />
		</Stack>
	)
}
