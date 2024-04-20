import { Accordion, Box, Flex, Stack, Title } from '@mantine/core'
import { CrosshairPreview } from '../CrosshairPreview'
import { CrosshairGroup } from '@my-types/api-responses/Crosshair'
import { DBTypes } from '@my-types/database'

type Props = {
	crosshairGroups: CrosshairGroup[]
}

export const CrosshairPage: React.FC<Props> = ({ crosshairGroups }) => {
	const accordionGroups = crosshairGroups
		.map((cg) => cg.group)
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
							<Accordion.Item value={cg.group}>
								<Accordion.Control>
									{cg.group}
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
	<Flex justify={'center'} align={'end'} gap={'xl'} wrap={'wrap'}>
		{crosshairs.map((c, i) => (
			<CrosshairPreview
				crosshairCode={c.crosshair}
				name={c.name}
				key={i}
			/>
		))}
	</Flex>
)
