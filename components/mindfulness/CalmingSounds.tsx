// components/mindfulness/CalmingSounds.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

const CalmingSounds = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound(soundFile: any) {
    // Unload previous sound if one is playing
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  }

  async function stopSound() {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Calming Sounds</Text>
      <View style={styles.buttonContainer}>
        <Button title="Rain" onPress={() => playSound(require('../../assets/sounds/rain.mp3'))} />
        <Button title="Waves" onPress={() => playSound(require('../../assets/sounds/waves.mp3'))} />
      </View>
      <Button title="Stop Sound" color="#ff6347" onPress={stopSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
});

export default CalmingSounds;