import { copy } from '@lib/copy'
import { notifications } from '@mantine/notifications'
import { Crosshair } from '@my-types/crosshair'
const csgoSharecode = require('csgo-sharecode')

export function useCrosshair() {
	const copyCommands = (crosshairCode: string) => {
		try {
			const crosshairCommands = csgoSharecode
				.crosshairToConVars(
					csgoSharecode.decodeCrosshairShareCode(crosshairCode)
				)
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

	const getCrosshair = (crosshairCode: string): Crosshair => {
		return csgoSharecode.decodeCrosshairShareCode(crosshairCode)
	}

	return { copyCommands, getCrosshair }
}
