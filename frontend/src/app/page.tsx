'use client';

import { useState, useEffect } from 'react';
import { ActivityCard } from '@/components/ActivityCard';
import { sampleItinerary, type Activity, type MealRecommendation, type Transportation, type ItineraryDay } from '@/data/sampleItinerary';

export default function Home() {
  const [preferences, setPreferences] = useState({
    destination: '',
    travelDates: { start: '', end: '' },
    budget: 'medium',
    travelStyle: 'sightseeing',
    interests: [] as string[],
    accommodation: 'hotel',
  });

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isQuestionnaireMinimized, setIsQuestionnaireMinimized] = useState(false);
  const [isReplacingActivity, setIsReplacingActivity] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Submitting preferences:', preferences);
      const response = await fetch('http://localhost:5000/api/itinerary/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        console.error('Backend error:', {
          status: response.status,
          statusText: response.statusText,    
          body: responseText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Received invalid JSON from server');
      }
      
      console.log('Parsed response data:', data);
      
      // Check if data is an array (direct itinerary) or has a nested structure
      const itineraryData = Array.isArray(data) ? data : data.itinerary || data.days || [];
      
      if (!Array.isArray(itineraryData) || itineraryData.length === 0) {
        console.error('Invalid itinerary data format:', data);
        throw new Error('Received invalid itinerary data format');
      }
      
      console.log('Setting itinerary days:', itineraryData);
      setItineraryDays(itineraryData);
      setIsQuestionnaireMinimized(true);
      
    } catch (error: unknown) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to generate itinerary. Please check the console for details. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionnaire = () => {
    setIsQuestionnaireMinimized(!isQuestionnaireMinimized);
  };

  const loadSampleItinerary = () => {
    setItineraryDays(sampleItinerary);
    setIsQuestionnaireMinimized(true);
  };

  const deleteActivity = (dayIndex: number, activityIndex: number) => {
    setItineraryDays(prevDays => {
      const newDays = [...prevDays];
      newDays[dayIndex].activities.splice(activityIndex, 1);
      return newDays;
    });
  };

  const replaceActivity = async (dayIndex: number, activityIndex: number, reason: string) => {
    try {
      setIsReplacingActivity(true);
      
      const response = await fetch('http://localhost:5000/api/itinerary/replace-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentActivity: itineraryDays[dayIndex].activities[activityIndex],
          reason,
          destination: preferences.destination,
          travelDates: preferences.travelDates,
          travelStyle: preferences.travelStyle,
          interests: preferences.interests
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get replacement activity');
      }

      const newActivity = await response.json();
      
      setItineraryDays(prevDays => {
        const newDays = [...prevDays];
        newDays[dayIndex].activities[activityIndex] = newActivity;
        return newDays;
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error replacing activity:', error);
      alert('Failed to replace activity. Please try again.');
      return Promise.reject(error);
    } finally {
      setIsReplacingActivity(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Brittany
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            *Your personal travel planning companion
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
        {/* Show preferences form when there's no itinerary or when explicitly toggled */}
        {(!itineraryDays.length || !isQuestionnaireMinimized) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6" id="preferences-form">
            <button 
              onClick={toggleQuestionnaire}
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
            >
              <h2 className="text-xl md:text-2xl font-semibold">Travel Preferences</h2>
              <span className="text-xl">
                {isQuestionnaireMinimized ? '▼' : '▲'}
              </span>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${isQuestionnaireMinimized ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[2000px] opacity-100'}`}>
              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                <div className="flex justify-end pt-2">
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Generating...' : 'Generate Itinerary'}
                    </button>
                    <button
                      type="button"
                      onClick={loadSampleItinerary}
                      className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Load Sample Itinerary
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Creating your perfect itinerary...</p>
          </div>
        )}

        {itineraryDays.length > 0 && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Travel Itinerary</h2>
              <button 
                onClick={() => {
                  setIsQuestionnaireMinimized(false);
                  // Scroll to the preferences form
                  document.getElementById('preferences-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Preferences
              </button>
            </div>

            {itineraryDays.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                
                <div className="space-y-6">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="space-y-4">
                      <div className="relative group" key={`${dayIndex}-${activityIndex}`}>
                        <ActivityCard 
                          activity={activity} 
                          dayIndex={dayIndex}
                          activityIndex={activityIndex}
                          onDelete={deleteActivity}
                          onReplace={replaceActivity}
                          showActions={!isReplacingActivity}
                        />
                      </div>
                      {activityIndex < day.activities.length - 1 && day.transportations[activityIndex] && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          <span className="mr-2">
                            {day.transportations[activityIndex].method === 'Walking' ? '🚶‍♂️' : 
                             day.transportations[activityIndex].method === 'Taxi' ? '🚖' : '🚆'}
                          </span>
                          <span>
                            {day.transportations[activityIndex].method} to next location • {day.transportations[activityIndex].duration}
                            {day.transportations[activityIndex].notes && (
                              <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                                ({day.transportations[activityIndex].notes})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {day.meals.breakfast && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200">Breakfast</h4>
                      <p className="font-semibold">{day.meals.breakfast.name}</p>
                      <p className="text-sm text-green-700 dark:text-green-300">{day.meals.breakfast.cuisine} • {day.meals.breakfast.priceRange}</p>
                      <p className="text-sm mt-2">{day.meals.breakfast.description}</p>
                      {day.meals.breakfast.bookingUrl && (
                        <a 
                          href={day.meals.breakfast.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-green-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Book Table →
                        </a>
                      )}
                    </div>
                  )}
                  {day.meals.lunch && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Lunch</h4>
                      <p className="font-semibold">{day.meals.lunch.name}</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{day.meals.lunch.cuisine} • {day.meals.lunch.priceRange}</p>
                      <p className="text-sm mt-2">{day.meals.lunch.description}</p>
                      {day.meals.lunch.bookingUrl && (
                        <a 
                          href={day.meals.lunch.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Book Table →
                        </a>
                      )}
                    </div>
                  )}
                  {day.meals.dinner && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 dark:text-purple-200">Dinner</h4>
                      <p className="font-semibold">{day.meals.dinner.name}</p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">{day.meals.dinner.cuisine} • {day.meals.dinner.priceRange}</p>
                      <p className="text-sm mt-2">{day.meals.dinner.description}</p>
                      {day.meals.dinner.bookingUrl && (
                        <a 
                          href={day.meals.dinner.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-purple-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Book Table →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-200 mb-2">Trip Summary</h3>
              <p className="text-indigo-700 dark:text-indigo-300">
                Your {itineraryDays.reduce((total, day) => total + day.activities.length, 0)}-activity itinerary is ready! Each day includes activities, meals, and transportation details.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}