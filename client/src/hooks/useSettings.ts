import { useState, useEffect } from 'react';
import { getSettings, updateSettings, fetchExchangeRates } from '../services/settingsService';
import type { UserSettings } from '../services/settingsService';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
  
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [data, rates] = await Promise.all([
          getSettings(),
          fetchExchangeRates()
        ]);
        if (mounted) {
          setSettings(JSON.parse(JSON.stringify(data)));
          setOriginalSettings(JSON.parse(JSON.stringify(data)));
          setExchangeRates(rates);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const updateSection = <K extends keyof UserSettings>(section: K, key: keyof UserSettings[K], value: any) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [section]: { ...prev[section], [key]: value } };
      
      if (key === 'currency') {
        setOriginalSettings(currentOriginal => {
          if (!currentOriginal) return currentOriginal;
          const persistSettings = { ...currentOriginal, [section]: { ...currentOriginal[section], [key]: value } } as UserSettings;
          updateSettings(persistSettings);
          setHasUnsavedChanges(JSON.stringify(next) !== JSON.stringify(persistSettings));
          return persistSettings;
        });
      } else {
        setHasUnsavedChanges(JSON.stringify(next) !== JSON.stringify(originalSettings));
      }
      
      return next;
    });
  };

  const save = async () => {
    if (!settings) return false;
    setSaving(true);
    try {
      await updateSettings(settings);
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      setHasUnsavedChanges(false);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings)));
      setHasUnsavedChanges(false);
    }
  };

  return { settings, loading, saving, hasUnsavedChanges, exchangeRates, updateSection, save, reset };
};
