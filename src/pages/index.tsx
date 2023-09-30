import { CrosshairConverter } from '@components/CrosshairConverter'
import { Center, Stack, Title } from '@mantine/core'

export default function Home() {
	return (
		<Center h={'100vh'}>
			<Stack spacing={'xl'}>
				<Title order={1} ta={'center'}>
					CS2 Crosshair Converter
				</Title>
				<CrosshairConverter />
			</Stack>
		</Center>
	)
}
