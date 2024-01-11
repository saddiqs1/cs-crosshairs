import { AddCrosshairFormValues } from '@components/AddCrosshairForm'
import useSWRMutation from 'swr/mutation'

async function postRequest(
	url: RequestInfo,
	{ arg }: { arg: AddCrosshairFormValues }
) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(arg),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(
		(res) =>
			res.json() as Promise<{
				message: string
				success: boolean
			}>
	)
}

export function useCrosshairPost() {
	const { trigger, isMutating } = useSWRMutation(
		`/api/crosshair`,
		postRequest
	)

	return { postCrosshair: trigger, isUploadingCrosshair: isMutating }
}
