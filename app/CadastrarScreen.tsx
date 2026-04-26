import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import LanguageSelector from '../components/LanguageSelector';
import { loadSavedLanguage } from '../i18n';
import { auth } from '../services/firebaseConfig';
import { criarPerfilUsuario } from '../services/userDataService';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    void loadSavedLanguage();
  }, []);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert(t('common.attention'), t('register.fillFields'));
      return;
    }

    if (senha.length < 6) {
      Alert.alert(t('common.attention'), 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      const user = userCredential.user;

      try {
        await criarPerfilUsuario({
          uid: user.uid,
          email: user.email,
          nome: nome.trim(),
        });
      } catch (firestoreError) {
        console.log('Erro ao salvar perfil no Firestore:', firestoreError);
      }

      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          nome: nome.trim(),
        })
      );

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.replace('/Home');
    } catch (error: any) {
      console.log('Erro completo no cadastro:', error);

      let mensagem = t('register.failed');

      if (error?.code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está cadastrado.';
      } else if (error?.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error?.code === 'auth/weak-password') {
        mensagem = 'A senha precisa ter pelo menos 6 caracteres.';
      } else if (error?.code === 'auth/network-request-failed') {
        mensagem = 'Erro de conexão. Verifique sua internet.';
      }

      Alert.alert(t('common.error'), mensagem);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t('register.title')}</Text>

      <LanguageSelector
        label={t('language.label')}
        ptLabel={t('language.portuguese')}
        enLabel={t('language.english')}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.voltar}>{t('common.back')}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder={t('register.name')}
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder={t('login.email')}
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder={t('login.password')}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={() => void handleCadastro()}>
        <Text style={styles.textoBotao}>{t('register.button')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#00B37E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  voltar: {
    color: 'white',
    marginBottom: 10,
  },
});