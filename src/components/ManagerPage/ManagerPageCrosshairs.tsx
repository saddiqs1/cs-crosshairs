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
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	UniqueIdentifier,
} from '@dnd-kit/core'
import { AddCrosshairCard } from '@components/AddCrosshairCard'
import { useState } from 'react'
import { DBTypes } from '@my-types/database'
import { CrosshairCard } from '@components/CrosshairCard'

type Props = {
	username: string
	crosshairGroups: CrosshairGroupType[]
}

export const ManagerPageCrosshairs: React.FC<Props> = ({
	username,
	crosshairGroups,
}) => {
	const [crosshairGroupsState, setCrosshairGroupsState] =
		useState<CrosshairGroupType[]>(crosshairGroups)
	const [activeCrosshair, setActiveCrosshair] = useState<
		DBTypes['crosshairs'] | null
	>(null)

	const findContainer = (id: UniqueIdentifier) => {
		for (const cg of crosshairGroupsState) {
			if (
				(cg.group && cg.group.id === id) ||
				(!cg.group && id === 'Uncategorised')
			)
				return id
		}

		return null
	}

	const handleDragStart = ({ active }: DragStartEvent) => {
		let activeCrosshair: DBTypes['crosshairs'] | null = null
		for (const cg of crosshairGroupsState) {
			for (const c of cg.crosshairs) {
				if (c.id == active.id) {
					activeCrosshair = c
					break
				}
			}
			if (activeCrosshair) break
		}

		setActiveCrosshair(activeCrosshair)
	}

	const handleDragOver = ({ active, over }: DragOverEvent) => {
		console.log('adc', active.data.current)
		const overId = over?.id
		const activeId = active.id

		if (!overId) {
			return
		}

		const activeContainer = findContainer(activeId)
		const overContainer = findContainer(overId)

		if (
			!activeContainer ||
			!overContainer ||
			activeContainer === overContainer
		) {
			return
		}
	}

	const handleDragEnd = (event: DragEndEvent) => {
		// TODO - handle logic here of record being updated within db
		const { active, over } = event

		if (over) {
			console.log(`over: ${over.id}, active: ${active.id}`)
		}
	}

	const accordionGroups = crosshairGroupsState
		.map((cg) => (cg.group !== null ? cg.group.name : null))
		.filter((item): item is string => item !== null)

	const ungroupedCrosshairs = crosshairGroupsState.find((cg) => !cg.group)

	return (
		<DndContext
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
		>
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

			{crosshairGroupsState.length > 0 ? (
				<Stack align='center'>
					<Accordion
						variant='separated'
						chevronPosition='left'
						w={'70%'}
						multiple
						defaultValue={accordionGroups}
					>
						{crosshairGroupsState.map((cg, i) => (
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

			<DragOverlay>
				{activeCrosshair ? (
					<CrosshairCard
						id={activeCrosshair.id}
						crosshairCode={activeCrosshair.crosshair}
						name={activeCrosshair.name}
					/>
				) : null}
			</DragOverlay>
		</DndContext>
	)
}
