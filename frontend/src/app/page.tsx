'use client';

import { useState } from 'react';

export default function Home() {
  const [preferences, setPreferences] = useState({
    destination: '',
    travelDates: { start: '', end: '' },
    budget: 'medium',
    travelStyle: 'sightseeing',
    interests: [] as string[],
    accommodation: 'hotel',
  });

  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      const data = await response.json();
      setItinerary(data.itinerary);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Travel Itinerary Generator
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              value={preferences.destination}
              onChange={(e) => setPreferences({...preferences, destination: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={preferences.travelDates.start}
                onChange={(e) => setPreferences({...preferences, travelDates: {...preferences.travelDates, start: e.target.value}})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={preferences.travelDates.end}
                onChange={(e) => setPreferences({...preferences, travelDates: {...preferences.travelDates, end: e.target.value}})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <select
              value={preferences.budget}
              onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="low">Budget</option>
              <option value="medium">Mid-range</option>
              <option value="high">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Travel Style</label>
            <select
              value={preferences.travelStyle}
              onChange={(e) => setPreferences({...preferences, travelStyle: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="sightseeing">Sightseeing</option>
              <option value="adventure">Adventure</option>
              <option value="relaxation">Relaxation</option>
              <option value="food">Food & Culture</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., hiking, museums, beaches"
              onChange={(e) => setPreferences({...preferences, interests: e.target.value.split(',').map(s => s.trim())})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Accommodation Type</label>
            <select
              value={preferences.accommodation}
              onChange={(e) => setPreferences({...preferences, accommodation: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="apartment">Vacation Rental</option>
              <option value="resort">Resort</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </div>
        </form>

        {itinerary && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Travel Itinerary</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: itinerary }} />
          </div>
        )}
      </div>
    </div>
  );
}