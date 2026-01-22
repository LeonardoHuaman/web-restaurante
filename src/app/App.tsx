import { Routes, Route } from "react-router-dom";
import TableProvider from "../providers/TableProvider";
import TableGuard from "../components/guards/TableGuard";
import MainLayout from "../layouts/MainLayout";
import MenuPage from "../pages/MenuPage";
import OrderStatusPage from "../pages/OrderStatusPage";
import LoginPage from "../pages/LoginPage";
import AdminGuard from "../components/guards/AdminGuard";
import WaiterGuard from "../components/guards/WaiterGuard";
import AdminLayout from "../layouts/AdminLayout";
import WaiterLayout from "../layouts/WaiterLayout";
import AdminCreateWaiterPage from "../pages/admin/AdminCreateWaiterPage";
import WaiterTablesPage from "../pages/waiter/WaiterTablesPage";
import WaiterPartyDetailPage from "../pages/waiter/WaiterPartyDetailPage";
import WaiterMyTablesPage from "../pages/waiter/WaiterMyTablesPage";
import { useLoadPartyCart } from "../hooks/useLoadPartyCart";

const InvalidTable = () => (
  <div className="h-screen flex items-center justify-center">
    <h1 className="text-xl font-bold">Mesa inválida</h1>
  </div>
);

function App() {
  useLoadPartyCart();

  return (
    <div className="min-h-screen bg-primary text-secondary transition-colors duration-300">
      <Routes>
        <Route
          element={
            <TableProvider>
              <TableGuard>
                <MainLayout />
              </TableGuard>
            </TableProvider>
          }
        >
          <Route path="/" element={<MenuPage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
        </Route>

        <Route path="/invalid-table" element={<InvalidTable />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="/admin" element={<AdminCreateWaiterPage />} />
        </Route>

        <Route
          path="/waiter/*"
          element={
            <WaiterGuard>
              <WaiterLayout />
            </WaiterGuard>
          }
        >
          <Route index element={<WaiterTablesPage />} />
          <Route path="my-tables" element={<WaiterMyTablesPage />} />
          <Route path="party/:partyId" element={<WaiterPartyDetailPage />} />
        </Route>

      </Routes>
    </div >
  );
}

export default App;
