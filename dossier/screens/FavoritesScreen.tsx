// ============================================================
// screens/FavoritesScreen.tsx
// Affiche tous les favoris enregistrés avec leurs notes.
// ============================================================

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList, Favorite, Track } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import TrackCard from '../components/TrackCard';
import StarRating from '../components/StarRating';

// ------ Types de navigation --------------------------------

type FavoritesNavProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

interface Props {
  navigation: FavoritesNavProp;
}

// ------ Composant ------------------------------------------

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const { favorites, updateRating } = useFavorites();

  // Navigation vers la vue détail depuis les favoris
  const handleSelectTrack = (track: Track) => {
    navigation.navigate('Detail', { track });
  };

  // Rendu d'un favori : card + étoiles en dessous
  const renderItem = ({ item }: { item: Favorite }) => (
    <View style={styles.favoriteItem}>
      <TrackCard
        track={item.track}
        onPress={handleSelectTrack}
        isFavorite={true}
      />
      {/* Note modifiable directement depuis la liste */}
      <View style={styles.ratingRow}>
        <Text style={styles.ratingLabel}>Votre note :</Text>
        <StarRating
          value={item.rating}
          onChange={(r) => updateRating(item.track.id, r)}
          size={20}
        />
        <Text style={styles.addedDate}>
          Ajouté le {new Date(item.addedAt).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </View>
  );

  const keyExtractor = (item: Favorite) => String(item.track.id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>★ Mes Favoris</Text>
        <Text style={styles.count}>{favorites.length} morceau{favorites.length !== 1 ? 'x' : ''}</Text>
      </View>

      {favorites.length === 0 ? (
        // État vide : invite à chercher
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎵</Text>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptySubtitle}>
            Cherchez un morceau et ajoutez-le à vos favoris !
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

// ------ Styles ---------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
  },
  count: {
    color: '#888',
    fontSize: 14,
  },
  favoriteItem: {
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 12,
    gap: 10,
  },
  ratingLabel: {
    color: '#888',
    fontSize: 13,
  },
  addedDate: {
    color: '#555',
    fontSize: 11,
    marginLeft: 'auto',
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default FavoritesScreen;
