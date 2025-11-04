"use client";
import { useState, useRef } from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import {
  FiSettings,
  FiHeart,
  FiClock,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiX,
  FiSave,
  FiRefreshCw,
  FiEye,
  FiGrid,
  FiList,
  FiMoon,
  FiSun,
  FiGlobe,
  FiBell,
  FiBarChart,
  FiSearch,
  FiBookmark,
  FiFolder,
  FiPlus
} from 'react-icons/fi';

export default function UserPreferencesPanel({ isOpen, onClose }) {
  const {
    favorites,
    history,
    preferences,
    recentSearches,
    bookmarks,
    customCategories,
    exportSettings,
    actions
  } = useUserPreferences();

  const [activeTab, setActiveTab] = useState('preferences');
  const [showConfirmClear, setShowConfirmClear] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'favorites', label: 'Favorites', icon: FiHeart },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'searches', label: 'Recent Searches', icon: FiSearch },
    { id: 'bookmarks', label: 'Bookmarks', icon: FiBookmark },
    { id: 'export', label: 'Export/Import', icon: FiDownload }
  ];

  const handlePreferenceChange = (key, value) => {
    actions.updatePreferences({ [key]: value });
  };

  const handleExportSettingChange = (key, value) => {
    actions.updateExportSettings({ [key]: value });
  };

  const handleExport = () => {
    const result = actions.exportData();
    if (result.success) {
      alert(`Data exported successfully as ${result.filename}`);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = actions.importData(e.target.result);
        if (result.success) {
          alert('Data imported successfully!');
        } else {
          alert(`Import failed: ${result.error}`);
        }
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleClearConfirm = (type) => {
    switch (type) {
      case 'favorites':
        actions.clearFavorites();
        break;
      case 'history':
        actions.clearHistory();
        break;
      case 'searches':
        actions.clearRecentSearches();
        break;
    }
    setShowConfirmClear(null);
  };

  const addCustomCategory = () => {
    if (newCategoryName.trim() && !customCategories.includes(newCategoryName.trim())) {
      actions.addCustomCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">User Preferences</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
            aria-label="Close preferences"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-transform will-change-transform hover:scale-[1.01] ${
                      activeTab === tab.id
                        ? 'bg-brand-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">General Preferences</h3>
                
                {/* Theme */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Theme</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreferenceChange('theme', 'light')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        preferences.theme === 'light'
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <FiSun className="w-4 h-4" />
                      Light
                    </button>
                    <button
                      onClick={() => handlePreferenceChange('theme', 'dark')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        preferences.theme === 'dark'
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <FiMoon className="w-4 h-4" />
                      Dark
                    </button>
                  </div>
                </div>

                {/* Default View */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Default View</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreferenceChange('defaultView', 'grid')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        preferences.defaultView === 'grid'
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <FiGrid className="w-4 h-4" />
                      Grid
                    </button>
                    <button
                      onClick={() => handlePreferenceChange('defaultView', 'list')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        preferences.defaultView === 'list'
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <FiList className="w-4 h-4" />
                      List
                    </button>
                  </div>
                </div>

                {/* Items Per Page */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Items Per Page</label>
                  <select
                    value={preferences.itemsPerPage}
                    onChange={(e) => handlePreferenceChange('itemsPerPage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                {/* Toggle Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto-save preferences</label>
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Show descriptions</label>
                    <input
                      type="checkbox"
                      checked={preferences.showDescriptions}
                      onChange={(e) => handlePreferenceChange('showDescriptions', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Compact mode</label>
                    <input
                      type="checkbox"
                      checked={preferences.compactMode}
                      onChange={(e) => handlePreferenceChange('compactMode', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enable notifications</label>
                    <input
                      type="checkbox"
                      checked={preferences.enableNotifications}
                      onChange={(e) => handlePreferenceChange('enableNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Enable analytics</label>
                    <input
                      type="checkbox"
                      checked={preferences.enableAnalytics}
                      onChange={(e) => handlePreferenceChange('enableAnalytics', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>

                {/* Custom Categories */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Custom Categories</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
                    />
                    <button
                      onClick={addCustomCategory}
                      className="px-3 py-2 bg-brand-500 text-white rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  {customCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customCategories.map((category) => (
                        <span
                          key={category}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                        >
                          {category}
                          <button
                            onClick={() => actions.removeCustomCategory(category)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={actions.resetPreferences}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
                  >
                    <FiRefreshCw className="w-4 h-4 inline mr-2" />
                    Reset to Defaults
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Favorites ({favorites.length})</h3>
                  {favorites.length > 0 && (
                    <button
                      onClick={() => setShowConfirmClear('favorites')}
                      className="px-3 py-1 text-red-600 rounded transition-transform will-change-transform hover:scale-[1.01]"
                    >
                      <FiTrash2 className="w-4 h-4 inline mr-1" />
                      Clear All
                    </button>
                  )}
                </div>
                
                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No favorites yet. Start adding tools to your favorites!</p>
                ) : (
                  <div className="space-y-2">
                    {favorites.map((toolId) => (
                      <div key={toolId} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="font-medium">{toolId}</span>
                        <button
                          onClick={() => actions.removeFavorite(toolId)}
                          className="text-red-600 transition-transform will-change-transform hover:scale-[1.01]"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">History ({history.length})</h3>
                  {history.length > 0 && (
                    <button
                      onClick={() => setShowConfirmClear('history')}
                      className="px-3 py-1 text-red-600 rounded transition-transform will-change-transform hover:scale-[1.01]"
                    >
                      <FiTrash2 className="w-4 h-4 inline mr-1" />
                      Clear All
                    </button>
                  )}
                </div>
                
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No history yet. Your recently used tools will appear here.</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category} • {new Date(item.timestamp).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={() => actions.removeFromHistory(item.id)}
                          className="text-red-600 transition-transform will-change-transform hover:scale-[1.01]"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'searches' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Searches ({recentSearches.length})</h3>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={() => setShowConfirmClear('searches')}
                      className="px-3 py-1 text-red-600 rounded transition-transform will-change-transform hover:scale-[1.01]"
                    >
                      <FiTrash2 className="w-4 h-4 inline mr-1" />
                      Clear All
                    </button>
                  )}
                </div>
                
                {recentSearches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent searches. Your search history will appear here.</p>
                ) : (
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium">"{search.query}"</div>
                          <div className="text-sm text-gray-500">{search.resultsCount} results • {new Date(search.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bookmarks ({bookmarks.length})</h3>
                
                {bookmarks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bookmarks yet. Save useful links for quick access!</p>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium">{bookmark.name}</div>
                          <div className="text-sm text-gray-500">{bookmark.url}</div>
                        </div>
                        <button
                          onClick={() => actions.removeBookmark(bookmark.id)}
                          className="text-red-600 transition-transform will-change-transform hover:scale-[1.01]"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Export/Import Data</h3>
                
                {/* Export Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Export Settings</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Export Format</label>
                    <select
                      value={exportSettings.format}
                      onChange={(e) => handleExportSettingChange('format', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="txt">Text</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Include in Export</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportSettings.includeFavorites}
                          onChange={(e) => handleExportSettingChange('includeFavorites', e.target.checked)}
                          className="mr-2 rounded"
                        />
                        <label className="text-sm">Favorites</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportSettings.includeHistory}
                          onChange={(e) => handleExportSettingChange('includeHistory', e.target.checked)}
                          className="mr-2 rounded"
                        />
                        <label className="text-sm">History</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportSettings.includePreferences}
                          onChange={(e) => handleExportSettingChange('includePreferences', e.target.checked)}
                          className="mr-2 rounded"
                        />
                        <label className="text-sm">Preferences</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Export/Import Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
                  >
                    <FiDownload className="w-4 h-4" />
                    Export Data
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
                  >
                    <FiUpload className="w-4 h-4" />
                    Import Data
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={handleImport}
                    className="hidden"
                  />
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Importing data will merge with your existing data. 
                    Consider exporting your current data as a backup before importing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmClear && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirm Clear</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to clear all {showConfirmClear}? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmClear(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleClearConfirm(showConfirmClear)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg transition-transform will-change-transform hover:scale-[1.01]"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}