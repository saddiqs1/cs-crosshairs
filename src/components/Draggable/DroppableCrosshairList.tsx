import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { DBTypes } from '@my-types/database'
import { SortableCrosshairCardItem } from './SortableCrosshairCardItem'
import { CROSSHAIR_PREFIX } from '@components/ManagerPage/ManagerPageCrosshairs'

type Props = {
	id: string
	crosshairs: DBTypes['crosshairs'][]
}

export const DroppableCrosshairList: React.FC<Props> = ({ id, crosshairs }) => {
	const { setNodeRef } = useDroppable({ id })

	return (
		<SortableContext
			id={id}
			items={crosshairs.map((c) => `${CROSSHAIR_PREFIX}${c.id}`)}
			strategy={rectSortingStrategy}
		>
			<div
				ref={setNodeRef}
				style={{
					display: 'flex',
					justifyContent: 'left',
					alignItems: 'end',
					gap: '1.5rem',
					flexWrap: 'wrap',
				}}
			>
				{crosshairs.map((c, i) => (
					<SortableCrosshairCardItem
						key={`${CROSSHAIR_PREFIX}${c.id}`}
						id={`${CROSSHAIR_PREFIX}${c.id}`}
						crosshairCode={c.crosshair}
						name={c.name}
					/>
				))}
			</div>
		</SortableContext>
	)
}
