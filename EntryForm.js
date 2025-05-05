// File: EntryForm.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';

export default function EntryForm({ onSave, configOptions, currentTester, isLastTester }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    room: '', // Room will be managed in App.js
    tester: currentTester || '',
    activeSockets: '',
    temperature: '',
    humidity: '',
    voltage: '',
    failedPositions: '',
    otherParamTitle: configOptions.otherParameterTitles?.[0] || '',
    otherParamValue: '',
  });
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      tester: currentTester || '',
      otherParamTitle: configOptions.otherParameterTitles?.[0] || '',
    }));
    setIsFormDisabled(isLastTester);
  }, [currentTester, isLastTester, configOptions.otherParameterTitles]);

  useEffect(() => {
    // Update room in formData when it changes in App.js
    setFormData(prevFormData => ({ ...prevFormData, room: formData.room }));
  }, [formData.room]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onSave({ ...formData, timestamp: Date.now() });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      room: formData.room, // Keep the current room
      tester: configOptions.testers?.[configOptions.testers.findIndex(t => t === currentTester) + 1] || '',
      activeSockets: '',
      temperature: '',
      humidity: '',
      voltage: '',
      failedPositions: '',
      otherParamTitle: configOptions.otherParameterTitles?.[0] || '',
      otherParamValue: '',
    });
  };

  return (
    <View>
      <Text>Date: {formData.date}</Text>
      <Text>Time: {formData.time}</Text>

      {/* Room Number Picker is now in App.js */}
      <Text style={styles.label}>Tester</Text>
      <Text style={styles.value}>{formData.tester}</Text>

      <Text style={styles.label}># Active Sockets</Text>
      <TextInput
        style={styles.input}
        value={formData.activeSockets}
        onChangeText={(val) => handleChange('activeSockets', val)}
        editable={!isFormDisabled}
      />

      <Text style={styles.label}>Temperature Value</Text>
      <TextInput
        style={styles.input}
        value={formData.temperature}
        onChangeText={(val) => handleChange('temperature', val)}
        editable={!isFormDisabled}
      />

      <Text style={styles.label}>Humidity Value</Text>
      <TextInput
        style={styles.input}
        value={formData.humidity}
        onChangeText={(val) => handleChange('humidity', val)}
        editable={!isFormDisabled}
      />

      <Text style={styles.label}>Voltage</Text>
      <TextInput
        style={styles.input}
        value={formData.voltage}
        onChangeText={(val) => handleChange('voltage', val)}
        editable={!isFormDisabled}
      />

      <Text style={styles.label}>Failed Positions</Text>
      <TextInput
        style={styles.input}
        value={formData.failedPositions}
        onChangeText={(val) => handleChange('failedPositions', val)}
        editable={!isFormDisabled}
      />

      <Text style={styles.label}>Other Parameters</Text>
      <Picker
        enabled={!isFormDisabled}
        selectedValue={formData.otherParamTitle}
        onValueChange={(val) => handleChange('otherParamTitle', val)}>
        {configOptions.otherParameterTitles?.map((t) => <Picker.Item label={t} value={t} key={t} />)}
      </Picker>
      <TextInput
        style={styles.input}
        value={formData.otherParamValue}
        onChangeText={(val) => handleChange('otherParamValue', val)}
        editable={!isFormDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  value: {
    marginTop: 10,
    padding: 8,
    marginBottom: 10,
  }
});