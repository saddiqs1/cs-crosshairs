import { CrosshairPreview } from '@components/CrosshairPreview'
import { Group } from '@mantine/core'

const CROSSHAIR_CODES = [
	'CSGO-SBTJQ-Mv4Wj-RrEd9-hu2hX-PwUvD', // Thick T, huge gap
	'CSGO-78PT7-mHExG-UGt7C-HAhdB-GxuWK', // Cai crosshair
	'CSGO-obHU6-NLWyP-EtkUh-pywKV-TXQ3A', //yellow dot
	'CSGO-9r8iB-9WwzR-tndTZ-oQo6P-nysyM', // bluesmall
	'CSGO-Vk7Cz-XXVk2-ZcZZu-F7CoJ-AzZkF', // rhys
]

export default function Manager() {
	return (
		<Group spacing={'xl'}>
			{CROSSHAIR_CODES.map((c, i) => (
				<CrosshairPreview crosshairCode={c} key={i} />
			))}
		</Group>
	)
}
