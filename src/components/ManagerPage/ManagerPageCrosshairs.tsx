import {
	Accordion,
	Box,
	Group,
	MediaQuery,
	Stack,
	Title,
	Text,
} from '@mantine/core'
import { CrosshairGroup as CrosshairGroupType } from '@my-types/api-responses/Crosshair'
import { CrosshairList } from './CrosshairList'
import { CrosshairGroup } from './CrosshairGroup'
import { AddCrosshairCard } from '@components/AddCrosshairCard'

type Props = {
	username: string
	crosshairGroups: CrosshairGroupType[]
}

export const ManagerPageCrosshairs: React.FC<Props> = ({
	username,
	crosshairGroups,
}) => {
	const accordionGroups = crosshairGroups
		.map((cg) => (cg.group !== null ? cg.group.name : null))
		.filter((item): item is string => item !== null)

	const ungroupedCrosshairs = crosshairGroups.find((cg) => !cg.group)

	return (
		<>
			<Group position='center' spacing={'xl'}>
				<MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
					<Stack spacing={'xs'} w={'30%'}>
						<Text ta={'center'} c={'dimmed'}>
							Welcome, {username}!
						</Text>
						<Text ta={'center'} c={'dimmed'}>
							Add crosshairs, and then click on a card below to
							copy the console commands for it.
						</Text>
					</Stack>
				</MediaQuery>
				<AddCrosshairCard />
				{/* <EditCrosshairsCard
					crosshairs={crosshairs[0].crosshairs}
					disabled={isCrosshairsLoading}
				/> */}
			</Group>

			{crosshairGroups.length > 0 ? (
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
					{ungroupedCrosshairs && (
						<Box w={'68%'}>
							<CrosshairList
								id={'Uncategorised'}
								crosshairs={ungroupedCrosshairs.crosshairs}
							/>
						</Box>
					)}
				</Stack>
			) : (
				<Text ta={'center'} py={'xl'} c={'red'} size={'sm'}>
					No crosshairs found...
				</Text>
			)}
		</>
	)
}
