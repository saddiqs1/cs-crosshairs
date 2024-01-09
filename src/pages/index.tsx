import { CrosshairConverter } from '@components/CrosshairConverter'
import { CrosshairPreview } from '@components/CrosshairPreview'
import { Center, Group, Stack, Title } from '@mantine/core'

// const CROSSHAIR_CODES = [
// 	'CSGO-SBTJQ-Mv4Wj-RrEd9-hu2hX-PwUvD', // Thick T, huge gap
// 	'CSGO-78PT7-mHExG-UGt7C-HAhdB-GxuWK', // Cai crosshair
// 	'CSGO-obHU6-NLWyP-EtkUh-pywKV-TXQ3A', //yellow dot
// 	'CSGO-9r8iB-9WwzR-tndTZ-oQo6P-nysyM', // bluesmall
// 	'CSGO-Vk7Cz-XXVk2-ZcZZu-F7CoJ-AzZkF', // rhys
// ]

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
