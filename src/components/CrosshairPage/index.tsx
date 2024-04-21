import { Accordion, Box, Flex, Stack, Title } from '@mantine/core'
import { CrosshairPreview } from '../CrosshairPreview'
import { CrosshairGroup } from '@my-types/api-responses/Crosshair'
import { DBTypes } from '@my-types/database'

type Props = {
	crosshairGroups: CrosshairGroup[]
}

/*
	TODO:
	2 - create way to make new 'group'
	3 - implement drag and drop in a way so that you can move xhairs to 'groups'
*/

export const CrosshairPage: React.FC<Props> = ({ crosshairGroups }) => {
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
							<Accordion.Item value={cg.group.name}>
								<Accordion.Control>
									{cg.group.name}
								</Accordion.Control>
								<Accordion.Panel>
									<CrosshairList crosshairs={cg.crosshairs} />
								</Accordion.Panel>
							</Accordion.Item>
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

const CrosshairList: React.FC<{ crosshairs: DBTypes['crosshairs'][] }> = ({
	crosshairs,
}) => (
	<Flex justify={'left'} align={'end'} gap={'xl'} wrap={'wrap'}>
		{crosshairs.map((c, i) => (
			<CrosshairPreview
				crosshairCode={c.crosshair}
				name={c.name}
				key={i}
			/>
		))}
	</Flex>
)
