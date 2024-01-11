import fetcher from '@lib/fetcher'
import { User } from '@my-types/user'
import useSWRImmutable from 'swr/immutable'

export function useUser() {
	const { data, isLoading } = useSWRImmutable<{
		message: User
		success: boolean
	}>(`/api/auth/user`, fetcher)

	let user: User | undefined = undefined
	if (data && data.success) {
		user = data.message
	}

	return { user, isLoading }
}
