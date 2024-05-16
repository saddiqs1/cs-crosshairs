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
import { DroppableCrosshairList } from '../Draggable/DroppableCrosshairList'
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
	UniqueIdentifier,
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
import { DBTypes } from '@my-types/database'
import { CrosshairCard } from '@components/CrosshairCard'

type Props = {
	username: string
	crosshairGroups: CrosshairGroupType[]
}

export const GROUP_PREFIX = 'GROUP-'
export const CROSSHAIR_PREFIX = 'CROSSHAIR-'

const isCrosshairGroupType = (
	item: CrosshairGroupType | DBTypes['crosshairs']
): item is CrosshairGroupType => {
	return (item as CrosshairGroupType).crosshairs !== undefined
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
	const [activeItem, setActiveItem] = useState<
		CrosshairGroupType | DBTypes['crosshairs'] | null
	>(null)
	const { updateCrosshairGroups } = useCrosshairGroupPost()

	const ungroupedCrosshairs = crosshairGroupsState.find((cg) => !cg.group)

	const getId = (id: UniqueIdentifier, prefix: string) =>
		Number(id.toString().replace(prefix, ''))

	async function handleDragEnd(event: DragEndEvent) {
		setActiveItem(null)
		const { active, over } = event
		if (!over) return

		const activeId = getId(active.id, GROUP_PREFIX)
		const overId = getId(over.id, GROUP_PREFIX)

		if (activeId !== overId) {
			const oldIndex = crosshairGroupsState.findIndex(
				(cg) => cg.group?.id === activeId
			)
			const newIndex = crosshairGroupsState.findIndex(
				(cg) => cg.group?.id === overId
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
		if (event.active.id.toString().startsWith(GROUP_PREFIX)) {
			// Group is currently being dragged
			setActiveItem(
				crosshairGroups[
					crosshairGroups.findIndex(
						(cg) =>
							cg.group?.id ===
							getId(event.active.id, GROUP_PREFIX)
					)
				]
			)
			return
		}

		if (event.active.id.toString().startsWith(CROSSHAIR_PREFIX)) {
			// Crosshair is currently being dragged
			let activeCrosshair: DBTypes['crosshairs'] | null = null

			for (const cg of crosshairGroups) {
				for (const c of cg.crosshairs) {
					if (c.id === getId(event.active.id, CROSSHAIR_PREFIX)) {
						activeCrosshair = c
						break
					}
				}
				if (activeCrosshair) break
			}

			setActiveItem(activeCrosshair)
			return
		}

		setActiveItem(null)
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
					.map((cg) =>
						cg.group?.id ? `${GROUP_PREFIX}${cg.group.id}` : null
					)
					.filter((id): id is string => id !== null)}
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
												groupId={`${GROUP_PREFIX}${cg.group.id}`}
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
									<DroppableCrosshairList
										crosshairs={
											ungroupedCrosshairs.crosshairs
										}
										id={`${GROUP_PREFIX}null`}
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
				{activeItem &&
					(isCrosshairGroupType(activeItem) ? (
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
								groupId={''} // TODO - is there a way to not have this here?
							/>
						</Accordion>
					) : (
						<CrosshairCard
							crosshairCode={activeItem.crosshair}
							name={activeItem.name}
							dragOverlay
						/>
					))}
			</DragOverlay>
		</DndContext>
	)
}
