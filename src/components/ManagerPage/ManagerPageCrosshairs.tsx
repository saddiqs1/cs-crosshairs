import { Accordion, Box, Stack, Title } from '@mantine/core'
import { CrosshairGroup as CrosshairGroupType } from '@my-types/api-responses/Crosshair'
import { CrosshairList } from './CrosshairList'
import { CrosshairGroup } from './CrosshairGroup'

type Props = {
	crosshairGroups: CrosshairGroupType[]
}

export const ManagerPageCrosshairs: React.FC<Props> = ({ crosshairGroups }) => {
	const accordionGroups = crosshairGroups
		.map((cg) => (cg.group !== null ? cg.group.name : null))
		.filter((item): item is string => item !== null)

	const ungroupedCrosshairs = crosshairGroups.filter((cg) => !cg.group)

	return (
		<Stack align='center'>
			<Accordion
				variant='separated'
				chevronPosition='left'
				w={'70%'}
				multiple
				defaultValue={accordionGroups}
			>
				{crosshairGroups.map((cg, i) => (
					<>
						{cg.group && (
							<CrosshairGroup
								id={cg.group.id}
								groupName={cg.group.name}
								crosshairs={cg.crosshairs}
							/>
						)}
					</>
				))}
			</Accordion>
			<Title order={5} c={'dimmed'} ta={'left'} w={'68%'}>
				Uncategorised
			</Title>
			<Box w={'68%'}>
				<CrosshairList crosshairs={ungroupedCrosshairs[0].crosshairs} />
			</Box>
		</Stack>
	)
}
