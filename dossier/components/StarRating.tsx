import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';


interface StarRatingProps {
  // notes
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 24,
  editable = true,
}) => {
  // On génère un tableau [1, 2, 3, 4, 5]
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onChange?.(star)}
          disabled={!editable}
          accessibilityLabel={`${star} étoile${star > 1 ? 's' : ''}`}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    color: '#FFD700', // Jaune doré
  },
});

export default StarRating;
