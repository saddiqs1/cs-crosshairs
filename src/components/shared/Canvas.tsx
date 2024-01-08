import React, { useEffect, useRef } from 'react'

const Canvas = (
	props: React.JSX.IntrinsicAttributes &
		React.ClassAttributes<HTMLCanvasElement> &
		React.CanvasHTMLAttributes<HTMLCanvasElement> & {
			draw: (ctx: CanvasRenderingContext2D) => void
		}
) => {
	const { draw, ...rest } = props
	const canvasRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current as any
		const context = canvas.getContext('2d') as CanvasRenderingContext2D

		//Our first draw
		draw(context)
	}, [draw])

	return <canvas ref={canvasRef} {...props} />
}

export default Canvas
