import {
	Box,
	Group,
	MediaQuery,
	Stack,
	Title,
	Text,
	Accordion,
} from '@mantine/core'
import { CrosshairGroup as CrosshairGroupType } from '@my-types/api-responses/Crosshair'
import { CrosshairList } from './CrosshairList'
import { AddCrosshairCard } from '@components/AddCrosshairCard'
import {
	DndContext,
	closestCenter,
	DragEndEvent,
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	DragOverlay,
	DragStartEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableCrosshairGroupAccordionItem } from '@components/Draggable/SortableCrosshairGroupAccordionItem'
import { useCrosshairGroupPost } from '@lib/hooks/useCrosshairGroupPost'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconCircleX } from '@tabler/icons-react'
import { useState } from 'react'
import { CrosshairGroupAccordionItem } from './CrosshairGroupAccordionItem'

type Props = {
	username: string
	crosshairGroups: CrosshairGroupType[]
}

// https://github.com/clauderic/dnd-kit/issues/714
// https://codesandbox.io/p/sandbox/playground-0mine?file=%2Fsrc%2Fcomponents%2FSortableItem.jsx%3A20%2C5-20%2C35
// https://codesandbox.io/p/sandbox/github/jdthorpe/dnd-kit-sortable-poc/tree/main/
export const ManagerPageCrosshairs: React.FC<Props> = ({
	username,
	crosshairGroups,
}) => {
	const [crosshairGroupsState, setCrosshairGroupsState] =
		useState(crosshairGroups)
	const [accordionValue, setAccordionValue] = useState<string[]>(
		crosshairGroupsState
			.map((cg) => cg.group?.name)
			.filter((x): x is string => !!x)
	)
	const [activeItem, setActiveItem] = useState<CrosshairGroupType | null>(
		null
	)
	const { updateCrosshairGroups } = useCrosshairGroupPost()

	const ungroupedCrosshairs = crosshairGroupsState.find((cg) => !cg.group)

	async function handleDragEnd(event: DragEndEvent) {
		setActiveItem(null)
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = crosshairGroupsState.findIndex(
				(cg) => cg.group?.id === active.id
			)
			const newIndex = crosshairGroupsState.findIndex(
				(cg) => cg.group?.id === over.id
			)

			const sortedCrosshairGroups = arrayMove(
				crosshairGroupsState,
				oldIndex,
				newIndex
			)
			setCrosshairGroupsState(sortedCrosshairGroups)

			const res = await updateCrosshairGroups({
				crosshairGroups: sortedCrosshairGroups,
			})
			showNotification({
				message: res?.message,
				icon: res?.success ? (
					<IconCheck size={18} />
				) : (
					<IconCircleX size={18} />
				),
				color: res?.success ? 'green' : 'red',
			})
		}
	}

	function handleDragStart(event: DragStartEvent) {
		setActiveItem(
			crosshairGroups[
				crosshairGroups.findIndex(
					(cg) => cg.group?.id === event.active.id
				)
			]
		)
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
		>
			<SortableContext
				items={crosshairGroupsState
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

				{crosshairGroupsState.length > 0 ? (
					<Stack align='center'>
						<Accordion
							variant='separated'
							chevronPosition='left'
							disableChevronRotation
							multiple
							value={accordionValue}
							onChange={setAccordionValue}
							w={'70%'}
							transitionDuration={0}
						>
							{crosshairGroupsState.map((cg, i) => (
								<>
									{cg.group && (
										<Box
											pb={
												i ===
												crosshairGroupsState.length - 2
													? undefined
													: 'xl'
											}
										>
											<SortableCrosshairGroupAccordionItem
												id={cg.group.id}
												groupName={cg.group.name}
												crosshairs={cg.crosshairs}
											/>
										</Box>
									)}
								</>
							))}
						</Accordion>
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

			<DragOverlay>
				{activeItem && (
					<Accordion
						variant='separated'
						chevronPosition='left'
						disableChevronRotation
						defaultValue={
							accordionValue.includes(activeItem.group!.name)
								? activeItem.group!.name
								: null
						}
						transitionDuration={0}
					>
						<CrosshairGroupAccordionItem
							groupName={activeItem.group!.name}
							crosshairs={activeItem.crosshairs}
							dragOverlay
						/>
					</Accordion>
				)}
			</DragOverlay>
		</DndContext>
	)
}
