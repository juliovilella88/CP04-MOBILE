import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from "../services/firebaseConfig";

import { useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { criarPerfilUsuario } from '../services/userDataService';
 
export default function CadastroScreen() {

  const [nome, setNome] = useState('');

  const [email, setEmail] = useState('');

  const [senha, setSenha] = useState('');
 
  const router = useRouter();
 
  const handleCadastro = () => {

    if (!nome || !email || !senha) {

      Alert.alert('Atenção', 'Preencha todos os campos!');

      return;

    }
 
    createUserWithEmailAndPassword(auth, email, senha)

      .then(async (userCredential) => {

        const user = userCredential.user;
 
        await criarPerfilUsuario({

          uid: user.uid,

          email: user.email,

          nome

        });
 
        await AsyncStorage.setItem("@user", JSON.stringify(user));

        router.replace("/Home");

      })

      .catch(() => {

        Alert.alert("Erro", "Falha ao cadastrar");

      });

  };
 
  return (
<View style={styles.container}>
<Text style={styles.titulo}>Criar Conta</Text>
 
      <TouchableOpacity onPress={() => router.back()}>
<Text style={styles.voltar}>← Voltar</Text>
</TouchableOpacity>
 
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
<TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} />
<TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
 
      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
<Text style={styles.textoBotao}>Cadastrar</Text>
</TouchableOpacity>
</View>

  );

}
 
const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },

  titulo: { fontSize: 28, color: '#fff', textAlign: 'center', marginBottom: 20 },

  input: { backgroundColor: '#1E1E1E', color: '#fff', borderRadius: 10, padding: 15, marginBottom: 15 },

  botao: { backgroundColor: '#00B37E', padding: 15, borderRadius: 10, alignItems: 'center' },

  textoBotao: { color: '#fff', fontSize: 18 },

  voltar: { color: 'white', marginBottom: 10 }

});
 