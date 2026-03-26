import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

type UsuarioBase = {
  uid: string;
  email: string | null;
};

export async function criarPerfilUsuario(params: UsuarioBase & { nome?: string }) {
  const { uid, email, nome } = params;

  const data: Record<string, unknown> = {
    uid,
    email,
    atualizadoEm: serverTimestamp(),
    criadoEm: serverTimestamp(),
  };

  if (nome) {
    data.nome = nome;
  }

  await setDoc(doc(db, "usuarios", uid), data, { merge: true });
}

export async function registrarUltimoLogin(uid: string, email: string | null) {
  await setDoc(
    doc(db, "usuarios", uid),
    {
      uid,
      email,
      ultimoLoginEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  );
}



export async function salvarNotaUsuario(uid: string, titulo: string, descricao: string) {
  await addDoc(collection(db, "usuarios", uid, "notas"), {
    titulo,
    descricao,
    criadoEm: serverTimestamp(),
  });
}

export async function listarNotasUsuario(uid: string) {
  const snapshot = await getDocs(collection(db, "usuarios", uid, "notas"));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function editarNotaUsuario(
  uid: string,
  notaId: string,
  titulo: string,
  descricao: string
) {
  await updateDoc(doc(db, "usuarios", uid, "notas", notaId), {
    titulo,
    descricao,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deletarNotaUsuario(uid: string, notaId: string) {
  await deleteDoc(doc(db, "usuarios", uid, "notas", notaId));
}