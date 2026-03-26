import {
  Text,
  StyleSheet,
  View,
  Button,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity
} from "react-native";
import { useState, useEffect } from "react";
import { auth } from "../services/firebaseConfig";
import {
  salvarNotaUsuario,
  listarNotasUsuario,
  editarNotaUsuario,
  deletarNotaUsuario
} from "../services/userDataService";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
 
type Nota = {
  id: string;
  titulo: string;
  descricao: string;
};
 
export default function Home() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [notas, setNotas] = useState<Nota[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
 
  const router = useRouter();
 
  const carregarNotas = async () => {
    const user = auth.currentUser;
    if (!user) return;
 
    const dados = await listarNotasUsuario(user.uid);
    setNotas(dados as Nota[]);
  };
 
  useEffect(() => {
    carregarNotas();
  }, []);
 
  const salvarNota = async () => {
    const user = auth.currentUser;
 
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }
 
    if (!titulo || !descricao) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
 
    try {
      if (editandoId) {
        await editarNotaUsuario(user.uid, editandoId, titulo, descricao);
        Alert.alert("Sucesso", "Nota atualizada!");
        setEditandoId(null);
      } else {
        await salvarNotaUsuario(user.uid, titulo, descricao);
        Alert.alert("Sucesso", "Nota criada!");
      }
 
      setTitulo("");
      setDescricao("");
      carregarNotas();
    } catch (error) {
      console.log("Erro ao salvar nota:", error);
    }
  };
 
  const excluirNota = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
 
    await deletarNotaUsuario(user.uid, id);
    carregarNotas();
  };
 
  const editarNota = (nota: Nota) => {
    setTitulo(nota.titulo);
    setDescricao(nota.descricao);
    setEditandoId(nota.id);
  };
 
  const realizarLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("@user");
      router.replace("/");
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  };
 
  return (
<View style={styles.container}>
<Text style={styles.titulo}>Minhas Notas</Text>
 
      <View style={{ marginBottom: 10 }}>
<Button title="Logout" onPress={realizarLogout} />
</View>
 
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />
 
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
 
      <Button
        title={editandoId ? "Atualizar Nota" : "Salvar Nota"}
        onPress={salvarNota}
      />
 
      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
<View style={styles.item}>
<Text style={styles.itemTitulo}>{item.titulo}</Text>
<Text>{item.descricao}</Text>
 
            <View style={styles.botoes}>
<TouchableOpacity onPress={() => editarNota(item)}>
<Text style={{ color: "blue" }}>Editar</Text>
</TouchableOpacity>
 
              <TouchableOpacity onPress={() => excluirNota(item.id)}>
<Text style={{ color: "red" }}>Excluir</Text>
</TouchableOpacity>
</View>
</View>
        )}
        ListEmptyComponent={
<Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhuma nota ainda
</Text>
        }
      />
</View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  item: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },
  itemTitulo: {
    fontWeight: "bold",
    fontSize: 16
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  }
});