import { Stack, Text } from '@mantine/core'
import { RenderCrosshair } from './RenderCrosshair'
import { useCrosshair } from '@lib/hooks/useCrosshair'

type Props = {
	crosshairCode: string
	name: string
}

export const CrosshairPreview: React.FC<Props> = ({ crosshairCode, name }) => {
	const { copyCommands, getCrosshair } = useCrosshair()

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
			onClick={() => copyCommands(crosshairCode)}
			title={`Copy ${name}`}
		>
			<RenderCrosshair
				crosshair={getCrosshair(crosshairCode)}
				size={100}
			/>
			<Text
				ta='center'
				c={'dimmed'}
				size={'sm'}
				sx={{
					width: 100,
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			>
				{name}
			</Text>
		</Stack>
	)
}
