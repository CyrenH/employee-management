import { Container, Title } from "@mantine/core";
import EmployeeForm from "./components/EmployeeForm";

const App = () => (
    <Container size="sm" py="xl">
        <Title order={1} mb="lg">Employee Management System</Title>
        <EmployeeForm />
    </Container>
);

export default App;