import { Accordion } from '@mantine/core'
import { CrosshairList } from './CrosshairList'
import { DBTypes } from '@my-types/database'

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
	return (
		<Accordion.Item value={groupName}>
			<Accordion.Control>{groupName}</Accordion.Control>
			<Accordion.Panel>
				<CrosshairList id={id} crosshairs={crosshairs} />
			</Accordion.Panel>
		</Accordion.Item>
	)
}
