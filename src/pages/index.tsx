import { CrosshairConverter } from '@components/CrosshairConverter'
import { Stack, Text } from '@mantine/core'

export default function Home() {
	return (
		<Stack spacing={'xl'}>
			<Text ta={'center'} c={'dimmed'}>
				Enter in your crosshair code below, and hit the button to
				receive the commands needed to enter in game to set that
				crosshair.
			</Text>
			<CrosshairConverter />
		</Stack>
	)
}
