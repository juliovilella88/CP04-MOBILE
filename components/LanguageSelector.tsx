import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import i18n, { changeAppLanguage } from '../i18n';

type Props = {
  label: string;
  ptLabel: string;
  enLabel: string;
};

export default function LanguageSelector({ label, ptLabel, enLabel }: Props) {
  const currentLanguage = i18n.language?.startsWith('pt') ? 'pt' : 'en';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, currentLanguage === 'pt' && styles.activeButton]}
          onPress={() => void changeAppLanguage('pt')}
        >
          <Text style={styles.buttonText}>{ptLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, currentLanguage === 'en' && styles.activeButton]}
          onPress={() => void changeAppLanguage('en')}
        >
          <Text style={styles.buttonText}>{enLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeButton: {
    borderColor: '#00B37E',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
