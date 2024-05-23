import { Box, Group, MediaQuery, Stack, Title, Text, Accordion } from '@mantine/core'
import { CrosshairGroup as CrosshairGroupType } from '@my-types/api-responses/Crosshair'
import { DroppableCrosshairList } from '../Draggable/DroppableCrosshairList'
import { AddCrosshairCard } from '@components/AddCrosshairCard'
import {
	DndContext,
	DragEndEvent,
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	DragOverlay,
	DragStartEvent,
	UniqueIdentifier,
	DragOverEvent,
	closestCorners,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableCrosshairGroupAccordionItem } from '@components/Draggable/SortableCrosshairGroupAccordionItem'
import { useCrosshairGroupPost } from '@lib/hooks/useCrosshairGroupPost'
import { useState } from 'react'
import { CrosshairGroupAccordionItem } from './CrosshairGroupAccordionItem'
import { DBTypes } from '@my-types/database'
import { CrosshairCard } from '@components/CrosshairCard'
import { insertAtIndex, removeAtIndex } from '@lib/arrayUtils'

type Props = {
	username: string
	crosshairGroups: CrosshairGroupType[]
}

export const GROUP_PREFIX = 'GROUP-'
export const CROSSHAIR_PREFIX = 'CROSSHAIR-'
export const SORTABLE_GROUP_ID = 'SORTABLE-GROUP'

export type SortableContainerData = {
	sortable: {
		containerId: UniqueIdentifier
		index: number
		items: UniqueIdentifier[]
	}
	[key: string]: any
}

const isCrosshairGroupType = (item: CrosshairGroupType | DBTypes['crosshairs']): item is CrosshairGroupType => {
	return (item as CrosshairGroupType).crosshairs !== undefined
}

// https://github.com/clauderic/dnd-kit/issues/714
// https://codesandbox.io/p/sandbox/playground-0mine?file=%2Fsrc%2Fcomponents%2FSortableItem.jsx%3A20%2C5-20%2C35
// https://codesandbox.io/p/sandbox/github/jdthorpe/dnd-kit-sortable-poc/tree/main/

