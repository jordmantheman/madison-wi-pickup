import { Container, Paper } from '@mantine/core'
import {
  type ActionFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/cloudflare'
import { useActionData } from '@remix-run/react'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { EnterYourAddressForm } from './enter-your-address-form'
import { AddressStore } from '../../address-store.server'
import { StreetDirection, StreetType } from '../../enums'

export const meta: MetaFunction = () => {
  return [
    { title: 'Add an address for Madison, WI' },
    {
      name: 'description',
      content:
        'Add an address for Madison, WI to see your trash and recycling pickup schedule.',
    },
  ]
}

export default function Index() {
  const data = useActionData<typeof action>()

  return (
    <Container miw={320} maw={1024} w="50%">
      <Paper shadow="lg" radius="lg" withBorder p="sm">
        <EnterYourAddressForm
          formProps={{
            method: 'post',
            replace: true,
          }}
          initialValues={data}
        />
      </Paper>
    </Container>
  )
}

const schema = zfd.formData({
  streetDirection: zfd.text(z.nativeEnum(StreetDirection).optional()),
  streetName: zfd.text(z.string().min(1)),
  streetNumber: zfd.numeric(z.number().min(1).max(99999)),
  streetType: zfd.text(z.nativeEnum(StreetType).optional()),
  unitNumber: zfd.numeric(z.number().min(1).max(99999).optional()),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const { streetDirection, streetName, streetNumber, streetType, unitNumber } =
    schema.parse(await request.formData())

  const store = await AddressStore.parse(request)
  store.add({
    streetDirection,
    streetName,
    streetNumber,
    streetType,
    unitNumber,
    city: 'Madison',
    state: 'WI',
  })

  return redirect('/', {
    headers: {
      'Set-Cookie': await store.serialize(),
    },
  })
}
