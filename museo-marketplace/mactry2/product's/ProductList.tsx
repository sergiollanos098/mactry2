import React, { useEffect, useState,useRef } from "react";
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { app } from "../src/firebase";
import QRCode from "react-qr-code";
const ProductList = ({ onEdit }: { onEdit: (product: any) => void }) => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(app);
    const unsubscribe = onSnapshot(collection(db, "products"), (querySnapshot) => {
      setProductos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Eliminar el producto "${nombre}"?`)) {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "products", id));
      // No necesitas llamar a fetchProductos, onSnapshot lo hará automáticamente
    }
  };

  const downloadQR = (id) => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngFile;
        downloadLink.download = `qr-producto-${id}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    img.src = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svgString)));
  };

  if (loading) return <div className="text-center py-4">Cargando productos...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Productos</h3>
      <ul className="space-y-2">
        {productos.map((prod) => (
          <li
            key={prod.id}
            className="flex items-center justify-between px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="font-medium text-gray-800">{prod.nombre}</span>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => onEdit(prod)}
                type="button"
              >
                Editar
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(prod.id, prod.nombre)}
                type="button"
              >
                Eliminar
              </button>
              <span className="text-gray-500 ml-2">S./{prod.precio}</span>
              <div className="flex flex-col items-center ml-4">
        <QRCode
          id={`qr-${prod.id}`}
          value={`https://macdemo2.web.app/product/${prod.id}`}
          size={48}
        />
        <button
          className="mt-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
          onClick={() => downloadQR(prod.id)}
          type="button"
        >
          Descargar QR
        </button>
      </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;