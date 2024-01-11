import { Button, Loader, Stack, TextInput } from '@mantine/core'
import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'
import { useCrosshairPost } from '@lib/hooks/useCrosshairPost'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconCircleX, IconCrosshair } from '@tabler/icons-react'

type Props = {}

const crosshairCodeRegex =
	/CSGO-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}/

const formSchema = z.object({
	name: z.string(),
	crosshairCode: z
		.string()
		.regex(crosshairCodeRegex, 'Crosshair code must be in a valid format.'),
})

export type AddCrosshairFormValues = z.infer<typeof formSchema>

export const AddCrosshairForm: React.FC<Props> = ({}) => {
	const { postCrosshair, isUploadingCrosshair } = useCrosshairPost()
	const form = useForm<AddCrosshairFormValues>({
		initialValues: {
			name: '',
			crosshairCode: '',
		},
		validate: zodResolver(formSchema),
	})

	const handleSubmit = async (values: AddCrosshairFormValues) => {
		const res = await postCrosshair(values)
		showNotification({
			message: res?.message,
			icon: res?.success ? (
				<IconCheck size={18} />
			) : (
				<IconCircleX size={18} />
			),
			color: res?.success ? 'green' : 'red',
		})

		// mutateCrosshairs(); // TODO - create crosshair hook
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
				disabled={isUploadingCrosshair || !form.isDirty()}
				leftIcon={
					isUploadingCrosshair ? (
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
