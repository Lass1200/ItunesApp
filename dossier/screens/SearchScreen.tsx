// ============================================================
// screens/SearchScreen.tsx
// Écran principal : barre de recherche + FlatList des résultats.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList, SearchMode, Track } from '../types';
import { useSearch } from '../hooks/useSearch';
import { useFavorites } from '../hooks/useFavorites';
import TrackCard from '../components/TrackCard';

// Types de navigation

type SearchScreenNavProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavProp;
}



const SearchScreen: React.FC<Props> = ({ navigation }) => {
  // Valeur de la barre de recherche
  const [query, setQuery] = useState<string>('');
  // Mode de recherche : artiste ou titre
  const [mode, setMode] = useState<SearchMode>('track');

  // Notre hook custom qui gère le fetch
  const { results, loading, error, search, clearResults } = useSearch();
  // Pour savoir si un track est déjà en favori
  const { isFavorite } = useFavorites();

  const handleSearch = () => {
    search(query, mode);
  };

  // navigatioin + detail
  const handleSelectTrack = (track: Track) => {
    navigation.navigate('Detail', { track });
  };

  // Rendu d'un élément de la liste 
  // Défini en dehors du JSX pour de meilleures performances
  const renderItem = ({ item }: { item: Track }) => (
    <TrackCard
      track={item}
      onPress={handleSelectTrack}
      isFavorite={isFavorite(item.id)}
    />
  );

  // keyExtractor donne une clé unique à chaque élément FlatList
  const keyExtractor = (item: Track) => String(item.id);

  return (
    <View style={styles.safe}>
      {/* KeyboardAvoidingView remonte le contenu quand le clavier s'ouvre */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* En-tête*/}
        <View style={styles.header}>
          <Text style={styles.appTitle}>ZoneDeRecherche</Text>
          {/* Bouton vers les favoris */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            accessibilityLabel="Voir mes favoris"
          >
            <Text style={styles.favButton}>★ Favoris</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modeToggle}>
          {(['track', 'artist'] as SearchMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => {
                setMode(m);
                clearResults(); // On vide les résultats quand on change de mode
              }}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === 'track' ? ' Titre' : ' Artiste'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>


        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder={
              mode === 'track' ? 'Chercher un titre...' : 'Chercher un artiste...'
            }
            placeholderTextColor="#555"
            value={query}
            onChangeText={setQuery}
            // Lance la recherche quand l'utilisateur appuie sur "Entrée"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Rechercher</Text>
          </TouchableOpacity>
        </View>

        {/*États : chargement / erreur / vide */}
        {loading && (
          <ActivityIndicator
            style={styles.loader}
            color="#FF2D55"
            size="large"
          />
        )}

        {error && (
          <Text style={styles.errorText}>⚠️ {error}</Text>
        )}

        {!loading && !error && results.length === 0 && query !== '' && (
          <Text style={styles.emptyText}>Aucun résultat pour « {query} »</Text>
        )}

        {/*  Liste des résultats*/}
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          // Optimisations FlatList
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          // Espace en bas pour que le dernier item soit visible
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled" // Permet de cliquer pendant que le clavier est ouvert
        />
      </KeyboardAvoidingView>
    </View>
  );
};



const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  favButton: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '600',
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#FF2D55',
  },
  modeBtnText: {
    color: '#888',
    fontWeight: '500',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: '#FF2D55',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: '#FF453A',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default SearchScreen;
