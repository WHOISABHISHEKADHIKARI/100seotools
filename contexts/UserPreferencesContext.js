"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Initial state for user preferences
const initialState = {
  favorites: [],
  history: [],
  preferences: {
    theme: 'dark',
    defaultView: 'grid', // 'grid' or 'list'
    itemsPerPage: 12,
    autoSave: true,
    showDescriptions: true,
    compactMode: false,
    defaultSort: 'Name A-Z',
    defaultCategory: 'All',
    enableNotifications: true,
    enableAnalytics: true,
    language: 'en'
  },
  recentSearches: [],
  bookmarks: [],
  customCategories: [],
  exportSettings: {
    format: 'json', // 'json', 'csv', 'txt'
    includeHistory: true,
    includeFavorites: true,
    includePreferences: false
  }
};

// Action types
const actionTypes = {
  LOAD_DATA: 'LOAD_DATA',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  REMOVE_FROM_HISTORY: 'REMOVE_FROM_HISTORY',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  RESET_PREFERENCES: 'RESET_PREFERENCES',
  ADD_RECENT_SEARCH: 'ADD_RECENT_SEARCH',
  CLEAR_RECENT_SEARCHES: 'CLEAR_RECENT_SEARCHES',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
  ADD_CUSTOM_CATEGORY: 'ADD_CUSTOM_CATEGORY',
  REMOVE_CUSTOM_CATEGORY: 'REMOVE_CUSTOM_CATEGORY',
  UPDATE_EXPORT_SETTINGS: 'UPDATE_EXPORT_SETTINGS',
  IMPORT_DATA: 'IMPORT_DATA'
};

// Reducer function
function userPreferencesReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_DATA:
      return { ...state, ...action.payload };

    case actionTypes.ADD_FAVORITE:
      if (state.favorites.includes(action.payload)) return state;
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };

    case actionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload)
      };

    case actionTypes.TOGGLE_FAVORITE:
      if (state.favorites.includes(action.payload)) {
        return {
          ...state,
          favorites: state.favorites.filter(id => id !== action.payload)
        };
      } else {
        return {
          ...state,
          favorites: [...state.favorites, action.payload]
        };
      }

    case actionTypes.CLEAR_FAVORITES:
      return { ...state, favorites: [] };

    case actionTypes.ADD_TO_HISTORY:
      const newHistoryItem = {
        id: action.payload.id || action.payload.slug,
        name: action.payload.name,
        category: action.payload.category,
        timestamp: Date.now(),
        url: action.payload.url || `/tools/${action.payload.slug}`
      };
      
      // Remove existing entry if it exists and add to beginning
      const filteredHistory = state.history.filter(item => item.id !== newHistoryItem.id);
      const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 50); // Keep last 50 items
      
      return { ...state, history: updatedHistory };

    case actionTypes.REMOVE_FROM_HISTORY:
      return {
        ...state,
        history: state.history.filter(item => item.id !== action.payload)
      };

    case actionTypes.CLEAR_HISTORY:
      return { ...state, history: [] };

    case actionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case actionTypes.RESET_PREFERENCES:
      return { ...state, preferences: initialState.preferences };

    case actionTypes.ADD_RECENT_SEARCH:
      const newSearch = {
        query: action.payload.query,
        timestamp: Date.now(),
        resultsCount: action.payload.resultsCount || 0
      };
      
      // Remove existing search and add to beginning
      const filteredSearches = state.recentSearches.filter(search => search.query !== newSearch.query);
      const updatedSearches = [newSearch, ...filteredSearches].slice(0, 20); // Keep last 20 searches
      
      return { ...state, recentSearches: updatedSearches };

    case actionTypes.CLEAR_RECENT_SEARCHES:
      return { ...state, recentSearches: [] };

    case actionTypes.ADD_BOOKMARK:
      const bookmark = {
        id: action.payload.id || Date.now().toString(),
        name: action.payload.name,
        url: action.payload.url,
        category: action.payload.category || 'General',
        timestamp: Date.now()
      };
      
      return {
        ...state,
        bookmarks: [...state.bookmarks, bookmark]
      };

    case actionTypes.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.payload)
      };

    case actionTypes.ADD_CUSTOM_CATEGORY:
      return {
        ...state,
        customCategories: [...state.customCategories, action.payload]
      };

    case actionTypes.REMOVE_CUSTOM_CATEGORY:
      return {
        ...state,
        customCategories: state.customCategories.filter(cat => cat !== action.payload)
      };

    case actionTypes.UPDATE_EXPORT_SETTINGS:
      return {
        ...state,
        exportSettings: { ...state.exportSettings, ...action.payload }
      };

    case actionTypes.IMPORT_DATA:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Create context
const UserPreferencesContext = createContext();

// Custom hook to use the context
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}

