import { copy } from '@lib/copy'
import { notifications } from '@mantine/notifications'
import { getCurrentCrosshairCode, getCrosshairCommands } from './crosshairCodec'
export { getCrosshair } from './crosshairCodec'
const copyCrosshair = (code: string, height: number, commands: boolean) => {
	try {
		copy(
			commands
				? getCrosshairCommands(code, height)
				: getCurrentCrosshairCode(code, height)
		)
		notifications.show({
			title: 'Crosshair copied',
			message: commands
				? 'CS2 commands copied to your clipboard.'
				: 'Current CS2 code copied to your clipboard.',
			color: 'green',
		})
	} catch {
		notifications.show({
			title: 'Could not copy crosshair',
			message: 'Check the crosshair code and screen height.',
			color: 'red',
		})
	}
}
export const copyCommands = (code: string, height = 1080) =>
	copyCrosshair(code, height, true)
export const copyCrosshairCode = (code: string, height = 1080) =>
	copyCrosshair(code, height, false)
