import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Container, Paper } from '@mantine/core';
import { useActionData } from "@remix-run/react";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { EnterYourAddressForm } from "./enter-your-address-form";
import { StreetDirection, StreetType } from './enums'

export const meta: MetaFunction = () => {
  return [
    { title: "Trash and Recycling Pickup: Madison WI" },
    { name: "description", content: "A (more) helpful schedule for browsing your trash and recycle services." },
  ];
};

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <Container miw={320} maw={1024} w="50%">
      <Paper shadow="lg" radius="lg" withBorder p="sm">
        <EnterYourAddressForm formProps={{
          method: "post",
          replace: true,
        }} initialValues={data} />
      </Paper>
    </Container>
  );
}


const schema = zfd.formData({
  streetDirection: zfd.text(z.nativeEnum(StreetDirection).optional()),
  streetName: zfd.text(z.string().min(1)),
  streetNumber: zfd.numeric(z.number().min(1).max(99999)),
  streetType: zfd.text(z.nativeEnum(StreetType).optional()),
  unitNumber: zfd.numeric(z.number().min(1).max(99999).optional()),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const { streetDirection, streetName, streetNumber, streetType, unitNumber } = schema.parse(await request.formData());

  // TODO: Write a cookie with the address, schedule, etc.
  // Need to decide what level of information will be stored on the client and
  // refetched from the service.
  return {
    streetDirection,
    streetName,
    streetNumber,
    streetType,
    unitNumber,
  }
}