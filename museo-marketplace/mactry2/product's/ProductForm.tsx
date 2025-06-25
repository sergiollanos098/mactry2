import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";
import { app } from "../src/firebase";

interface ProductFormProps {
  editingProduct?: any;
  onFinishEdit?: () => void;
}

const ProductForm = ({ editingProduct, onFinishEdit }: ProductFormProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setNombre(editingProduct.nombre || "");
      setDescripcion(editingProduct.descripcion || "");
      setPrecio(editingProduct.precio?.toString() || "");
      setImagen(editingProduct.imagen || "");
    } else {
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen("");
    }
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = getFirestore(app);
      if (editingProduct && editingProduct.id) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          imagen,
        });
        if (onFinishEdit) onFinishEdit();
      } else {
        await addDoc(collection(db, "products"), {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          imagen,
          creado: Timestamp.now(),
        });
      }
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen("");
      alert(editingProduct ? "Producto editado correctamente" : "Producto añadido correctamente");
    } catch (error) {
      alert("Error al guardar producto");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-2">{editingProduct ? "Editar producto" : "Añadir producto"}</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="URL de imagen"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Guardando..." : editingProduct ? "Guardar cambios" : "Añadir"}
      </button>
      {editingProduct && (
        <button
          type="button"
          onClick={onFinishEdit}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition mt-2"
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
};

export default ProductForm;