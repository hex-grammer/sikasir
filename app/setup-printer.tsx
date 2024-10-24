import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

const SetupPrinter = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // Scan for devices
  const scanDevices = () => {
    setDevices([]); // Clear previous scans
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }
      if (device && device.name) {
        setDevices((prev) => [...prev, device]); // Store discovered devices
      }
    });

    // Stop scan after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  // Connect to selected printer
  const connectToDevice = async (device: Device) => {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);
      Alert.alert('Connected', `Connected to ${device.name}`);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'Failed to connect to device');
    }
  };

  // Send test print
  const printTest = async () => {
    if (!connectedDevice) {
      Alert.alert('No Printer', 'Please connect to a printer first');
      return;
    }

    try {
      const serviceUUID = 'your-printer-service-uuid'; // Replace with actual UUID
      const characteristicUUID = 'your-printer-characteristic-uuid'; // Replace with actual

      await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from('Testing\n').toString('base64') // Send "Testing" message
      );
      Alert.alert('Success', 'Printed successfully!');
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Error', 'Failed to print');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Scan for Printers" onPress={scanDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={`Connect to ${item.name}`}
            onPress={() => connectToDevice(item)}
          />
        )}
      />
      {connectedDevice && (
        <View style={{ marginTop: 20 }}>
          <Text>Connected to: {connectedDevice.name}</Text>
          <Button title="Print Test" onPress={printTest} />
        </View>
      )}
    </View>
  );
};

export default SetupPrinter;