// Provider component
export function UserPreferencesProvider({ children }) {
  const [state, dispatch] = useReducer(userPreferencesReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('userPreferences');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          dispatch({ type: actionTypes.LOAD_DATA, payload: parsed });
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving user preferences:', error);
      }
    }
  }, [state]);

  // Action creators
  const actions = {
    addFavorite: useCallback((toolId) => {
      dispatch({ type: actionTypes.ADD_FAVORITE, payload: toolId });
    }, []),

    removeFavorite: useCallback((toolId) => {
      dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: toolId });
    }, []),

    toggleFavorite: useCallback((toolId) => {
      dispatch({ type: actionTypes.TOGGLE_FAVORITE, payload: toolId });
    }, []),

    clearFavorites: useCallback(() => {
      dispatch({ type: actionTypes.CLEAR_FAVORITES });
    }, []),

    addToHistory: useCallback((tool) => {
      dispatch({ type: actionTypes.ADD_TO_HISTORY, payload: tool });
    }, []),

    removeFromHistory: useCallback((toolId) => {
      dispatch({ type: actionTypes.REMOVE_FROM_HISTORY, payload: toolId });
    }, []),

    clearHistory: useCallback(() => {
      dispatch({ type: actionTypes.CLEAR_HISTORY });
    }, []),

    updatePreferences: useCallback((preferences) => {
      dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences });
    }, []),

    resetPreferences: useCallback(() => {
      dispatch({ type: actionTypes.RESET_PREFERENCES });
    }, []),

    addRecentSearch: useCallback((query, resultsCount) => {
      dispatch({ 
        type: actionTypes.ADD_RECENT_SEARCH, 
        payload: { query, resultsCount } 
      });
    }, []),

    clearRecentSearches: useCallback(() => {
      dispatch({ type: actionTypes.CLEAR_RECENT_SEARCHES });
    }, []),

    addBookmark: useCallback((bookmark) => {
      dispatch({ type: actionTypes.ADD_BOOKMARK, payload: bookmark });
    }, []),

    removeBookmark: useCallback((bookmarkId) => {
      dispatch({ type: actionTypes.REMOVE_BOOKMARK, payload: bookmarkId });
    }, []),

    addCustomCategory: useCallback((category) => {
      dispatch({ type: actionTypes.ADD_CUSTOM_CATEGORY, payload: category });
    }, []),

    removeCustomCategory: useCallback((category) => {
      dispatch({ type: actionTypes.REMOVE_CUSTOM_CATEGORY, payload: category });
    }, []),

    updateExportSettings: useCallback((settings) => {
      dispatch({ type: actionTypes.UPDATE_EXPORT_SETTINGS, payload: settings });
    }, []),

    exportData: useCallback(() => {
      const { exportSettings } = state;
      const exportData = {};

      if (exportSettings.includeFavorites) {
        exportData.favorites = state.favorites;
      }

      if (exportSettings.includeHistory) {
        exportData.history = state.history;
      }

      if (exportSettings.includePreferences) {
        exportData.preferences = state.preferences;
      }

      exportData.recentSearches = state.recentSearches;
      exportData.bookmarks = state.bookmarks;
      exportData.customCategories = state.customCategories;
      exportData.exportedAt = new Date().toISOString();

      let content, filename, mimeType;

      switch (exportSettings.format) {
        case 'csv':
          // Convert to CSV format
          const csvRows = [];
          csvRows.push(['Type', 'Name', 'Category', 'URL', 'Timestamp']);
          
          if (exportData.favorites) {
            exportData.favorites.forEach(fav => {
              csvRows.push(['Favorite', fav, '', '', '']);
            });
          }
          
          if (exportData.history) {
            exportData.history.forEach(item => {
              csvRows.push(['History', item.name, item.category, item.url, new Date(item.timestamp).toISOString()]);
            });
          }
          
          content = csvRows.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
          filename = `seo-tools-data-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;

        case 'txt':
          // Convert to plain text format
          let textContent = '100 SEO Tools - User Data Export\n';
          textContent += `Exported: ${new Date().toLocaleString()}\n\n`;
          
          if (exportData.favorites && exportData.favorites.length > 0) {
            textContent += 'FAVORITES:\n';
            exportData.favorites.forEach(fav => textContent += `- ${fav}\n`);
            textContent += '\n';
          }
          
          if (exportData.history && exportData.history.length > 0) {
            textContent += 'HISTORY:\n';
            exportData.history.forEach(item => {
              textContent += `- ${item.name} (${item.category}) - ${new Date(item.timestamp).toLocaleString()}\n`;
            });
            textContent += '\n';
          }
          
          content = textContent;
          filename = `seo-tools-data-${Date.now()}.txt`;
          mimeType = 'text/plain';
          break;

        default: // JSON
          content = JSON.stringify(exportData, null, 2);
          filename = `seo-tools-data-${Date.now()}.json`;
          mimeType = 'application/json';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, filename };
    }, [state]),

    importData: useCallback((data) => {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        dispatch({ type: actionTypes.IMPORT_DATA, payload: parsed });
        return { success: true };
      } catch (error) {
        console.error('Error importing data:', error);
        return { success: false, error: error.message };
      }
    }, [])
  };

  return (
    <UserPreferencesContext.Provider value={{ ...state, actions }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export default UserPreferencesContext;