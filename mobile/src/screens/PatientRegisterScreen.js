import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertPatient } from '../db/patientRepository';

const PatientRegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [village, setVillage] = useState('');
  const [lmpDate, setLmpDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setLmpDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleRegister = async () => {
    if (!name || !phoneNumber || !village || !lmpDate) {
      setError('Uzuza amakuru yose asabwa');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await insertPatient({
        name,
        phoneNumber,
        village,
        lmpDate: formatDate(lmpDate),
      });
      navigation.goBack();
    } catch (err) {
      setError('Kubika byanze. Gerageza nanone.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Andika Umubyeyi</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Amazina y'umubyeyi"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Numero ya telefoni"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Umudugudu"
        value={village}
        onChangeText={setVillage}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={lmpDate ? styles.dateText : styles.datePlaceholder}>
          {lmpDate ? formatDate(lmpDate) : "Itariki y'imihango ya nyuma"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={lmpDate || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Birimo kubikwa...' : 'Bika'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default PatientRegisterScreen;