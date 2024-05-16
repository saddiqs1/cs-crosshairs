import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CrosshairCard, CrosshairCardProps } from '@components/CrosshairCard'

type Props = {
	id: string
} & CrosshairCardProps

export const SortableCrosshairCardItem: React.FC<Props> = ({
	id,
	...crosshairGroupProps
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		isDragging,
	} = useSortable({ id, transition: null })

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<div ref={setNodeRef} style={style}>
			<CrosshairCard
				attributes={attributes}
				listeners={listeners}
				setActivatorNodeRef={setActivatorNodeRef}
				{...crosshairGroupProps}
			/>
		</div>
	)
}
