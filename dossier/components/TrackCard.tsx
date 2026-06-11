// components/TrackCard.tsx
// Carte d'un résultat dans la FlatList.
// Composant "presentational" : il affiche, ne gère pas d'état.

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Track } from '../types';
import { formatDuration } from '../services/itunesService';



interface TrackCardProps {
  track: Track;
  onPress: (track: Track) => void;
  /** Optionnel : affiche une étoile si le track est en favori */
  isFavorite?: boolean;
}


/**
 * React.memo Utile dans une longue FlatList.
 */
const TrackCard: React.FC<TrackCardProps> = React.memo(
  ({ track, onPress, isFavorite = false }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(track)}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`${track.title} par ${track.artist}`}
      >

        <Image
          source={{ uri: track.artwork }}
          style={styles.artwork}
          resizeMode="cover"
        />

        {/* les infos pour le texte */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
          <Text style={styles.meta}>
            {track.genre} · {formatDuration(track.durationSeconds)}
          </Text>
        </View>

        {/* Indicateur favori */}
        {isFavorite && <Text style={styles.favoriteIcon}>★</Text>}
      </TouchableOpacity>
    );
  }
);



const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    gap: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  info: {
    flex: 1, // Prend l'espace restant
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 2,
  },
  meta: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },
  favoriteIcon: {
    color: '#FFD700',
    fontSize: 18,
  },
});

export default TrackCard;
