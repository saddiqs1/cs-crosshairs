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
	console.log(crosshair)

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
			<Box
				onClick={onClick}
				sx={{
					border: '1px dashed red',
					cursor: 'pointer',
					background: 'rgba(20, 20, 20, 0.5)',
				}}
				w={101}
				h={101}
			>
				<RenderCrosshair crosshair={crosshair} size={100} />
			</Box>
			<Text>size: {crosshair.length}</Text>
			<Text>thickness: {crosshair.thickness}</Text>
			<Text>gap: {crosshair.gap}</Text>
			<Text>
				dot: {(crosshair.centerDotEnabled as boolean).toString()}
			</Text>
		</Box>
	)
}
