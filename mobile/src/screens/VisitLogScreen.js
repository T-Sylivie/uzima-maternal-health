import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { insertVisitLog } from '../db/visitLogRepository';

const OUTCOME_OPTIONS = [
  { label: 'Yaje ku isura', value: 'ATTENDED' },
  { label: 'Ntiyaje', value: 'MISSED' },
  { label: 'Hari ibimenyetso bibi', value: 'DANGER_SIGNS' },
];

const VisitLogScreen = ({ route, navigation }) => {
  const { patientId, patientName } = route.params;
  const [outcome, setOutcome] = useState('');
  const [dangerSigns, setDangerSigns] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!outcome) {
      setError('Hitamo ibyavuye ku isura');
      return;
    }
    if (outcome === 'DANGER_SIGNS' && !dangerSigns.trim()) {
      setError('Andika ibimenyetso byabonetse');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await insertVisitLog({
        patientId,
        visitDate: new Date().toISOString().split('T')[0],
        outcome,
        dangerSigns: outcome === 'DANGER_SIGNS' ? dangerSigns : '',
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
      <Text style={styles.title}>Andika Isura</Text>
      <Text style={styles.subtitle}>{patientName}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {OUTCOME_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.option, outcome === option.value && styles.optionSelected]}
          onPress={() => setOutcome(option.value)}
        >
          <Text style={outcome === option.value ? styles.optionTextSelected : styles.optionText}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}

      {outcome === 'DANGER_SIGNS' && (
        <TextInput
          style={styles.input}
          placeholder="Andika ibimenyetso (urugero: umutwe ukaze, kubyimba)"
          value={dangerSigns}
          onChangeText={setDangerSigns}
          multiline
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Birimo kubikwa...' : 'Bika'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
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

export default VisitLogScreen;