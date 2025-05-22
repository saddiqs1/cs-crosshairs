import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { UniqueIdentifier } from '@dnd-kit/core'
import { ActionIcon, Stack } from '@mantine/core'
import { IconGripVertical } from '@tabler/icons-react'

type Props = {
	id: UniqueIdentifier
	children: React.ReactElement | React.ReactElement[]
	disabled?: boolean
	items: UniqueIdentifier[]
}

export const DroppableContainer: React.FC<Props> = ({ id, children, items, disabled }) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transition, transform, isDragging } = useSortable({
		id,
		data: {
			type: 'container',
			children: items,
		},
	})

	const style: React.CSSProperties = {
		transition,
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<div ref={disabled ? undefined : setNodeRef} style={{ ...style, border: 'solid 1px red' }}>
			<Stack>
				<ActionIcon size='xl' ref={setActivatorNodeRef} {...attributes} {...listeners}>
					<IconGripVertical size='1rem' />
				</ActionIcon>
				{children}
			</Stack>
		</div>
	)
}

export const Container: React.FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
	return (
		<Stack>
			<ActionIcon size='xl'>
				<IconGripVertical size='1rem' />
			</ActionIcon>
			{children}
		</Stack>
	)
}
