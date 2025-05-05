// File: ConfigScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Picker, Alert } from 'react-native';

export default function ConfigScreen({ configOptions, setConfigOptions, goBack }) {
  const [localConfig, setLocalConfig] = useState(configOptions);
  const [currentRoom, setCurrentRoom] = useState('');
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const rooms = Object.keys(localConfig);
    if (rooms.length > 0 && !currentRoom) {
      setCurrentRoom(rooms[0]);
    }
  }, [localConfig, currentRoom]);

  const handleChange = (field, index, value) => {
    if (currentRoom && localConfig[currentRoom]) {
      const updatedConfig = { ...localConfig };
      const updatedField = [...(updatedConfig[currentRoom][field] || [])];
      updatedField[index] = value;
      updatedConfig[currentRoom][field] = updatedField;
      setLocalConfig(updatedConfig);
    }
  };

  const addItem = (field) => {
    if (currentRoom) {
      const updatedConfig = { ...localConfig };
      if (!updatedConfig[currentRoom]) {
        updatedConfig[currentRoom] = { testers: [], otherParameterTitles: [] };
      }
      const updatedField = [...(updatedConfig[currentRoom][field] || []), ''];
      updatedConfig[currentRoom][field] = updatedField;
      setLocalConfig(updatedConfig);
    }
  };

  const saveChanges = () => {
    const cleanedConfig = {};
    for (const room in localConfig) {
      cleanedConfig[room] = {
        testers: (localConfig[room]?.testers || []).filter(item => item.trim() !== ''),
        otherParameterTitles: (localConfig[room]?.otherParameterTitles || []).filter(item => item.trim() !== ''),
      };
    }
    setConfigOptions(cleanedConfig);
    goBack();
  };

  const handleRoomSelection = (room) => {
    if (room === 'New Room') {
      setCurrentRoom('New Room');
    } else {
      setCurrentRoom(room);
      setNewRoomName(''); // Clear new room name
    }
  };

  const handleAddNewRoom = () => {
    if (newRoomName.trim() !== '' && !localConfig[newRoomName]) {
      setLocalConfig({ ...localConfig, [newRoomName]: { testers: [], otherParameterTitles: [] } });
      setCurrentRoom(newRoomName);
      setNewRoomName('');
    } else if (localConfig[newRoomName]) {
      Alert.alert('Room Exists', 'A room with this name already exists.');
    } else {
      Alert.alert('Invalid Name', 'Please enter a valid room name.');
    }
  };

  const handleDeleteRoom = (roomToDelete) => {
    if (roomToDelete !== 'LS317' && roomToDelete !== 'N434') {
      const updatedConfig = { ...localConfig };
      delete updatedConfig[roomToDelete];
      setLocalConfig(updatedConfig);
      const rooms = Object.keys(updatedConfig);
      setCurrentRoom(rooms.length > 0 ? rooms[0] : '');
    } else {
      Alert.alert('Cannot Delete Default Room', 'The default room numbers cannot be deleted.');
    }
  };

  const renderField = (field, title) => (
    <View style={styles.section} key={field}>
      <Text style={styles.title}>{title} for {currentRoom}</Text>
      <FlatList
        data={localConfig[currentRoom]?.[field] || []}
        keyExtractor={(item, idx) => `${field}-${idx}`}
        renderItem={({ item, index }) => (
          <TextInput
            style={styles.input}
            value={item}
            onChangeText={(val) => handleChange(field, index, val)}
          />
        )}
      />
      <Button title={`Add ${title}`} onPress={() => addItem(field)} />
    </View>
  );

  const availableRooms = Object.keys(localConfig);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configure Settings</Text>
      <View style={styles.roomSelector}>
        <Text style={styles.label}>Select Room:</Text>
        <Picker
          selectedValue={currentRoom}
          onValueChange={handleRoomSelection}>
          {availableRooms.map((r) => <Picker.Item label={r} value={r} key={r} />)}
          <Picker.Item label="Add New Room..." value="New Room" />
        </Picker>
        {currentRoom !== 'New Room' && currentRoom && currentRoom !== 'LS317' && currentRoom !== 'N434' && (
          <Button title="Delete Room" onPress={() => handleDeleteRoom(currentRoom)} color="red" />
        )}
      </View>

      {currentRoom === 'New Room' ? (
        <View style={styles.newRoomInput}>
          <TextInput
            style={styles.input}
            placeholder="New Room Name"
            value={newRoomName}
            onChangeText={setNewRoomName}
          />
          <Button title="Add Room" onPress={handleAddNewRoom} />
        </View>
      ) : currentRoom ? (
        <>
          {renderField('testers', 'Testers')}
          {renderField('otherParameterTitles', 'Other Parameter Titles')}
        </>
      ) : (
        <Text>Please select or add a room to configure.</Text>
      )}

      <Button title="Save" onPress={saveChanges} />
      <Button title="Back" onPress={goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
  },
  roomSelector: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newRoomInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});