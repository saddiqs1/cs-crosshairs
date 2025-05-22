import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CrosshairCard, CrosshairCardProps } from '@components/CrosshairCard'
import { UniqueIdentifier } from '@dnd-kit/core'

type Props = {
	id: UniqueIdentifier
	disabled?: boolean
} & CrosshairCardProps

export const SortableCrosshairCardItem: React.FC<Props> = ({ id, disabled, ...crosshairGroupProps }) => {
	const { setNodeRef, setActivatorNodeRef, listeners, transform, isDragging } = useSortable({ id })

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<div ref={disabled ? undefined : setNodeRef} style={style}>
			<CrosshairCard listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} {...crosshairGroupProps} />
		</div>
	)
}
