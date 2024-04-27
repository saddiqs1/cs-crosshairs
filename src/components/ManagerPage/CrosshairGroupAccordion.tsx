import { Accordion, ActionIcon, Box } from '@mantine/core'
import { CrosshairList } from './CrosshairList'
import { DBTypes } from '@my-types/database'
import {
	DraggableSyntheticListeners,
	UseDraggableArguments,
	UseDroppableArguments,
} from '@dnd-kit/core'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'

export type CrosshairGroupAccordionProps = {
	groupName: string
	crosshairs: DBTypes['crosshairs'][]
}

type DraggableProps = Pick<UseDraggableArguments, 'attributes'> & {
	listeners: DraggableSyntheticListeners
}

export const CrosshairGroupAccordion: React.FC<
	CrosshairGroupAccordionProps & DraggableProps
> = ({ groupName, crosshairs, attributes, listeners }) => {
	return (
		<Accordion
			variant='separated'
			chevronPosition='left'
			defaultValue={groupName}
		>
			<Accordion.Item value={groupName}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Accordion.Control>{groupName}</Accordion.Control>
					<Box pr={'xs'}>
						<ActionIcon
							size='xl'
							onClick={() => {
								alert(
									'TODO - only appear once hovering, create confirmation dialog'
								)
							}}
						>
							<IconTrash size='1rem' />
						</ActionIcon>
					</Box>
					<Box pr={'xs'}>
						<ActionIcon size='xl' {...attributes} {...listeners}>
							<IconGripVertical size='1rem' />
						</ActionIcon>
					</Box>
				</Box>
				<Accordion.Panel>
					<CrosshairList crosshairs={crosshairs} />
				</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	)
}
