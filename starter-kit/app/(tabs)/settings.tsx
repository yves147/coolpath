import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert,  } from 'react-native';
import { Slider, Icon } from '@rneui/themed';

export default function SettingsMenu() {
  const [sliderValue1, setSliderValue1] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(0);
  const [sliderValue3, setSliderValue3] = useState(0);
  const [value, setValue] = useState(0);

const interpolate = (start: number, end: number) => {
  let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
  return Math.ceil((1 - k) * start + k * end) % 256;
};

const color = () => {
  let r = interpolate(255, 0);
  let g = 0;
  let b = interpolate(0, 200);
  return `rgb(${r},${g},${b})`;
};

  const someValue = 42;
  const someOtherValue = 69

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings Menu</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Zeit</Text>
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
      <Slider
        value={value}
        onValueChange={setValue}
        maximumValue={10}
        minimumValue={0}
        step={1}
        allowTouchTrack
        trackStyle={{ height: 5, backgroundColor: 'transparent' }}
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'blue' }}
        thumbProps={{
          children: (
            <Icon
              name="thermometer"
              type="font-awesome"
              size={20}
              reverse
              containerStyle={{ bottom: 20, right: 20 }}
              color={color()}
            />
          ),
        }}
      />
      <Text style={styles.value}>{sliderValue2}</Text>
    </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Klimatop</Text>
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
        <Text style={styles.statisticsText}>Highest Temperature {someValue}</Text>
        <Text style={styles.statisticsText}>Current Location {someOtherValue}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Save Settings" onPress={() => Alert.alert('Settings Saved!')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '3293a8',
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
