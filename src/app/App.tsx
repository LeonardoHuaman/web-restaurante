import { Routes, Route } from "react-router-dom";
import TableProvider from "../features/tables/TableProvider";
import TableGuard from "../features/auth/guards/TableGuard";
import MainLayout from "../layouts/MainLayout";
import MenuPage from "../pages/MenuPage";
import OrderStatusPage from "../pages/OrderStatusPage";
import LoginPage from "../pages/LoginPage";
import AdminGuard from "../features/auth/guards/AdminGuard";
import WaiterGuard from "../features/auth/guards/WaiterGuard";
import AdminLayout from "../layouts/AdminLayout";
import WaiterLayout from "../layouts/WaiterLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminCreateWaiterPage from "../pages/admin/AdminCreateWaiterPage";
import AdminMenuCMSPage from "../pages/admin/AdminMenuCMSPage";
import AdminStatsPage from "../pages/admin/AdminStatsPage";
import AdminTablesPage from "../pages/admin/AdminTablesPage";
import WaiterTablesPage from "../pages/waiter/WaiterTablesPage";
import WaiterPartyDetailPage from "../pages/waiter/WaiterPartyDetailPage";
import WaiterMyTablesPage from "../pages/waiter/WaiterMyTablesPage";
import { useLoadPartyCart } from "../features/orders/hooks/useLoadPartyCart";
import RestaurantSettingsPage from "../pages/admin/RestaurantSettingsPage";

const InvalidTable = () => (
  <div className="h-screen flex items-center justify-center bg-primary text-secondary">
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
          <Route index element={<MenuPage />} />
          <Route path="order-status" element={<OrderStatusPage />} />
        </Route>

        <Route path="invalid-table" element={<InvalidTable />} />

        <Route path="login" element={<LoginPage />} />
        <Route
          path="admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="mozos" element={<AdminCreateWaiterPage />} />
          <Route path="menu" element={<AdminMenuCMSPage />} />
          <Route path="mesas" element={<AdminTablesPage />} />
          <Route path="estadisticas" element={<AdminStatsPage />} />
          <Route path="configuracion" element={<RestaurantSettingsPage />} />
        </Route>

        <Route
          path="waiter"
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
    </div>
  );
}

export default App;
