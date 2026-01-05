import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import ReservationsPage from "@/pages/ReservationsPage";
import AboutPage from "@/pages/AboutPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper for customer pages
function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
          <Route path="/reservations" element={<CustomerLayout><ReservationsPage /></CustomerLayout>} />
          <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
          <Route path="/order-confirmation" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminDashboardPage />} />
            <Route path="menu" element={<AdminDashboardPage />} />
            <Route path="reservations" element={<AdminDashboardPage />} />
            <Route path="settings" element={<AdminDashboardPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
