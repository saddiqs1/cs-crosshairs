import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	CrosshairGroup,
	CrosshairGroupProps,
} from '@components/ManagerPage/CrosshairGroup'

type Props = {
	id: number
} & CrosshairGroupProps

export const SortableCrosshairGroup: React.FC<Props> = ({
	id,
	...crosshairGroupProps
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<CrosshairGroup {...crosshairGroupProps} />
		</div>
	)
}
