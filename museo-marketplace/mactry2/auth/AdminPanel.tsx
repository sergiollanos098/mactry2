import React, { useState } from "react";
import { useAuth } from "./auth";
import ProductForm from "../product's/ProductForm";
import ProductList from "../product's/ProductList";

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [editingProduct, setEditingProduct] = useState<any>(null);

  if (!isAdmin) return <div>No tienes acceso a esta página.</div>;

  return (
    <div>
      <h2>Panel de Administración</h2>
      <ProductForm
        editingProduct={editingProduct}
        onFinishEdit={() => setEditingProduct(null)}
      />
      <ProductList onEdit={setEditingProduct} />
    </div>
  );
};

export default AdminPanel;