import { User } from '@lib/auth/session'
import fetcher from '@lib/fetcher'
import useSWRImmutable from 'swr/immutable'

export function useUser() {
	const { data, isLoading, error } = useSWRImmutable<{
		message: User
		success: boolean
	}>(`/api/auth/user`, fetcher)

	let user: User | undefined = undefined
	if (data && data.success) {
		user = data.message
	}

	return { user, isLoading, error }
}
