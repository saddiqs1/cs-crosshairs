export const copy = async (textToCopy: string) => {
	try {
		await navigator.clipboard.writeText(textToCopy)
	} catch (error: any) {
		throw new Error(error)
	}
}
