import { copy } from '@lib/copy'
import { Box, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
const csgoSharecode = require('csgo-sharecode')
import { RenderCrosshair } from './RenderCrosshair'
import { RenderCrosshairCanvas } from './RenderCrosshairCanvas'

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
		<Box>
			<RenderCrosshair
				onClick={onClick}
				crosshair={crosshair}
				size={100}
			/>
			<RenderCrosshairCanvas
				onClick={onClick}
				crosshair={crosshair}
				size={100}
			/>
			<Text>size: {crosshair.length}</Text>
			<Text>thickness: {crosshair.thickness}</Text>
			<Text>gap: {crosshair.gap}</Text>
			<Text>
				dot: {(crosshair.centerDotEnabled as boolean).toString()}
			</Text>
		</Box>
	)
}
