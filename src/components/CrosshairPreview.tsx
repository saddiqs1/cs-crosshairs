import { copy } from '@lib/copy'
import { Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
const csgoSharecode = require('csgo-sharecode')
import { Crosshair, RenderCrosshair } from './RenderCrosshair'

type Props = {
	crosshairCode: string
	name: string
}

export const CrosshairPreview: React.FC<Props> = ({ crosshairCode, name }) => {
	const crosshair: Crosshair =
		csgoSharecode.decodeCrosshairShareCode(crosshairCode)

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
		<Stack
			spacing={6}
			p={'sm'}
			bg='dark.5'
			sx={(theme) => ({
				borderRadius: theme.radius.md,
				transition: 'shadow 150ms ease, transform 100ms ease;',
				'&:hover': {
					cursor: 'pointer',
					boxShadow: theme.shadows.md,
					transform: `scale(1.05)`,
					background: theme.colors.dark[4],
				},
			})}
			onClick={onClick}
		>
			<RenderCrosshair crosshair={crosshair} size={100} />
			<Text ta='center' size={'sm'} c={'dimmed'}>
				{name}
			</Text>
		</Stack>
	)
}
