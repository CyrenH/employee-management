import {Navigate, Route, Routes} from "react-router";
import AppLayout from "./components/AppLayout";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeCreatePage from "./pages/EmployeeCreatePage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => (
    <Routes>
        <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/employees" replace />} />
            <Route path="employees" element={<EmployeeListPage />} />
            <Route path="employees/new" element={<EmployeeCreatePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
);

export default App;