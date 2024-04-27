import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	CrosshairGroupAccordion,
	CrosshairGroupAccordionProps,
} from '@components/ManagerPage/CrosshairGroupAccordion'

type Props = {
	id: number
} & CrosshairGroupAccordionProps

export const SortableCrosshairGroupAccordion: React.FC<Props> = ({
	id,
	...crosshairGroupProps
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id })

	const style: React.CSSProperties = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style}>
			<CrosshairGroupAccordion
				attributes={attributes}
				listeners={listeners}
				{...crosshairGroupProps}
			/>
		</div>
	)
}
