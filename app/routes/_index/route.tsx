import type { MetaFunction } from "@remix-run/cloudflare";
import { EnterYourAddressForm } from "./enter-your-address-form";
import { Container, Paper } from '@mantine/core';

export const meta: MetaFunction = () => {
  return [
    { title: "Trash and Recycling Pickup: Madison WI" },
    { name: "description", content: "A (more) helpful schedule for browsing your trash and recycle services." },
  ];
};

export default function Index() {
  return (
    <Container miw={320} maw={1024} w="50%">
      <Paper shadow="lg" radius="lg" withBorder p="sm">
        <EnterYourAddressForm formProps={{
          method: "post",
          replace: true,
        }} />
      </Paper>
    </Container>
  );
}
