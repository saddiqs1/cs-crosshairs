export const getColor = (
	colorCode: number,
	r: number,
	g: number,
	b: number,
	alphaEnabled: boolean,
	alpha: number
) => {
	if (colorCode === 1) {
		return `rgb(46, 250, 46, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 2) {
		return `rgb(250, 250, 46, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 3) {
		return `rgb(46, 46, 250, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 4) {
		return `rgb(46, 250, 250, ${alphaEnabled ? alpha / 255 : 1})`
	} else if (colorCode === 5) {
		return `rgba(${r}, ${g}, ${b}, ${alphaEnabled ? alpha / 255 : 1})`
	}

	return `rgb(46, 250, 46, ${alphaEnabled ? alpha / 255 : 1})`
}