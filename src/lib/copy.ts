export const copy = (textToCopy: string) => {
	const tmpElement = document.createElement('input')
	tmpElement.value = textToCopy
	document.body.appendChild(tmpElement)
	tmpElement.select()

	document.execCommand('copy')
	document.body.removeChild(tmpElement)
}
