import { Anchor, AppShell, Container, Group } from "@mantine/core";
import { Link, Outlet } from "react-router";

const AppLayout = () => {

    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Container size="lg" h="100%">
                    <Group h="100%">
                        <Anchor
                            component={Link}
                            to="/employees"
                            fw={700}
                            size="lg"
                            c="inherit"
                            underline="never"
                        >
                            Employee Management System
                        </Anchor>
                    </Group>
                </Container>
            </AppShell.Header>

            <AppShell.Main>
                <Container size="lg" py="md">
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
};

export default AppLayout;