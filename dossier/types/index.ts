
// Toutes les interfaces TypeScript du projet.
// Elles décrivent la forme des données qu'on manipule.





export interface iTunesRawResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;       // Pochette 100×100
  previewUrl: string | null;   // Extrait audio (peut être absent)
  trackViewUrl: string;        // Lien iTunes Store
  primaryGenreName: string;
  releaseDate: string;         // ISO 8601 : "2023-04-01T00:00:00Z"
  trackTimeMillis: number;     // Durée en millisecondes
}

/**
 * Réponse complète de l'API iTunes /search.
 */
export interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesRawResult[];
}

// Modèle interne (données transformées)

/**
 * Représentation normalisée d'un morceau dans notre app.
 * On convertit / simplifie les données brutes ici.
 */
export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  previewUrl: string | null;
  storeUrl: string;
  genre: string;
  releaseYear: number;          // Juste l'année, pas la date complète
  durationSeconds: number;      // Converti depuis ms
}



/**
 * Un favori = un Track auquel l'utilisateur a ajouté sa note.
 */
export interface Favorite {
  track: Track;
  rating: number;               // 1 à 5 étoiles
  addedAt: string;              // Date d'ajout (ISO string)
}


// Types des écrans disponibles dans le stack de navigation.
 
export type RootStackParamList = {
  Search: undefined;                   // Pas de params
  Detail: { track: Track };            // On passe le track sélectionné
  Favorites: undefined;
};

// Type helper pour le mode de recherche

// L'utilisateur peut chercher par artiste ou par titre.

export type SearchMode = 'artist' | 'track';
