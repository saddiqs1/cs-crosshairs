import { Accordion } from '@mantine/core'
import { CrosshairList } from './CrosshairList'
import { DBTypes } from '@my-types/database'
import { useDroppable } from '@dnd-kit/core'

type Props = {
	id: number
	groupName: string
	crosshairs: DBTypes['crosshairs'][]
}

export const CrosshairGroup: React.FC<Props> = ({
	id,
	groupName,
	crosshairs,
}) => {
	const { isOver, setNodeRef } = useDroppable({ id })
	const style = {
		color: isOver ? 'green' : undefined,
	}

	return (
		<Accordion.Item ref={setNodeRef} style={style} value={groupName}>
			<Accordion.Control>{groupName}</Accordion.Control>
			<Accordion.Panel>
				<CrosshairList crosshairs={crosshairs} />
			</Accordion.Panel>
		</Accordion.Item>
	)
}
