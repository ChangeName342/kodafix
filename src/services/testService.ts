import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Escribir un documento
export const addTest = async () => {
  await addDoc(collection(db, "test"), {
    mensaje: "Hola Firebase",
    fecha: new Date()
  });
};

// Leer documentos
export const getTests = async () => {
  const snapshot = await getDocs(collection(db, "test"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};