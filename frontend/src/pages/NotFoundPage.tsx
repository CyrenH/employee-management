import { Button, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

const NotFoundPage = () => (
    <Stack align="center" py="xl" gap="xs">
        <Title order={1} size="h3">Page not found</Title>
        <Text c="dimmed">The page you are looking for does not exist.</Text>
        <Button component={Link} to="/employees" mt="sm">Back to Employees</Button>
    </Stack>
);

export default NotFoundPage;