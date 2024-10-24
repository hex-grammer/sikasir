import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View, Button, ScrollView, DeviceEventEmitter, NativeEventEmitter, Switch, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import { BluetoothEscposPrinter, BluetoothManager } from "react-native-bluetooth-escpos-printer";

const { height, width } = Dimensions.get('window');

const SetupPrinter = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [foundDevices, setFoundDevices] = useState<any[]>([]);
  const [bleOpened, setBleOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [boundAddress, setBoundAddress] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then((enabled) => {
      setBleOpened(Boolean(enabled));
      setLoading(false);
    }).catch(err => console.error(err));

    const bluetoothManagerEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(BluetoothManager) : DeviceEventEmitter;

    const deviceAlreadyPairedListener = bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, _deviceAlreadyPaired);
    const deviceFoundListener = bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, _deviceFoundEvent);
    const connectionLostListener = bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
      setName('');
      setBoundAddress('');
    });

    return () => {
      deviceAlreadyPairedListener.remove();
      deviceFoundListener.remove();
      connectionLostListener.remove();
    };
  }, []);

  const _deviceAlreadyPaired = (rsp: any) => {
    const ds = typeof rsp.devices === 'object' ? rsp.devices : JSON.parse(rsp.devices);
    if (ds && ds.length) {
      setPairedDevices(prev => [...prev, ...ds]);
    }
  };

  const _deviceFoundEvent = (rsp: any) => {
    const r = typeof rsp.device === "object" ? rsp.device : JSON.parse(rsp.device);
    if (r) {
      setFoundDevices(prev => {
        if (!prev.find(device => device.address === r.address)) {
          return [...prev, r];
        }
        return prev;
      });
    }
  };

  const _scan = () => {
    setLoading(true);
    BluetoothManager.scanDevices()
      .then((s) => {
        const found = JSON.parse(s.found);
        setFoundDevices(found || []);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        alert('Error: ' + JSON.stringify(err));
      });
  };

  const connectToDevice = (device: any) => {
    setLoading(true);
    BluetoothManager.connect(device.address)
      .then(() => {
        setLoading(false);
        setBoundAddress(device.address);
        setName(device.name || "UNKNOWN");
      })
      .catch(err => {
        setLoading(false);
        alert(err);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bluetooth Opened: {bleOpened ? "true" : "false"} <Text>Open BLE Before Scanning</Text></Text>
      <View>
        <Switch value={bleOpened} onValueChange={(v) => {
          setLoading(true);
          if (!v) {
            BluetoothManager.disableBluetooth().then(() => {
              setBleOpened(false);
              setLoading(false);
              setFoundDevices([]);
              setPairedDevices([]);
            }).catch(err => alert(err));
          } else {
            BluetoothManager.enableBluetooth().then((r) => {
              const paired = r.map((item: any) => JSON.parse(item));
              setPairedDevices(paired);
              setBleOpened(true);
              setLoading(false);
            }).catch(err => {
              setLoading(false);
              alert(err);
            });
          }
        }} />
        <Button disabled={loading || !bleOpened} onPress={_scan} title="Scan" />
      </View>
      <Text style={styles.title}>Connected: <Text style={{ color: "blue" }}>{!name ? 'No Devices' : name}</Text></Text>
      <Text style={styles.title}>Found (tap to connect):</Text>
      {loading && <ActivityIndicator animating={true} />}
      <View style={{ flex: 1, flexDirection: "column" }}>
        {foundDevices.map((device, index) => (
          <TouchableOpacity key={index} style={styles.deviceRow} onPress={() => connectToDevice(device)}>
            <Text style={styles.deviceName}>{device.name || "UNKNOWN"}</Text>
            <Text style={styles.deviceAddress}>{device.address}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.title}>Paired:</Text>
      {loading && <ActivityIndicator animating={true} />}
      <View style={{ flex: 1, flexDirection: "column" }}>
        {pairedDevices.map((device, index) => (
          <Text key={index}>{device.name || "UNKNOWN"} - {device.address}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    width: width,
    backgroundColor: "#eee",
    color: "#232323",
    paddingLeft: 8,
    paddingVertical: 4,
    textAlign: "left"
  },
  deviceRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  deviceName: {
    flex: 1,
    textAlign: "left"
  },
  deviceAddress: {
    flex: 1,
    textAlign: "right"
  }
});

export default SetupPrinter;
