import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFirestoreProducts } from "../../hooks/FirestoreProduct";
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { app } from "../firebase";
import { useAuth } from "../../auth/auth";
import { deleteDoc, doc as firestoreDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import emailjs from "@emailjs/browser";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const BAD_WORDS = [
  "puta", "mierda", "idiota", "imbecil", "estupido", "pendejo", "cabron", "maldito", "joder", "fuck", "shit", "bitch"
];

function containsBadWords(text: string) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

async function containsEnglishProfanity(text: string) {
  const url = `https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const isProfane = await res.text();
    return isProfane === "true";
  } catch {
    return false;
  }
}

const ProductDynamic = () => {
  const { id } = useParams();
  const { products, loading } = useFirestoreProducts();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { isAdmin } = useAuth();

  // Reserva
  const [showReserva, setShowReserva] = useState(false);
  const [reserva, setReserva] = useState({
  nombreCompleto: "",
  correo: "",
  });
  const [reservaError, setReservaError] = useState("");
  const [reservaSuccess, setReservaSuccess] = useState("");

  const product = products.find((p) => p.id === id);

  // Cargar reseñas del producto
  const fetchReviews = async () => {
    if (!id) return;
    setLoadingReviews(true);
    const db = getFirestore(app);
    const q = query(collection(db, "reviews"), where("productId", "==", id));
    const querySnapshot = await getDocs(q);
    setReviews(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
    setLoadingReviews(false);
  };
  

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [id]);

const sugeridos = products
    .filter((p) => p.id !== id)
    .slice(0, 6);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 2, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 4, spacing: 24 } },
    },
    loop: true,
  });

  // Validación de datos de reserva
  function validarDatos() {
  if (!reserva.nombreCompleto.trim()) return false;
  if (!/\S+@\S+\.\S+/.test(reserva.correo)) return false;
  return true;
}

  const handleReservaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleReservaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReservaError("");
    setReservaSuccess("");
    if (!reserva.nombreCompleto || !reserva.correo) {
  setReservaError("Completa todos los campos.");
  return;
}
    if (!validarDatos()) {
      setReservaError("Datos inválidos. Verifica los campos.");
      return;
    }

    // 1. Guarda la reserva en Firestore
    const db = getFirestore(app);
    const token = uuidv4();
    await addDoc(collection(db, "reservas"), {
  nombreCompleto: reserva.nombreCompleto,
  correo: reserva.correo,
  productId: id,
  producto: product?.nombre || "",
  fecha: Timestamp.now(),
  estado: "pendiente",
  token,
});

    // 2. Prepara el enlace de confirmación
    const confirmUrl = `${window.location.origin}/confirmar-reserva?token=${token}`;

    // 3. Envía el correo con EmailJS
    try {
      await emailjs.send(
  "service_lczuxk7",
  "template_a5jfa69",
  {
    nombreCompleto: reserva.nombreCompleto,
    to_email: reserva.correo,
    confirm_url: confirmUrl,
    producto: product?.nombre || "",
  },
  "ZfAQPHbwe6a7HzWAn"
);
      setReservaSuccess("¡Reserva realizada y notificada por correo!");
      setShowReserva(false);
      setReserva({
  nombreCompleto: "",
  correo: "",
});
    } catch {
      setReservaError("Error al enviar correo de notificación.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    const db = getFirestore(app);
    await deleteDoc(firestoreDoc(db, "reviews", reviewId));
    fetchReviews();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    if (containsBadWords(reviewText)) {
      alert("Tu comentario contiene lenguaje inapropiado.");
      return;
    }
    if (await containsEnglishProfanity(reviewText)) {
      alert("Your comment contains inappropriate language.");
      return;
    }
    const db = getFirestore(app);
    await addDoc(collection(db, "reviews"), {
      productId: id,
      text: reviewText,
      created: Timestamp.now(),
    });
    setReviewText("");
    fetchReviews();
  };

  if (loading) return <div>Cargando...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start max-w-4xl mx-auto mt-8">
      <img
        src={product.imagen}
        alt={product.nombre}
        className="w-full md:w-80 h-80 object-cover rounded shadow"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">{product.nombre}</h1>
        <p className="text-lg mb-6" style={{ whiteSpace: "pre-line" }}>
  {product.descripcion}
</p>
        <p className="text-2xl font-semibold mb-4">S./{product.precio}</p>
        <div className="flex gap-4 mb-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowReserva(true)}
          >
            Reserva
          </button>
        </div>

        {/* Formulario de reserva */}
        {showReserva && (
          <form onSubmit={handleReservaSubmit} className="bg-white p-4 rounded shadow space-y-3 mb-4">
            <h3 className="font-bold text-lg mb-2">Reserva este producto</h3>
  <input
    type="text"
    name="nombreCompleto"
    placeholder="Nombres y Apellidos"
    value={reserva.nombreCompleto}
    onChange={handleReservaChange}
    className="w-full px-3 py-2 border rounded"
    required
  />
  <input
    type="email"
    name="correo"
    placeholder="Correo"
    value={reserva.correo}
    onChange={handleReservaChange}
    className="w-full px-3 py-2 border rounded"
    required
  />
            {reservaError && <div className="text-red-600">{reservaError}</div>}
            {reservaSuccess && <div className="text-green-600">{reservaSuccess}</div>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Reservar
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowReserva(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Sección de reseñas SIEMPRE visible */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Reseñas</h2>
          <form onSubmit={handleReviewSubmit} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu comentario..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Comentar
            </button>
          </form>
          {loadingReviews ? (
            <div>Cargando reseñas...</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-500">Sé el primero en comentar.</div>
          ) : (
            <ul className="space-y-2">
              {reviews.map((r) => (
                <li key={r.id} className="bg-white p-2 rounded shadow flex items-center justify-between">
                  <span>{r.text}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="ml-2 text-red-600 font-bold hover:bg-red-100 rounded px-2"
                      title="Eliminar comentario"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {sugeridos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">También podría interesarte</h2>
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 hover:bg-gray-100"
                onClick={() => slider.current?.prev()}
                aria-label="Anterior"
                style={{ left: -24 }}
              >
                &#8592;
              </button>
              <div ref={sliderRef} className="keen-slider">
                {sugeridos.map((prod) => (
                  <div key={prod.id} className="keen-slider__slide flex flex-col items-center bg-white rounded shadow p-3 ">
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-28 h-28 object-contain mb-2"
                    />
                    <div className="font-medium text-center">{prod.nombre}</div>
                    <div className="text-red-600 font-bold text-lg">S/ {prod.precio}</div>
                    <a
                      href={`/product/${prod.id}`}
                      className="mt-2 text-blue-600 underline text-sm"
                    >
                      Ver producto
                    </a>
                  </div>
                ))}
              </div>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 hover:bg-gray-100"
                onClick={() => slider.current?.next()}
                aria-label="Siguiente"
                style={{ right: -24 }}
              >
                &#8594;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDynamic;