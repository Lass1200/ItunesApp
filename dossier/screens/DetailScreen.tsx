
// Vue détaillée d'un morceau + ajout aux favoris avec note.


import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { formatDuration } from '../services/itunesService';
import StarRating from '../components/StarRating';



type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavProp = StackNavigationProp<RootStackParamList, 'Detail'>;

interface Props {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavProp;
}



const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  // On récupère le track passé depuis SearchScreen via navigation
  const { track } = route.params;

  const { addFavorite, removeFavorite, isFavorite, favorites } = useFavorites();

  // Rating temporaire avant de confirmer l'ajout
  const [pendingRating, setPendingRating] = useState<number>(3);

  // On récupère la note existante si le track est déjà en favori
  const existingFavorite = favorites.find((f) => f.track.id === track.id);
  const currentRating = existingFavorite?.rating ?? pendingRating;
  const alreadyFavorite = isFavorite(track.id);


  const handleToggleFavorite = async () => {
    if (alreadyFavorite) {
      // Confirmation avant suppression
      Alert.alert(
        'Supprimer le favori',
        `Retirer « ${track.title} » de vos favoris ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => removeFavorite(track.id),
          },
        ]
      );
    } else {
      await addFavorite(track, pendingRating);
      Alert.alert('Ajouté !', `« ${track.title} » ajouté à vos favoris avec ${pendingRating} ★`);
    }
  };

  const handleRatingChange = async (rating: number) => {
    setPendingRating(rating);
    if (alreadyFavorite) {
      // Si déjà en favori, on met à jour directement
      const { updateRating } = useFavorites(); // En vrai on destructure en haut
    }
  };
  const handleOpenStore = () => {
    Linking.openURL(track.storeUrl).catch(() =>
      Alert.alert('Erreur', "Impossible d'ouvrir l'iTunes Store")
    );
  };

  return (

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ---- Pochette grande taille ---- */}
        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: track.artwork }}
            style={styles.artwork}
            resizeMode="cover"
          />
        </View>

        {/* ---- Infos principales ---- */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{track.title}</Text>
          <Text style={styles.artist}>{track.artist}</Text>
          <Text style={styles.album}>{track.album}</Text>
        </View>

        <View style={styles.metaSection}>
          <MetaRow label="Genre" value={track.genre} />
          <MetaRow label="Année" value={String(track.releaseYear)} />
          <MetaRow label="Durée" value={formatDuration(track.durationSeconds)} />
        </View>

        {/* ---- Système de notation ---- */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>
            {alreadyFavorite ? 'Votre note' : 'Notez ce morceau'}
          </Text>
          <StarRating
            value={currentRating}
            onChange={setPendingRating}
            size={36}
            editable={true}
          />
        </View>

        {/* ---- Bouton Favori ---- */}
        <TouchableOpacity
          style={[
            styles.favoriteBtn,
            alreadyFavorite && styles.favoriteBtnActive,
          ]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.favoriteBtnText}>
            {alreadyFavorite ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
          </Text>
        </TouchableOpacity>

        {/* ---- Bouton Store ---- */}
        <TouchableOpacity style={styles.storeBtn} onPress={handleOpenStore}>
          <Text style={styles.storeBtnText}>Écouter sur iTunes →</Text>
        </TouchableOpacity>

      </ScrollView>

  );
};


interface MetaRowProps {
  label: string;
  value: string;
}

const MetaRow: React.FC<MetaRowProps> = ({ label, value }) => (
  <View style={metaStyles.row}>
    <Text style={metaStyles.label}>{label}</Text>
    <Text style={metaStyles.value}>{value}</Text>
  </View>
);

const metaStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
  },
  label: {
    color: '#888',
    fontSize: 14,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

// ------ Styles ---------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    paddingBottom: 40,
  },
  artworkContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  artwork: {
    width: 240,
    height: 240,
    borderRadius: 16,
    // Ombre (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    // Élévation Android
    elevation: 12,
  },
  infoSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  artist: {
    color: '#FF2D55',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  album: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  metaSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  ratingLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  favoriteBtn: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  favoriteBtnActive: {
    backgroundColor: '#2C2300',
  },
  favoriteBtnText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
  },
  storeBtn: {
    marginHorizontal: 24,
    backgroundColor: '#FF2D55',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  storeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DetailScreen;
