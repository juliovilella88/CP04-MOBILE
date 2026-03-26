import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registrarUltimoLogin } from '../services/userDataService';
 
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();
 
  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      const usuarioSalvo = await AsyncStorage.getItem("@user");
      if (usuarioSalvo) {
        router.replace("/Home");
      }
    };
    verificarUsuarioLogado();
  }, []);
 
  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
 
    signInWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await registrarUltimoLogin(user.uid, user.email);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        router.replace("/Home");
      })
      .catch(() => {
        Alert.alert("Erro", "Credenciais inválidas");
      });
  };
 
  const esqueceuSenha = () => {
    if (!email) {
      Alert.alert("Erro", "Digite seu e-mail");
      return;
    }
 
    sendPasswordResetEmail(auth, email)
      .then(() => Alert.alert("Sucesso", "E-mail enviado"))
      .catch(() => Alert.alert("Erro", "Falha ao enviar e-mail"));
  };
 
  return (
<View style={styles.container}>
<Text style={styles.titulo}>Login</Text>
 
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
 
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
 
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
<Text style={styles.textoBotao}>Entrar</Text>
</TouchableOpacity>
 
      <Link href="/CadastrarScreen" style={styles.link}>Criar conta</Link>
 
      <TouchableOpacity onPress={esqueceuSenha}>
<Text style={styles.link}>Esqueci a senha</Text>
</TouchableOpacity>
</View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 28, color: '#fff', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 15 },
  botao: { backgroundColor: '#00B37E', padding: 15, borderRadius: 10, alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 18 },
  link: { color: 'white', textAlign: 'center', marginTop: 15 }
});