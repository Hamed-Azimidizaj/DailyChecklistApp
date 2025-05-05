// File: ExportPreview.js

import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ExportPreview({ entries, goBack }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const filterData = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const valid = entries.filter((e) => {
      const entryDate = new Date(e.date);
      const isAfterOrEqual = !start || entryDate >= start;
      const isBeforeOrEqual = !end || entryDate <= end;
      return isAfterOrEqual && isBeforeOrEqual;
    });

    if (valid.length === 0 && (startDate || endDate)) {
      Alert.alert('No data', 'No entries found within the specified date range.');
    }
    setFilteredData(valid);
  };

  const exportToText = async () => {
    if (filteredData.length === 0) {
      Alert.alert('No data', 'Please filter data before exporting.');
      return;
    }

    let text = "Daily Status Check: Reliability Tests\n\n";
    text += "Date,Time,Room Number,Tester,# Active Sockets,Temperature Value,Humidity Value,Voltage,Failed Positions,Other Parameter,Other Value\n";

    filteredData.forEach(entry => {
      text += `${entry.date},${entry.time},${entry.room},${entry.tester},${entry.activeSockets},${entry.temperature},${entry.humidity},${entry.voltage},${entry.failedPositions},${entry.otherParamTitle},${entry.otherParamValue}\n`;
    });

    const uri = FileSystem.cacheDirectory + 'checklist.txt';
    try {
      await FileSystem.writeAsStringAsync(uri, text, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(uri, { mimeType: 'text/plain', dialogTitle: 'Export Checklist Data' });
    } catch (error) {
      Alert.alert('Export Failed', 'An error occurred while saving the file.');
      console.error("Error saving text file:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Filter by Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Button title="Filter Data" onPress={filterData} />

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.date} - {item.room} - {item.tester}</Text>
          </View>
        )}
      />

      <Button title="Export to Text File" onPress={exportToText} />
      <Button title="Back" onPress={goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
});