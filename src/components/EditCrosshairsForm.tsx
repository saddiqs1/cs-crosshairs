import {
	ActionIcon,
	Button,
	Flex,
	Loader,
	Stack,
	TextInput,
} from '@mantine/core'
import { z } from 'zod'
import { useForm, zodResolver } from '@mantine/form'
import { useCrosshairPost } from '@lib/hooks/useCrosshairPost'
import { showNotification } from '@mantine/notifications'
import {
	IconCheck,
	IconCircleX,
	IconCrosshair,
	IconTrash,
	IconTrashOff,
} from '@tabler/icons-react'
import { useCrosshair } from '@lib/hooks/useCrosshair'
import { DBTypes } from '@my-types/database'

type Props = {
	onComplete: () => void
	crosshairs: DBTypes['crosshairs'][]
}

const crosshairCodeRegex =
	/CSGO-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}/

const formSchema = z.object({
	crosshairs: z.array(
		z.object({
			id: z.optional(z.number()),
			name: z.string(),
			crosshair: z
				.string()
				.regex(
					crosshairCodeRegex,
					'Crosshair code must be in a valid format.'
				),
			user_id: z.number().nullable(),
		})
	),
	crosshairsToDelete: z.array(z.number()),
})

export type EditCrosshairFormValues = z.infer<typeof formSchema>

export const EditCrosshairsForm: React.FC<Props> = ({
	onComplete,
	crosshairs,
}) => {
	const { updateCrosshairs, isCrosshairsUpdating } = useCrosshairPost()
	const { mutateCrosshairs } = useCrosshair()
	const form = useForm<EditCrosshairFormValues>({
		initialValues: {
			crosshairs,
			crosshairsToDelete: [],
		},
		validate: zodResolver(formSchema),
	})

	const handleSubmit = async (values: EditCrosshairFormValues) => {
		const crosshairs = values.crosshairs.filter(
			(r) => !r.id || values.crosshairsToDelete.indexOf(r.id) === -1
		)

		const res = await updateCrosshairs({
			crosshairs,
			crosshairsToDelete: values.crosshairsToDelete,
		})
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

	const isSelectedForDeletion = (id?: number) => {
		for (const val of form.values.crosshairsToDelete) {
			if (val === id) {
				return true
			}
		}

		return false
	}

	const deleteCrosshair = (val: boolean, i: number) => {
		if (val) {
			form.insertListItem(
				'crosshairsToDelete',
				form.getInputProps(`crosshairs.${i}.id`).value
			)
		} else {
			form.setFieldValue(
				'crosshairsToDelete',
				form.values.crosshairsToDelete.filter(
					(number) =>
						number !==
						form.getInputProps(`crosshairs.${i}.id`).value
				)
			)
		}
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit, handleInvalidForm)}>
			<Stack pb={'xl'} spacing={'sm'}>
				{form.values.crosshairs.map((c, i) => (
					<Flex
						justify='flex-start'
						align='flex-end'
						direction='row'
						wrap='wrap'
						gap={'md'}
						px={'lg'}
						py={'xs'}
						key={i}
						sx={(theme) => ({
							background: isSelectedForDeletion(c.id)
								? theme.fn.rgba(theme.colors.red[9], 0.3)
								: theme.colors.dark[6],
							borderRadius: theme.radius.md,
							border: `1px ${theme.colors.dark[4]} solid`,
						})}
					>
						<TextInput
							label={'Edit Name'}
							{...form.getInputProps(`crosshairs.${i}.name`)}
						/>
						<TextInput
							label={'Edit Crosshair Code'}
							required
							{...form.getInputProps(`crosshairs.${i}.crosshair`)}
						/>
						<ActionIcon
							color={isSelectedForDeletion(c.id) ? 'teal' : 'red'}
							onClick={() =>
								deleteCrosshair(!isSelectedForDeletion(c.id), i)
							}
							size={'xl'}
							variant={'outline'}
						>
							{isSelectedForDeletion(c.id) ? (
								<IconTrashOff />
							) : (
								<IconTrash />
							)}
						</ActionIcon>
					</Flex>
				))}
			</Stack>
			<Button
				type='submit'
				disabled={isCrosshairsUpdating || !form.isDirty()}
				leftIcon={
					isCrosshairsUpdating ? (
						<Loader size={'xs'} />
					) : (
						<IconCrosshair />
					)
				}
			>
				Update Crosshairs
			</Button>
		</form>
	)
}
