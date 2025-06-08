// components/mindfulness/CalmingSounds.tsx (Using expo-av)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// Use the import you requested
import { Audio } from 'expo-av';

const CalmingSounds = () => {
  // The state type is now Audio.Sound
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound(soundFile: any) {
    console.log('Loading Sound');
    // Unload previous sound if one is playing
    if (sound) {
      await sound.unloadAsync();
    }

    // We call createAsync on the imported 'Audio.Sound' object
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);

    console.log('Playing Sound');
    await newSound.playAsync();
  }

  async function stopSound() {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  }

  // This useEffect will automatically stop the sound if you navigate away from the screen
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Calming Sounds</Text>
      <View style={styles.buttonContainer}>
        <Button title="Rain" onPress={() => playSound(require('../../assets/sounds/rain.mp3'))} />
        <Button title="Waves" onPress={() => playSound(require('../../assets/sounds/waves.mp3'))} />
      </View>
      {sound && <Button title="Stop Sound" color="#ff6347" onPress={stopSound} />}
    </View>
  );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#DBEAFE', borderRadius: 12, padding: 20, marginVertical: 10, alignItems: 'center', },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1E40AF', marginBottom: 20, },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15, },
});

export default CalmingSounds;