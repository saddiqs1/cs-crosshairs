import { Accordion, ActionIcon, Box } from '@mantine/core'
import { DroppableCrosshairList } from '../Draggable/DroppableCrosshairList'
import { DBTypes } from '@my-types/database'
import { IconGripVertical } from '@tabler/icons-react'
import { DraggableProps } from '@my-types/draggable'

export type CrosshairGroupAccordionProps = {
	groupName: string
	crosshairs: DBTypes['crosshairs'][]
	dragOverlay?: boolean
}

export const CrosshairGroupAccordionItem: React.FC<
	CrosshairGroupAccordionProps & DraggableProps
> = ({
	groupName,
	crosshairs,
	dragOverlay,
	attributes,
	listeners,
	setActivatorNodeRef,
}) => {
	return (
		<Accordion.Item value={groupName}>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Accordion.Control>{groupName}</Accordion.Control>
				<Box pr={'xs'}>
					<ActionIcon
						size='xl'
						ref={setActivatorNodeRef}
						{...attributes}
						{...listeners}
						sx={{ cursor: dragOverlay ? 'grabbing' : 'grab' }}
					>
						<IconGripVertical size='1rem' />
					</ActionIcon>
				</Box>
			</Box>
			<Accordion.Panel>
				<DroppableCrosshairList crosshairs={crosshairs} id={''} />
			</Accordion.Panel>
		</Accordion.Item>
	)
}
