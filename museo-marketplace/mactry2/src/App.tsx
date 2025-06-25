import { Toaster } from "./components/ui/toaster";
import { Toaster as Sooner } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/toolip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Product1 from "./pages/products/Product1";
import Product2 from "./pages/products/Product2";
import Product3 from "./pages/products/Product3";
import Product4 from "./pages/products/Product4";
import Product5 from "./pages/products/Product5";
import NotFound from "./pages/NotFound";
import React from "react";
import { AuthProvider } from "../auth/auth";
import AdminPanel from "../auth/AdminPanel";
import AdminLogin from "../auth/AdminLogin";
import ProductDynamic from "./pages/ProductDynamic";
import ConfirmarReserva from "./pages/ConfirmarReserva";

const queryClient = new QueryClient();



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AuthProvider>
          <Toaster />
          <Sooner />
          <BrowserRouter>
            <Layout>

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/product/:id" element={<ProductDynamic />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/confirmar-reserva" element={<ConfirmarReserva />} />
            </Routes>
           </Layout>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
