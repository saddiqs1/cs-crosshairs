import { Accordion, ActionIcon, Box } from '@mantine/core'
import { CrosshairList } from './CrosshairList'
import { DBTypes } from '@my-types/database'
import {
	DraggableSyntheticListeners,
	UseDraggableArguments,
} from '@dnd-kit/core'
import { IconGripVertical } from '@tabler/icons-react'

export type CrosshairGroupAccordionProps = {
	groupName: string
	crosshairs: DBTypes['crosshairs'][]
	dragOverlay?: boolean
}

type DraggableProps = Pick<UseDraggableArguments, 'attributes'> & {
	listeners?: DraggableSyntheticListeners
	setActivatorNodeRef?: (element: HTMLElement | null) => void
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
				<CrosshairList crosshairs={crosshairs} />
			</Accordion.Panel>
		</Accordion.Item>
	)
}
