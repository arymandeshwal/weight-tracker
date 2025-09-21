'use client';

import { useState, useEffect } from 'react';
import WeightChart from '@/components/WeightChart';
import { type WeightEntry } from '@/components/types';

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [secret, setSecret] = useState('');
  const [arymanKg, setArymanKg] = useState('');
  const [amalKg, setAmalKg] = useState('');
  const [date, setDate] = useState(getToday());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchWeights = async () => {
    try {
      const res = await fetch('/api/weights');
      if (!res.ok) {
        throw new Error('Failed to fetch weights');
      }
      const data: WeightEntry[] = await res.json();
      setWeights(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret) {
      setError('Secret Key is required to save data.');
      return;
    }
    if (!arymanKg && !amalKg) {
      setError('Enter a weight for at least one person.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const entriesToSave = [];
    if (arymanKg) {
      entriesToSave.push({ who: 'Aryman', date, kg: parseFloat(arymanKg) });
    }
    if (amalKg) {
      entriesToSave.push({ who: 'Amal', date, kg: parseFloat(amalKg) });
    }

    let success = true;
    for (const entry of entriesToSave) {
      try {
        const res = await fetch('/api/weights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`,
          },
          body: JSON.stringify(entry),
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.error || 'Failed to save entry.');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while saving.');
        }
        success = false;
        break; 
      }
    }

    if (success) {
      setArymanKg('');
      setAmalKg('');
      await fetchWeights(); // Refresh chart data
    }
    setIsSaving(false);
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8 md:p-12 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Weight Trends: Aryman & Amal
        </h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            {/* Inputs */}
            <div className="col-span-1">
              <label htmlFor="aryman" className="block text-sm font-medium text-gray-400">Aryman (kg)</label>
              <input
                id="aryman"
                type="number"
                step="0.1"
                value={arymanKg}
                onChange={(e) => setArymanKg(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="amal" className="block text-sm font-medium text-gray-400">Amal (kg)</label>
              <input
                id="amal"
                type="number"
                step="0.1"
                value={amalKg}
                onChange={(e) => setAmalKg(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label htmlFor="secret" className="block text-sm font-medium text-gray-400">Secret Key</label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
                placeholder="Required to save data"
              />
            </div>
            
            {/* Button */}
            <div className="sm:col-span-2 md:col-span-3 text-center">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-center mt-4">Error: {error}</p>}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-400">Loading Chart...</p>
            </div>
          ) : (
            <WeightChart data={weights} />
          )}
        </div>
      </div>
    </main>
  );
}
