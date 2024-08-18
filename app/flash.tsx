import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CustomCard() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          {/* Top text */}
          <Text style={styles.topText}>night beast</Text>
          
          {/* Icon representing the moon */}
          <Icon name="moon-o" size={60} color="#ffffff" style={styles.moonIcon} />

          {/* The cat-like shape (using a simple geometric view) */}
          <View style={styles.catShape}>
            <Icon name="eye" size={24} color="#ffffff" style={styles.eyeIcon} />
          </View>

          {/* Side text */}
          <Text style={styles.sideTextLeft}>夜猫子</Text>
          <Text style={styles.sideTextRight}>夜猫子</Text>

          {/* Bottom text */}
          <Text style={styles.bottomText}>nightly word study</Text>
          
          {/* Bottom star icons */}
          <Icon name="star" size={10} color="#ffffff" style={styles.starIconLeft} />
          <Icon name="star" size={10} color="#ffffff" style={styles.starIconRight} />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1D2B',
  },
  card: {
    width: 250,
    height: 350,
    backgroundColor: '#242e31',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  moonIcon: {
    marginTop: 20,
  },
  catShape: {
    width: 120,
    height: 100,
    backgroundColor: '#1A1A2E',
    borderRadius: 60,
    position: 'relative',
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    top: -10,
  },
  sideTextLeft: {
    position: 'absolute',
    left: 10,
    color: '#ffffff',
    fontSize: 12,
    transform: [{ rotate: '-90deg' }],
  },
  sideTextRight: {
    position: 'absolute',
    right: 10,
    color: '#ffffff',
    fontSize: 12,
    transform: [{ rotate: '90deg' }],
  },
  bottomText: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 10,
  },
  starIconLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  starIconRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
