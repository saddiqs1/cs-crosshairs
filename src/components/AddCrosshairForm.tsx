import { Button, Loader, Stack, TextInput } from '@mantine/core'
import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'
import { useAddCrosshairPost } from '@lib/hooks/useAddCrosshairPost'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconCircleX, IconCrosshair } from '@tabler/icons-react'
import { useCrosshair } from '@lib/hooks/useCrosshair'
import { getCrosshair } from '@lib/crosshairUtils'

type Props = {
	onComplete: () => void
}

const crosshairCodeRegex =
	/CSGO-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}/

const formSchema = z.object({
	name: z.string(),
	crosshairCode: z
		.string()
		.regex(crosshairCodeRegex, 'Crosshair code must be in a valid format.')
		.refine(
			(val) => {
				try {
					getCrosshair(val)
				} catch (error) {
					return false
				}

				return true
			},
			{
				message: 'Invalid or old crosshair code.',
			}
		),
})

export type AddCrosshairFormValues = z.infer<typeof formSchema>

export const AddCrosshairForm: React.FC<Props> = ({ onComplete }) => {
	const { addCrosshair, isAddingCrosshair } = useAddCrosshairPost()
	const { mutateCrosshairs } = useCrosshair()
	const form = useForm<AddCrosshairFormValues>({
		initialValues: {
			name: '',
			crosshairCode: '',
		},
		validate: zodResolver(formSchema),
	})

	const handleSubmit = async (values: AddCrosshairFormValues) => {
		const res = await addCrosshair(values)
		showNotification({
			message: res?.message,
			icon: res?.success ? (
				<IconCheck size={18} />
			) : (
				<IconCircleX size={18} />
			),
			color: res?.success ? 'green' : 'red',
		})

		mutateCrosshairs()
		onComplete()
	}

	const handleInvalidForm = (errors: typeof form.errors) => {
		if (errors) {
			showNotification({
				message: 'There is an error with the form',
				color: 'red',
			})
		}
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit, handleInvalidForm)}>
			<Stack pb={'xl'} spacing={'sm'}>
				<TextInput
					label={'Enter Name'}
					{...form.getInputProps('name')}
				/>
				<TextInput
					label={'Enter Crosshair Code'}
					required
					{...form.getInputProps('crosshairCode')}
				/>
			</Stack>
			<Button
				type='submit'
				disabled={isAddingCrosshair || !form.isDirty()}
				leftIcon={
					isAddingCrosshair ? (
						<Loader size={'xs'} />
					) : (
						<IconCrosshair />
					)
				}
			>
				Save Crosshair
			</Button>
		</form>
	)
}
