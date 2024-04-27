import { Accordion } from '@mantine/core'
import { CrosshairList } from './CrosshairList'
import { DBTypes } from '@my-types/database'

export type CrosshairGroupProps = {
	groupName: string
	crosshairs: DBTypes['crosshairs'][]
}

export const CrosshairGroup: React.FC<CrosshairGroupProps> = ({
	groupName,
	crosshairs,
}) => {
	return (
		<Accordion.Item value={groupName}>
			<Accordion.Control>{groupName}</Accordion.Control>
			<Accordion.Panel>
				<CrosshairList crosshairs={crosshairs} />
			</Accordion.Panel>
		</Accordion.Item>
	)
}
