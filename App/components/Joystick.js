import { useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

export default function Joystick({ size = 100, knobSize = 50, onDirection }) {
  const radius = size / 2;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let { dx, dy } = gesture;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const limitedDist = Math.min(dist, radius);
        const x = limitedDist * Math.cos(angle);
        const y = limitedDist * Math.sin(angle);
        setPosition({ x, y });
        onDirection({ x: x / radius, y: y / radius });
      },
      onPanResponderRelease: () => {
        setPosition({ x: 0, y: 0 });
        onDirection({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <View
      style={[styles.base, { width: size, height: size, borderRadius: radius }]}
    >
      <View
        style={[
          styles.knob,
          {
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            transform: [{ translateX: position.x }, { translateY: position.y }],
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
  },
});
