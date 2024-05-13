import {
	DraggableSyntheticListeners,
	UseDraggableArguments,
} from '@dnd-kit/core'

export type DraggableProps = Pick<UseDraggableArguments, 'attributes'> & {
	listeners?: DraggableSyntheticListeners
	setActivatorNodeRef?: (element: HTMLElement | null) => void
}
