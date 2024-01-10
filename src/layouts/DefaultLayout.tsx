import { AppShell } from '@mantine/core'
import { useEnvironment } from '@lib/hooks/useEnvironment'
import EnvironmentBadge from '@components/Layout/EnvironmentBadge'
import { Header } from '@components/Layout/Header/Header'

type Props = {
	children: React.ReactElement
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
	const { isLocal } = useEnvironment()

	return (
		<AppShell header={<Header />}>
			{children}
			{isLocal && <EnvironmentBadge />}
		</AppShell>
	)
}

export default DefaultLayout
