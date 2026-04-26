import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  visible: boolean;
  title: string;
  subtitle: string;
  closeText: string;
  noteTitle: string;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  noAddressText: string;
  onClose: () => void;
};

export default function MapModal({
  visible,
  title,
  subtitle,
  closeText,
  noteTitle,
  latitude,
  longitude,
  address,
  noAddressText,
  onClose,
}: Props) {
  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {hasCoordinates ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={{ latitude, longitude }} title={noteTitle} description={address ?? noAddressText} />
            </MapView>
          ) : (
            <View style={[styles.map, styles.emptyMap]}>
              <Text>{noAddressText}</Text>
            </View>
          )}

          <Text style={styles.address}>{address || noAddressText}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{closeText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#555',
  },
  map: {
    width: '100%',
    height: 280,
    borderRadius: 14,
  },
  emptyMap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  address: {
    fontSize: 14,
    color: '#444',
  },
  button: {
    backgroundColor: '#00B37E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
