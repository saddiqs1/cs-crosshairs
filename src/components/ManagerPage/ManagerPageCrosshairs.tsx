import { Box, Group, MediaQuery, Stack, Title, Text, Accordion } from '@mantine/core'
import { CrosshairGroup as CrosshairGroupType, CrosshairItems } from '@my-types/api-responses/Crosshair'
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
	DragCancelEvent,
	DropAnimation,
	defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableCrosshairGroupAccordionItem } from '@components/Draggable/SortableCrosshairGroupAccordionItem'
import { useCrosshairGroupPost } from '@lib/hooks/useCrosshairGroupPost'
import { useRef, useState } from 'react'
import { CrosshairGroupAccordionItem } from './CrosshairGroupAccordionItem'
import { DBTypes } from '@my-types/database'
import { CrosshairCard } from '@components/CrosshairCard'
import { insertAtIndex, removeAtIndex } from '@lib/arrayUtils'
import { Container, DroppableContainer } from '@components/Draggable/DroppableContainer'
import { SortableCrosshairCardItem } from '@components/Draggable/SortableCrosshairCardItem'

type Props = {
	username: string
	crosshairItems: CrosshairItems
	crosshairs: DBTypes['crosshairs'][]
	groups: DBTypes['crosshair_groups'][]
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

// TODO - alter logic/strategies etc. to be like example below
// MultipleContainers.tsx in dnd-kit example repo
export const ManagerPageCrosshairs: React.FC<Props> = ({ username, crosshairItems, crosshairs, groups }) => {
	const [items, setItems] = useState<CrosshairItems>(crosshairItems)
	const [containers, setContainers] = useState<UniqueIdentifier[]>(Object.keys(items))
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
	const lastOverId = useRef<UniqueIdentifier | null>(null)
	const recentlyMovedToNewContainer = useRef(false)
	const isSortingContainer = activeId ? containers.includes(activeId) : false

	const { updateCrosshairGroups } = useCrosshairGroupPost()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleDragStart = (event: DragStartEvent) => {}
	const handleDragOver = (event: DragOverEvent) => {}
	const handleDragEnd = (event: DragEndEvent) => {}
	const handleDragCancel = (event: DragCancelEvent) => {}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragCancel={handleDragCancel}
		>
			{/* <Group position='center' spacing={'xl'}>
				<MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
					<Stack spacing={'xs'} w={'30%'}>
						<Text ta={'center'} c={'dimmed'}>
							Welcome, {username}!
						</Text>
						<Text ta={'center'} c={'dimmed'}>
							Add crosshairs, and then click on a card below to copy the console commands for it.
						</Text>
					</Stack>
					*
				</MediaQuery>
				<AddCrosshairCard />
				 <EditCrosshairsCard
						crosshairs={crosshairs[0].crosshairs}
						disabled={isCrosshairsLoading}
					/> 
			</Group> */}
			<SortableContext id={SORTABLE_GROUP_ID} items={containers} strategy={verticalListSortingStrategy}>
				<Stack align='center'>
					{containers.map((containerId) => {
						const group = groups.find((g) => g.id === Number(String(containerId).replace(GROUP_PREFIX, '')))
						const itemIds = items[containerId].map((c) => c.id)

						return (
							<>
								{group ? (
									<DroppableContainer key={containerId} id={containerId} items={itemIds}>
										<SortableContext items={itemIds} strategy={rectSortingStrategy}>
											{items[containerId].map((c) => {
												return (
													<SortableCrosshairCardItem
														key={c.id}
														id={c.id}
														crosshairCode={c.crosshair}
														name={c.name}
													/>
												)
											})}
										</SortableContext>
									</DroppableContainer>
								) : (
									<Stack w={'68%'}>
										<Title order={5} c={'dimmed'} ta={'left'}>
											Uncategorised
										</Title>
										<SortableContext items={itemIds} strategy={rectSortingStrategy}>
											{items['GROUP-NULL'].map((c) => {
												return (
													<SortableCrosshairCardItem
														key={c.id}
														id={c.id}
														crosshairCode={c.crosshair}
														name={c.name}
													/>
												)
											})}
										</SortableContext>
									</Stack>
								)}
							</>
						)
					})}
				</Stack>
			</SortableContext>

			<DragOverlay dropAnimation={dropAnimation}>
				{activeId &&
					(containers.includes(activeId) ? (
						<Container>
							{items[activeId].map((c) => {
								return <CrosshairCard key={c.id} crosshairCode={c.crosshair} name={c.name} />
							})}
						</Container>
					) : (
						// TODO - update below
						<CrosshairCard crosshairCode={'CSGO-RoxEW-xZqYv-nzUQZ-UVtvi-cV6uC'} name={'TEST'} />
					))}
			</DragOverlay>
		</DndContext>
	)
}

const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: '0.5',
			},
		},
	}),
}
