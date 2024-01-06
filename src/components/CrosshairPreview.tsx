import { copy } from '@lib/copy'
import { Box, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
const csgoSharecode = require('csgo-sharecode')
import { RenderCrosshair } from './RenderCrosshair'

type Props = {
	crosshairCode: string
}

export const CrosshairPreview: React.FC<Props> = ({ crosshairCode }) => {
	const crosshair = csgoSharecode.decodeCrosshairShareCode(crosshairCode)

	const onClick = () => {
		try {
			const crosshairCommands = csgoSharecode
				.crosshairToConVars(crosshair)
				.replaceAll('\n', ';')

			copy(crosshairCommands)

			notifications.show({
				title: 'Crosshair Copied',
				message: 'Crosshair is copied to your clipboard',
				color: 'green',
			})
		} catch (error: any) {
			notifications.show({
				title: 'Error Copying Crosshair',
				message: 'Crosshair input is in an incorrect format',
				color: 'red',
			})
		}
	}

	return (
		<Box onClick={onClick}>
			<RenderCrosshair crosshair={crosshair} size={100} />
			<Text>
				{crosshairCode} - {crosshair.gap}
			</Text>
		</Box>
	)
}
