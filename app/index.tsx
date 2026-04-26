import { Link, useRouter } from 'expo-router';
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
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

import LanguageSelector from '../components/LanguageSelector';
import { loadSavedLanguage } from '../i18n';
import { auth } from '../services/firebaseConfig';
import {
  requestNotificationPermission,
  sendLocalNotification,
} from '../services/notificationService';
import { registrarUltimoLogin } from '../services/userDataService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const setup = async () => {
      await loadSavedLanguage();

      const usuarioSalvo = await AsyncStorage.getItem('@user');

      if (usuarioSalvo) {
        router.replace('/Home');
      }
    };

    void setup();
  }, [router]);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert(t('common.attention'), t('login.fillFields'));
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      const user = userCredential.user;

      try {
        await registrarUltimoLogin(user.uid, user.email);
      } catch (firestoreError) {
        console.log('Erro ao registrar último login:', firestoreError);
      }

      await AsyncStorage.setItem(
        '@user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );

      try {
        const permissionGranted = await requestNotificationPermission();

        if (permissionGranted) {
          await sendLocalNotification(
            t('login.welcomeTitle'),
            t('login.welcomeBody')
          );
        }
      } catch (notificationError) {
        console.log('Erro na notificação de login:', notificationError);
      }

      router.replace('/Home');
    } catch (error: any) {
      console.log('ERRO LOGIN:', error);

      let mensagem = t('login.invalidCredentials');

      if (error?.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error?.code === 'auth/user-not-found') {
        mensagem = 'Usuário não encontrado.';
      } else if (error?.code === 'auth/wrong-password') {
        mensagem = 'Senha incorreta.';
      } else if (error?.code === 'auth/invalid-credential') {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (error?.code === 'auth/network-request-failed') {
        mensagem = 'Erro de conexão. Verifique sua internet.';
      }

      Alert.alert(t('common.error'), mensagem);
    }
  };

  const esqueceuSenha = async () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('login.typeEmail'));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(t('common.success'), t('login.emailSent'));
    } catch (error: any) {
      console.log('ERRO RESET SENHA:', error);

      let mensagem = t('login.emailFailed');

      if (error?.code === 'auth/invalid-email') {
        mensagem = 'E-mail inválido.';
      } else if (error?.code === 'auth/user-not-found') {
        mensagem = 'Usuário não encontrado.';
      }

      Alert.alert(t('common.error'), mensagem);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t('login.title')}</Text>

      <LanguageSelector
        label={t('language.label')}
        ptLabel={t('language.portuguese')}
        enLabel={t('language.english')}
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

      <TouchableOpacity style={styles.botao} onPress={() => void handleLogin()}>
        <Text style={styles.textoBotao}>{t('login.enter')}</Text>
      </TouchableOpacity>

      <Link href="/CadastrarScreen" style={styles.link}>
        {t('login.createAccount')}
      </Link>

      <TouchableOpacity onPress={() => void esqueceuSenha()}>
        <Text style={styles.link}>{t('login.forgotPassword')}</Text>
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
    marginBottom: 30,
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
  link: {
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
  },
});