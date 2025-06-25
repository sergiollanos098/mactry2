import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../src/firebase";

export interface FirestoreProduct {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria?: string;
}

export function useFirestoreProducts() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirestoreProduct[]
      );
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return { products, loading };
}