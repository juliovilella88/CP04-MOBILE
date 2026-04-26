import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import MapModal from '../components/MapModal';
import { auth } from '../services/firebaseConfig';
import { getCurrentNoteLocation } from '../services/locationService';
import { requestNotificationPermission, sendLocalNotification } from '../services/notificationService';
import {
  deletarNotaUsuario,
  editarNotaUsuario,
  listarNotasUsuario,
  salvarNotaUsuario,
} from '../services/userDataService';

export type Nota = {
  id: string;
  titulo: string;
  descricao: string;
  latitude?: number;
  longitude?: number;
  endereco?: string | null;
};

export default function Home() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [notas, setNotas] = useState<Nota[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Nota | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const carregarNotas = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const dados = await listarNotasUsuario(user.uid);
    setNotas(dados as Nota[]);
  };

  useEffect(() => {
    void requestNotificationPermission();
    void carregarNotas();
  }, []);

  const salvarNota = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(t('common.error'), t('home.unauthenticated'));
      return;
    }

    if (!titulo || !descricao) {
      Alert.alert(t('common.attention'), t('home.fillFields'));
      return;
    }

    try {
      if (editandoId) {
        await editarNotaUsuario(user.uid, editandoId, titulo, descricao);
        Alert.alert(t('common.success'), t('home.noteUpdated'));
        setEditandoId(null);
      } else {
        const noteLocation = await getCurrentNoteLocation();

        if (!noteLocation) {
          Alert.alert(t('common.attention'), t('home.locationPermissionDenied'));
          return;
        }

        await salvarNotaUsuario(user.uid, titulo, descricao, noteLocation);
        Alert.alert(t('common.success'), t('home.noteCreated'));
        await sendLocalNotification(t('home.notificationTitle'), t('home.notificationBody'));
      }

      setTitulo('');
      setDescricao('');
      await carregarNotas();
    } catch (error) {
      console.log('Erro ao salvar nota:', error);
      Alert.alert(t('common.error'), t('home.saveError'));
    }
  };

  const excluirNota = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert(t('home.deleteTitle'), t('home.deleteMessage'), [
      { text: t('home.deleteCancel'), style: 'cancel' },
      {
        text: t('home.deleteConfirm'),
        style: 'destructive',
        onPress: () => void (async () => {
          await deletarNotaUsuario(user.uid, id);
          await carregarNotas();
        })(),
      },
    ]);
  };

  const editarNota = (nota: Nota) => {
    setTitulo(nota.titulo);
    setDescricao(nota.descricao);
    setEditandoId(nota.id);
  };

  const realizarLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('@user');
      router.replace('/');
    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t('home.title')}</Text>

      <LanguageSelector
        label={t('language.label')}
        ptLabel={t('language.portuguese')}
        enLabel={t('language.english')}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={() => void realizarLogout()}>
        <Text style={styles.logoutText}>{t('common.logout')}</Text>
      </TouchableOpacity>

      <TextInput
        placeholder={t('home.noteTitle')}
        placeholderTextColor='#666'
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        placeholder={t('home.noteDescription')}
        placeholderTextColor='#666'
        style={[styles.input, styles.multilineInput]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity style={styles.primaryButton} onPress={() => void salvarNota()}>
        <Text style={styles.primaryButtonText}>{editandoId ? t('home.updateNote') : t('home.saveNote')}</Text>
      </TouchableOpacity>

      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitulo}>{item.titulo}</Text>
            <Text style={styles.itemDescricao}>{item.descricao}</Text>
            <Text style={styles.itemEnderecoLabel}>{t('home.createdAtLocation')}:</Text>
            <Text style={styles.itemEndereco}>{item.endereco || t('home.withoutLocation')}</Text>

            {(typeof item.latitude === 'number' && typeof item.longitude === 'number') && (
              <Text style={styles.coordsText}>
                {t('home.coordinates')}: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
              </Text>
            )}

            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => editarNota(item)}>
                <Text style={styles.editText}>{t('home.edit')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirNota(item.id)}>
                <Text style={styles.deleteText}>{t('home.delete')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setSelectedNote(item)}>
                <Text style={styles.mapText}>{t('home.viewMap')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('home.noNotes')}</Text>}
      />

      <MapModal
        visible={!!selectedNote}
        title={t('map.title')}
        subtitle={t('map.subtitle')}
        closeText={t('home.closeMap')}
        noteTitle={selectedNote?.titulo ?? ''}
        latitude={selectedNote?.latitude}
        longitude={selectedNote?.longitude}
        address={selectedNote?.endereco}
        noAddressText={t('map.noAddress')}
        onClose={() => setSelectedNote(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#00B37E',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  item: {
    backgroundColor: '#e7e7e7',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  itemTitulo: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  itemDescricao: {
    marginBottom: 8,
  },
  itemEnderecoLabel: {
    fontWeight: '700',
  },
  itemEndereco: {
    color: '#444',
    marginBottom: 4,
  },
  coordsText: {
    color: '#555',
    marginBottom: 8,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  editText: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  deleteText: {
    color: '#dc2626',
    fontWeight: '700',
  },
  mapText: {
    color: '#047857',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});
