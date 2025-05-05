// File: App.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Picker } from 'react-native';
import EntryForm from './EntryForm';
import ConfigScreen from './ConfigScreen';
import ExportPreview from './ExportPreview';

export default function App() {
  const [formEntries, setFormEntries] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [currentTesterIndex, setCurrentTesterIndex] = useState(0);
  const [currentRoom, setCurrentRoom] = useState('');
  const [configOptions, setConfigOptions] = useState({
    LS317: { testers: [], otherParameterTitles: [] },
    N434: { testers: [], otherParameterTitles: [] },
  }); // Default room numbers

  const handleSaveEntry = (entry) => {
    setFormEntries([...formEntries, entry]);
  };

  const toggleConfig = () => setShowConfig(!showConfig);
  const toggleExport = () => setShowExport(!showExport);

  const goToNextTester = () => {
    const currentRoomConfig = configOptions[currentRoom] || {};
    if (currentRoomConfig.testers && currentTesterIndex < currentRoomConfig.testers.length - 1) {
      setCurrentTesterIndex(currentTesterIndex + 1);
    } else {
      console.log("Reached the end of testers for this room.");
    }
  };

  const goToPreviousTester = () => {
    if (currentTesterIndex > 0) {
      setCurrentTesterIndex(currentTesterIndex - 1);
    }
  };

  const handleRoomChange = (room) => {
    setCurrentRoom(room);
    setCurrentTesterIndex(0); // Reset tester index when room changes
  };

  useEffect(() => {
    // Initialize with the first room if available
    if (Object.keys(configOptions).length > 0 && !currentRoom) {
      setCurrentRoom(Object.keys(configOptions)[0]);
    }
  }, [configOptions, currentRoom]);

  const currentRoomConfig = configOptions[currentRoom] || { testers: [], otherParameterTitles: [] };
  const currentTester = currentRoomConfig.testers[currentTesterIndex] || '';
  const isLastTester = currentRoomConfig.testers.length > 0 && currentTesterIndex === currentRoomConfig.testers.length - 1;

  if (showConfig) {
    return (
      <ConfigScreen
        configOptions={configOptions}
        setConfigOptions={setConfigOptions}
        goBack={() => setShowConfig(false)}
      />
    );
  }

  if (showExport) {
    return (
      <ExportPreview
        entries={formEntries}
        goBack={() => setShowExport(false)}
      />
    );
  }

  const availableRooms = Object.keys(configOptions);
  const initialRoom = availableRooms.length > 0 ? availableRooms[0] : '';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daily Status Check: Reliability Tests</Text>
      <View>
        <Text style={styles.label}>Room Number</Text>
        <Picker
          selectedValue={currentRoom || initialRoom}
          onValueChange={(val) => handleRoomChange(val)}>
          {availableRooms.map((r) => <Picker.Item label={r} value={r} key={r} />)}
          {!availableRooms.includes('New Room') && <Picker.Item label="Add New Room..." value="New Room" />}
        </Picker>
      </View>
      {currentRoom ? (
        <EntryForm
          onSave={handleSaveEntry}
          configOptions={currentRoomConfig}
          currentTester={currentTester}
          isLastTester={isLastTester}
        />
      ) : (
        <Text>Please configure room numbers first.</Text>
      )}
      {currentRoom && (
        <View style={styles.buttonRow}>
          <Button title="Previous" onPress={goToPreviousTester} disabled={currentTesterIndex === 0} />
          <Button title="Next" onPress={goToNextTester} disabled={isLastTester || currentRoomConfig.testers.length === 0} />
        </View>
      )}
      <View style={styles.buttonRow}>
        <Button title="Configuration" onPress={toggleConfig} />
        <Button title="Export" onPress={toggleExport} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});