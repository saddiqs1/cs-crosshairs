import {
	ActionIcon,
	Button,
	Flex,
	Loader,
	Stack,
	TextInput,
} from '@mantine/core'
import { z } from 'zod'
import { useForm, schemaResolver } from '@mantine/form'
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
import { editCrosshairsSchema } from '@lib/crosshairSchemas'

type Props = {
	onComplete: () => void
	crosshairs: DBTypes['crosshairs'][]
}

const formSchema = editCrosshairsSchema

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
		validate: schemaResolver(formSchema, { sync: true }),
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
			<Stack pb={'xl'} gap={'sm'}>
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
						style={{
							background: isSelectedForDeletion(c.id)
								? 'rgba(224, 49, 49, 0.3)'
								: 'var(--mantine-color-dark-6)',
							borderRadius: 'var(--mantine-radius-md)',
							border: '1px solid var(--mantine-color-dark-4)',
						}}
					>
						<TextInput
							label={'Edit Name'}
							{...form.getInputProps(`crosshairs.${i}.name`)}
						/>
						<TextInput
							label={'Edit Crosshair Code'}
							required
							w={450}
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
				leftSection={
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
