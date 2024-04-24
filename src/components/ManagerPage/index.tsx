import { Center, Group, Loader, MediaQuery, Stack, Text } from '@mantine/core'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { AddCrosshairCard } from '@components/AddCrosshairCard'
import { useCrosshair } from '@lib/hooks/useCrosshair'
import { ManagerPageCrosshairs } from './ManagerPageCrosshairs'
import { useState } from 'react'

type Props = {
	username: string
}

/*
	TODO:
	https://docs.dndkit.com/
	https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/presets-sortable-multiple-containers--vertical-grid

	when dragging crosshair...:
		1 - can drop onto 'add crosshair button' to create new group for it
		2 - can drop into a list that is already there to add to that group
		3 - can reorder within its current list
*/

const handleDragEnd = (event: DragEndEvent) => {
	// TODO - handle logic here of record being updated within db
	const { active, over } = event

	if (over) {
		console.log(`over: ${over.id}, active: ${active.id}`)
	}
}

export const ManagerPage: React.FC<Props> = ({ username }) => {
	const { crosshairs, isCrosshairsLoading } = useCrosshair()

	return (
		<DndContext onDragEnd={handleDragEnd}>
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
			{isCrosshairsLoading ? (
				<Center>
					<Loader size={'lg'} />
				</Center>
			) : (
				<ManagerPageCrosshairs crosshairGroups={crosshairs} />
			)}
		</DndContext>
	)
}
