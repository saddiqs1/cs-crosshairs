import { useEnvironment } from '@lib/hooks/useEnvironment';
import { Badge, Affix } from '@mantine/core';

type Props = {};

const EnvironmentBadge: React.FC<Props> = ({}) => {
	const { env } = useEnvironment();

	return (
		<Affix position={{ bottom: 30, left: 20 }}>
			<Badge
				size="xl"
				radius="sm"
				color={env.color}
				styles={{
					root: {
						fontSize: '1.5rem',
						height: '3rem',
					},
				}}
			>
				{env.label}
			</Badge>
		</Affix>
	);
};

export default EnvironmentBadge;
