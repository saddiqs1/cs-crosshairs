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
import { AddCrosshairCard } from '@components/AddCrosshairCard'

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableCrosshairGroup } from '@components/Draggable/SortableCrosshairGroup'

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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 15,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = crosshairGroups.findIndex(
				(cg) => cg.group?.id === active.id
			)
			const newIndex = crosshairGroups.findIndex(
				(cg) => cg.group?.id === over.id
			)

			const newArr = arrayMove(crosshairGroups, oldIndex, newIndex)
			// TODO - post this response to endpoint to update groups
			console.log(newArr)
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={crosshairGroups
					.map((cg) => cg.group?.id)
					.filter((id): id is number => id !== null)}
				strategy={verticalListSortingStrategy}
			>
				<Group position='center' spacing={'xl'}>
					<MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
						<Stack spacing={'xs'} w={'30%'}>
							<Text ta={'center'} c={'dimmed'}>
								Welcome, {username}!
							</Text>
							<Text ta={'center'} c={'dimmed'}>
								Add crosshairs, and then click on a card below
								to copy the console commands for it.
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
						{crosshairGroups.map((cg, i) => (
							<>
								{cg.group && (
									<Box w={'70%'}>
										<SortableCrosshairGroup
											id={cg.group.id}
											groupName={cg.group.name}
											crosshairs={cg.crosshairs}
										/>
									</Box>
								)}
							</>
						))}
						<Stack w={'68%'}>
							<Title order={5} c={'dimmed'} ta={'left'}>
								Uncategorised
							</Title>
							{ungroupedCrosshairs && (
								<Box>
									<CrosshairList
										crosshairs={
											ungroupedCrosshairs.crosshairs
										}
									/>
								</Box>
							)}
						</Stack>
					</Stack>
				) : (
					<Text ta={'center'} py={'xl'} c={'red'} size={'sm'}>
						No crosshairs found...
					</Text>
				)}
			</SortableContext>
		</DndContext>
	)
}
