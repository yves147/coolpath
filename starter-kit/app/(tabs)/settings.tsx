import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Slider } from '@rneui/themed';

export default function SettingsMenu() {
  const [sliderValue1, setSliderValue1] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [sliderValue3, setSliderValue3] = useState(0);

  const totalValue = sliderValue1 + sliderValue2 + sliderValue3;
  const averageValue = totalValue / 3;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings Menu</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Parameter 1</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={sliderValue1}
          onValueChange={setSliderValue1}
        />
        <Text style={styles.value}>{sliderValue1}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Parameter 2</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={sliderValue2}
          onValueChange={setSliderValue2}
        />
        <Text style={styles.value}>{sliderValue2}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Parameter 3</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={sliderValue3}
          onValueChange={setSliderValue3}
        />
        <Text style={styles.value}>{sliderValue3}</Text>
      </View>

      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticsHeader}>Statistics</Text>
        <Text style={styles.statisticsText}>Total Value: {totalValue}</Text>
        <Text style={styles.statisticsText}>Average Value: {averageValue.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save Settings" onPress={() => alert('Settings Saved!')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  value: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 10,
  },
  statisticsContainer: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 10,
  },
  statisticsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statisticsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
