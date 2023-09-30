import { CrosshairConverter } from '@components/CrosshairConverter'
import { CrosshairPreview } from '@components/CrosshairPreview'
import { Center, Group, Stack, Title } from '@mantine/core'

const CROSSHAIR_CODES = [
	'CSGO-78PT7-mHExG-UGt7C-HAhdB-GxuWK', // Cai crosshair
	// 'CSGO-9r8iB-9WwzR-tndTZ-oQo6P-nysyM', // bluesmall
]

export default function Home() {
	return (
		<Center h={'100vh'}>
			<Stack spacing={'xl'}>
				<Title order={1} ta={'center'}>
					CS2 Crosshair Converter
				</Title>
				<CrosshairConverter />
				<Group spacing={'md'}>
					{CROSSHAIR_CODES.map((c, i) => (
						<CrosshairPreview crosshairCode={c} key={i} />
					))}
				</Group>
			</Stack>
		</Center>
	)
}
