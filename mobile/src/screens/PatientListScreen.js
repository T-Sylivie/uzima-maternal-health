import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllPatients } from '../db/patientRepository';

const PatientListScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadPatients = async () => {
        const data = await getAllPatients();
        setPatients(data);
      };
      loadPatients();
    }, [])
  );

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>{item.village}</Text>
      <Text style={styles.detail}>{item.phone_number}</Text>
      <Text style={styles.detail}>Isura ya mbere: {item.visit_1_date}</Text>
      {item.synced === 0 && <Text style={styles.unsyncedBadge}>Ntibyoherejwe</Text>}

      <TouchableOpacity
        style={styles.logVisitButton}
        onPress={() =>
          navigation.navigate('VisitLog', { patientId: item.id, patientName: item.name })
        }
      >
        <Text style={styles.logVisitButtonText}>Andika Isura</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Abagore Banditswe</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Shakisha izina..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {filteredPatients.length === 0 ? (
        <Text style={styles.empty}>
          {patients.length === 0 ? 'Nta mubyeyi wanditswe' : 'Nta wabonetse'}
        </Text>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PatientRegister')}
      >
        <Text style={styles.buttonText}>Andika Umubyeyi Mushya</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  empty: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  unsyncedBadge: {
    fontSize: 12,
    color: '#C62828',
    marginTop: 6,
    fontWeight: 'bold',
  },
  logVisitButton: {
    marginTop: 12,
    backgroundColor: '#1B4D3E',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  logVisitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PatientListScreen;