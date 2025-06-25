import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../firebase";
import emailjs from "@emailjs/browser";

const ConfirmarReserva = () => {
  const [params] = useSearchParams();
  const [mensaje, setMensaje] = useState("Confirmando reserva...");

  useEffect(() => {
    const confirmar = async () => {
      const token = params.get("token");
      if (!token) {
        setMensaje("Token inválido.");
        return;
      }
      const db = getFirestore(app);
      const q = query(collection(db, "reservas"), where("token", "==", token));
      const snap = await getDocs(q);
      if (snap.empty) {
        setMensaje("Reserva no encontrada o ya confirmada.");
        return;
      }
      const reservaDoc = snap.docs[0];
      await updateDoc(doc(db, "reservas", reservaDoc.id), { estado: "confirmada" });
      setMensaje("¡Reserva confirmada exitosamente!");

      // 1. Enviar correo de confirmación al cliente
      try {
        await emailjs.send(
          "service_lczuxk7",
          "template_confirmacion",
          {
            to_email: reservaDoc.data().correo,
            nombres: reservaDoc.data().nombres,
            producto: reservaDoc.data().producto || "",
          },
          "ZfAQPHbwe6a7HzWAn"
        );
      } catch {}

      // 2. Enviar notificación al vendedor
      try {
        await emailjs.send(
          "service_lczuxk7",
          "template_vod4zut", // Crea una plantilla para el vendedor
          {
            to_email: "sergiollanos.sl@gmail.com", // Cambia por tu correo de vendedor
            nombres: reservaDoc.data().nombres,
            apellidos: reservaDoc.data().apellidos,
            correo_cliente: reservaDoc.data().correo,
            producto: reservaDoc.data().producto || "",
          },
          "ZfAQPHbwe6a7HzWAn"
        );
      } catch {}
    };
    confirmar();
  }, [params]);

  return <div className="p-8 text-center">{mensaje}</div>;
};

export default ConfirmarReserva;