// TODO - alter logic/strategies etc. to be like example below
// MultipleContainers.tsx in dnd-kit example repo
export const ManagerPageCrosshairs: React.FC<Props> = ({ username, crosshairGroups }) => {
	const [crosshairGroupsState, setCrosshairGroupsState] = useState(crosshairGroups)
	const [accordionValue, setAccordionValue] = useState<string[]>(
		crosshairGroupsState.map((cg) => cg.group?.name).filter((x): x is string => !!x)
	)
	const [activeItem, setActiveItem] = useState<CrosshairGroupType | DBTypes['crosshairs'] | null>(null)
	const { updateCrosshairGroups } = useCrosshairGroupPost()

	const ungroupedCrosshairs = crosshairGroupsState.find((cg) => !cg.group)

	const getId = (id: UniqueIdentifier, prefix: string) => {
		const actualId = Number(id.toString().replace(prefix, ''))
		return Number.isNaN(actualId) ? null : actualId
	}

	async function handleDragEnd(event: DragEndEvent) {
		/*
			TODO:
			- handle xhair changes
			- db changes should occur here
		*/

		setActiveItem(null)
		const { active, over } = event
		if (!over) return

		const activeId = getId(active.id, GROUP_PREFIX)
		const overId = getId(over.id, GROUP_PREFIX)

		if (activeId !== overId && overId) {
			const oldIndex = crosshairGroupsState.findIndex((cg) => cg.group?.id === activeId)
			const newIndex = crosshairGroupsState.findIndex((cg) => cg.group?.id === overId)

			const sortedCrosshairGroups = arrayMove(crosshairGroupsState, oldIndex, newIndex)
			// console.log(sortedCrosshairGroups)
			setCrosshairGroupsState(sortedCrosshairGroups)

			// TODO - uncomment below (db operation)
			// const res = await updateCrosshairGroups({
			// 	crosshairGroups: sortedCrosshairGroups,
			// })
			// showNotification({
			// 	message: res?.message,
			// 	icon: res?.success ? (
			// 		<IconCheck size={18} />
			// 	) : (
			// 		<IconCircleX size={18} />
			// 	),
			// 	color: res?.success ? 'green' : 'red',
			// })
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event
		if (!over) return

		const activeId = active.id.toString()
		const overCurrent = over.data.current as SortableContainerData | undefined

		// Currently dragging a group
		const activeGroupId = getId(activeId, GROUP_PREFIX)
		if (activeGroupId) {
			const overGroupId = overCurrent
				? getId(overCurrent.sortable.containerId, GROUP_PREFIX)
				: getId(over.id, GROUP_PREFIX)

			console.log({ over, active, activeGroupId, overGroupId })

			if (!overGroupId) return
			return moveCrosshairGroup(activeGroupId, overGroupId)
		}

		const activeCurrent = active.data.current as SortableContainerData | undefined

		// Currently dragging a crosshair
		const activeCrosshairId = getId(activeId, CROSSHAIR_PREFIX)
		if (activeCrosshairId) {
			const activeGroupId = activeCurrent ? getId(activeCurrent.sortable.containerId, GROUP_PREFIX) : null

			const overGroupId = over.id.toString().includes(CROSSHAIR_PREFIX)
				? getId(overCurrent!.sortable.containerId, GROUP_PREFIX)
				: getId(over.id, GROUP_PREFIX)

			if (activeGroupId === overGroupId) {
				/*
					TODO:
					- if hovering over same group, update order of crosshairs
						> if 'over' is xhair, update order
						> if 'over' is group id, put to end of list
				*/
			} else {
				/*
					TODO:
					- if hovering over different group, then do 2 things:
						> remove from current group
						> place it in new group at correct position
				*/
				const activeIndex = activeCurrent?.sortable.index
				if (activeIndex === undefined) return

				const overIndex = over.id.toString().includes(GROUP_PREFIX) ? null : overCurrent!.sortable.index
				const activeCrosshair = crosshairGroupsState
					.find((cg) => (activeGroupId === null && cg.group === null) || cg.group?.id === activeGroupId)
					?.crosshairs.find((c) => c.id === activeCrosshairId)
				if (!activeCrosshair) return

				console.log({ over, active, activeGroupId, overGroupId, activeIndex, overIndex })
				moveCrosshair(activeGroupId, overGroupId, activeCrosshair, activeIndex, overIndex)
				return
			}
		}
	}

	const moveCrosshair = (
		activeGroupId: number | null,
		overGroupId: number | null,
		crosshair: DBTypes['crosshairs'],
		activeIndex: number,
		overIndex: number | null
	) => {
		setCrosshairGroupsState((prev) => {
			const updatedCrosshairGroups = prev.map((cg) => {
				if ((overGroupId === null && cg.group === null) || cg.group?.id === overGroupId) {
					// insert & return
					return {
						group: cg.group,
						crosshairs: insertAtIndex(cg.crosshairs, overIndex ?? cg.crosshairs.length + 1, crosshair),
					}
				}

				if ((activeGroupId === null && cg.group === null) || cg.group?.id === activeGroupId) {
					// remove & return
					return {
						group: cg.group,
						crosshairs: removeAtIndex(cg.crosshairs, activeIndex),
					}
				}

				return cg
			})

			return updatedCrosshairGroups
		})
	}

	const moveCrosshairGroup = (activeGroupId: number, overGroupId: number) => {
		setCrosshairGroupsState((prev) => {
			const oldIndex = prev.findIndex((cg) => cg.group?.id === activeGroupId)
			const newIndex = prev.findIndex((cg) => cg.group?.id === overGroupId)

			const sortedCrosshairGroups = arrayMove(prev, oldIndex, newIndex)

			return sortedCrosshairGroups
		})
	}

	function handleDragStart(event: DragStartEvent) {
		if (event.active.id.toString().startsWith(GROUP_PREFIX)) {
			// Group is currently being dragged
			setActiveItem(
				crosshairGroups[
					crosshairGroups.findIndex((cg) => cg.group?.id === getId(event.active.id, GROUP_PREFIX))
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
			collisionDetection={closestCorners}
			// onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragCancel={() => {
				setCrosshairGroupsState(crosshairGroups)
				setActiveItem(null)
			}}
		>
			<SortableContext
				id={SORTABLE_GROUP_ID}
				items={crosshairGroupsState
					.map((cg) => (cg.group?.id ? `${GROUP_PREFIX}${cg.group.id}` : null))
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
								Add crosshairs, and then click on a card below to copy the console commands for it.
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
										<Box pb={i === crosshairGroupsState.length - 2 ? undefined : 'xl'}>
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
										crosshairs={ungroupedCrosshairs.crosshairs}
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
								accordionValue.includes(activeItem.group!.name) ? activeItem.group!.name : null
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
						<CrosshairCard crosshairCode={activeItem.crosshair} name={activeItem.name} dragOverlay />
					))}
			</DragOverlay>
		</DndContext>
	)
}
