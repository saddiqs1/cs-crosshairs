import classes from './CrosshairCard.module.css'
import { Box, Stack, Text } from '@mantine/core'
import { RenderCrosshair } from './RenderCrosshair'
import { copyCommands, getCrosshair } from '@lib/crosshairUtils'

type Props = {
	crosshairCode: string
	name: string
}

export const CrosshairPreview: React.FC<Props> = ({ crosshairCode, name }) => {
	return (
		<Stack
			gap={6}
			p={'sm'}
			bg='dark.5'
			className={`${classes.card} ${classes.preview}`}
			onClick={() => copyCommands(crosshairCode)}
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
					className={classes.name}
				>
					{name}
				</Text>
			) : (
				<Box h={22} />
			)}
		</Stack>
	)
}
