import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../src/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword } from "firebase/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  try {
    const auth = getAuth(app);
    await setPersistence(auth, browserSessionPersistence); // <-- Agrega esta línea
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Verifica si es admin
      const db = getFirestore(app);
      const adminRef = doc(db, "admins", userCredential.user.uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        navigate("/admin");
      } else {
        setError("No tienes permisos de administrador.");
      }
    } catch (err: any) {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login de Administrador</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default AdminLogin;