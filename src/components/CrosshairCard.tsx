import { Box, Stack, Text } from '@mantine/core'
import { RenderCrosshair } from './RenderCrosshair'
import { getCrosshair } from '@lib/crosshairUtils'

type Props = {
	id: number
	crosshairCode: string
	name: string
}

export const CrosshairCard: React.FC<Props> = ({ id, crosshairCode, name }) => {
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
			title={`Copy ${name}`}
		>
			<RenderCrosshair
				crosshair={getCrosshair(crosshairCode)}
				size={100}
			/>
			{name.length > 0 ? (
				<Text
					ta='center'
					c={'dimmed'}
					size={'sm'}
					lh={1.5}
					sx={{
						width: 100,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{name}
				</Text>
			) : (
				<Box h={22} />
			)}
		</Stack>
	)
}
