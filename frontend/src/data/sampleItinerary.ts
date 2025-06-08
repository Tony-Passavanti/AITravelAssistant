// Sample itinerary data for testing and development
// This simulates the API response from the backend with the new structure

export interface Activity {
  title: string;
  time: string;
  duration: string;
  priceRange: string;
  description: string;
  location: string;
  notes?: string;
  bookingUrl?: string;
}

export interface MealRecommendation {
  name: string;
  cuisine: string;
  priceRange: string;
  description: string;
  location: string;
  bookingUrl?: string;
}

export interface Transportation {
  from: string;
  to: string;
  method: string;
  duration: string;
  notes?: string;
  cost?: string;
}

export interface ItineraryDay {
  date: string;
  activities: Activity[];
  meals: {
    breakfast?: MealRecommendation;
    lunch?: MealRecommendation;
    dinner?: MealRecommendation;
  };
  transportations: Transportation[];
}

export const sampleItinerary: ItineraryDay[] = [
  {
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow's date
    activities: [
      {
        title: "Eiffel Tower Visit",
        time: "09:00 AM",
        duration: "2 hours",
        priceRange: "€25-50",
        description: "Start your Parisian adventure with a visit to the iconic Eiffel Tower. Enjoy breathtaking views of the city from the observation decks.",
        location: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
        bookingUrl: "https://www.toureiffel.paris/en/rates-times-tickets",
        notes: "Book tickets in advance to avoid long queues. Consider going early in the morning for smaller crowds."
      },
      {
        title: "Louvre Museum Tour",
        time: "12:30 PM",
        duration: "3 hours",
        priceRange: "€17-25",
        description: "Explore one of the world's largest and most famous museums, home to thousands of works of art including the Mona Lisa and the Venus de Milo.",
        location: "Rue de Rivoli, 75001 Paris, France",
        bookingUrl: "https://www.louvre.fr/en/online-tickets",
        notes: "The museum is closed on Tuesdays. Audio guides are available for rent."
      },
      {
        title: "Seine River Cruise",
        time: "04:30 PM",
        duration: "1 hour",
        priceRange: "€15-30",
        description: "Relax and enjoy a scenic boat cruise along the Seine River, passing by famous landmarks like Notre-Dame Cathedral and Musée d'Orsay.",
        location: "Port de la Bourdonnais, 75007 Paris, France",
        bookingUrl: "https://www.bateauxparisiens.com/en/cruise-tours.html",
        notes: "Sunset cruises are particularly beautiful. Dress warmly for evening cruises."
      }
    ],
    meals: {
      breakfast: {
        name: "Café de Flore",
        cuisine: "French",
        priceRange: "€€",
        description: "Iconic Parisian café known for its traditional French breakfast and historic ambiance.",
        location: "172 Bd Saint-Germain, 75006 Paris, France",
        bookingUrl: "https://cafe-de-flore.com"
      },
      lunch: {
        name: "Le Fumoir",
        cuisine: "French Bistro",
        priceRange: "€€",
        description: "Chic bistro near the Louvre, perfect for a classic French lunch after your museum visit.",
        location: "6 Rue de l'Amiral de Coligny, 75001 Paris, France",
        bookingUrl: "https://www.lefumoir.com"
      },
      dinner: {
        name: "Les Ombres",
        cuisine: "French Gourmet",
        priceRange: "€€€",
        description: "Elegant restaurant with stunning Eiffel Tower views, serving modern French cuisine.",
        location: "27 Quai Branly, 75007 Paris, France",
        bookingUrl: "https://www.lesombres-restaurant.com"
      }
    },
    transportations: [
      {
        from: "Café de Flore",
        to: "Eiffel Tower",
        method: "Taxi",
        duration: "15 min",
        cost: "€15-20",
        notes: "Alternatively, take Metro line 8 from École Militaire to École Militaire station (20 min)"
      },
      {
        from: "Eiffel Tower",
        to: "Le Fumoir",
        method: "Metro",
        duration: "20 min",
        cost: "€2.10",
        notes: "Take line 6 from Bir-Hakeim to Charles de Gaulle - Étoile, then change to line 1 to Palais Royal - Musée du Louvre"
      },
      {
        from: "Louvre Museum",
        to: "Seine River Cruise",
        method: "Walking",
        duration: "25 min",
        notes: "A pleasant walk along the Seine riverbank with beautiful views"
      }
    ]
  },
  {
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
    activities: [
      {
        title: "Montmartre Walking Tour",
        time: "10:00 AM",
        duration: "2.5 hours",
        priceRange: "Free (tips appreciated)",
        description: "Explore the charming Montmartre neighborhood, known for its artistic history, the Sacré-Cœur Basilica, and picturesque streets.",
        location: "Meet at Anvers Metro Station, 75018 Paris, France",
        bookingUrl: "https://www.montmartrefootsteps.com/",
        notes: "Wear comfortable shoes as there are some steep hills. Great local cafes in the area for lunch after the tour."
      },
      {
        title: "Sacre-Coeur Basilica Visit",
        time: "01:00 PM",
        duration: "1 hour",
        priceRange: "Free (Dome: €6)",
        description: "Visit the stunning white-domed basilica of Sacré-Cœur, offering panoramic views of Paris from its highest point.",
        location: "35 Rue du Chevalier de la Barre, 75018 Paris, France",
        notes: "Dress modestly as it's a place of worship. The dome climb has 300 steps but offers amazing views."
      },
      {
        title: "Moulin Rouge Show",
        time: "09:00 PM",
        duration: "2 hours",
        priceRange: "€87-250",
        description: "Experience the world-famous cabaret with its spectacular show featuring the French Cancan.",
        location: "82 Boulevard de Clichy, 75018 Paris, France",
        bookingUrl: "https://www.moulinrouge.fr/",
        notes: "Dress code: Smart casual. No shorts, flip-flops, or sportswear. Arrive 30 minutes before showtime."
      }
    ],
    meals: {
      breakfast: {
        name: "Hardware Société",
        cuisine: "International Brunch",
        priceRange: "€€",
        description: "Popular Australian-style brunch spot with creative dishes and excellent coffee.",
        location: "10 Rue Lamarck, 75018 Paris, France"
      },
      lunch: {
        name: "Le Consulat",
        cuisine: "French Bistro",
        priceRange: "€€",
        description: "Historic bistro in the heart of Montmartre, frequented by famous artists like Picasso and Van Gogh.",
        location: "18 Rue Norvins, 75018 Paris, France"
      },
      dinner: {
        name: "Bouillon Pigalle",
        cuisine: "Traditional French",
        priceRange: "€",
        description: "Retro-style bistro serving classic French dishes at affordable prices, perfect before the Moulin Rouge.",
        location: "22 Boulevard de Clichy, 75018 Paris, France"
      }
    },
    transportations: [
      {
        from: "Hardware Société",
        to: "Montmartre Meeting Point",
        method: "Walking",
        duration: "5 min",
        notes: "Just a short walk to the meeting point at Anvers Metro Station"
      },
      {
        from: "Montmartre Tour End",
        to: "Sacre-Coeur",
        method: "Walking",
        duration: "10 min",
        notes: "A short uphill walk through charming Montmartre streets"
      },
      {
        from: "Sacre-Coeur",
        to: "Bouillon Pigalle",
        method: "Walking",
        duration: "15 min",
        notes: "Downhill walk to Pigalle, passing by interesting shops and cafes"
      },
      {
        from: "Bouillon Pigalle",
        to: "Moulin Rouge",
        method: "Walking",
        duration: "3 min",
        notes: "Just a short walk down the street"
      }
    ]
  },
  {
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // Third day
    activities: [
      {
        title: "Versailles Palace & Gardens",
        time: "09:00 AM",
        duration: "Full day",
        priceRange: "€50-100",
        description: "Visit the opulent Palace of Versailles, including the Hall of Mirrors, the stunning gardens, and Marie Antoinette's estate.",
        location: "Place d'Armes, 78000 Versailles, France",
        bookingUrl: "https://en.chateauversailles.fr/plan-your-visit/tickets-and-prices",
        notes: "Purchase tickets in advance. The gardens are especially beautiful in the afternoon light. Consider renting a bike to explore the extensive grounds."
      }
    ],
    meals: {
      breakfast: {
        name: "Café de la Gare de Versailles",
        cuisine: "French Cafe",
        priceRange: "€",
        description: "Convenient spot for a quick breakfast before heading to the palace, right by the train station.",
        location: "10 Rue des Étangs Gobert, 78000 Versailles, France"
      },
      lunch: {
        name: "La Flottille",
        cuisine: "French",
        priceRange: "€€€",
        description: "Lakeside restaurant in the Grand Canal of Versailles, offering a peaceful retreat with beautiful views.",
        location: "Bassin du Grand Canal, 78000 Versailles, France"
      },
      dinner: {
        name: "Le Bistrot du 11e",
        cuisine: "Modern French",
        priceRange: "€€",
        description: "Cozy bistro in the 11th arrondissement, perfect for a relaxed dinner after a day at Versailles.",
        location: "18 Rue de la Fontaine au Roi, 75011 Paris, France"
      }
    },
    transportations: [
      {
        from: "Paris City Center",
        to: "Versailles Château Rive Gauche",
        method: "RER C Train",
        duration: "35 min",
        cost: "€7.10 round trip",
        notes: "Take the RER C train to Versailles Château Rive Gauche station. The palace is a 10-minute walk from the station."
      },
      {
        from: "Versailles Palace",
        to: "La Flottille",
        method: "Walking",
        duration: "20 min",
        notes: "A pleasant walk through the gardens to reach the restaurant by the Grand Canal"
      },
      {
        from: "Versailles Château Rive Gauche",
        to: "Paris",
        method: "RER C Train",
        duration: "35 min",
        cost: "Included in round trip ticket"
      }
    ]
  }
];

// Helper function to get activities array for backward compatibility
export const getActivities = (): Activity[] => {
  return sampleItinerary.flatMap(day => day.activities);
};

// Usage examples:
// For new structure with days, meals, and transport:
// import { sampleItinerary } from '@/data/sampleItinerary';
// setItineraryDays(sampleItinerary);

// For backward compatibility (activities only):
// import { getActivities } from '@/data/sampleItinerary';
// setActivities(getActivities());
