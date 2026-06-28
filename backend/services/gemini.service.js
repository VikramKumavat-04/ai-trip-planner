const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1beta' });

const generateTripItinerary = async (tripData) => {
  const {
    city, country, budget, duration, travelers,
    travelStyle, interests = [], startDate,
  } = tripData;

  const budgetMap = {
    budget: 'INR 2,000-4,000/day per person',
    moderate: 'INR 5,000-10,000/day per person',
    luxury: 'INR 15,000+/day per person',
  };
  const budgetLabel = budgetMap[budget] || budget;
  const isInternational = country && country.toLowerCase() !== 'india';

  const prompt = `You are an expert travel planner with deep local knowledge. Generate a COMPLETE, ACCURATE, and DETAILED travel itinerary in JSON format.

CRITICAL ACCURACY REQUIREMENTS:
1. TEMPLE/ATTRACTION TIMINGS: You MUST use the REAL, VERIFIED opening hours. For example:
   - Dwarkadhish Temple (Dwarka): 6:00 AM - 1:00 PM and 5:00 PM - 9:30 PM (closed 1 PM to 5 PM)
   - Somnath Temple: 6:00 AM - 9:30 PM with aarti at 7 AM, 12 PM, 7 PM
   - Taj Mahal: Sunrise to sunset, closed on Fridays
   - Red Fort: 9:30 AM - 4:30 PM, closed on Mondays
   - Never schedule visits during known closed hours
2. ALL costs MUST be in Indian Rupees (₹/INR) only — no USD, EUR, or other currencies
3. BUDGET must include:
   ${isInternational ? '- Visa fees (realistic, country-specific amount in INR)' : ''}
   ${isInternational ? '- Return flight/train cost from major Indian city in INR' : '- Return train/bus/flight cost from nearest major city in INR'}
   - Accommodation total for all ${duration} nights
   - Food budget for all days
   - All entry fees and activities
   - Local transport
   - Shopping/miscellaneous
   - Grand total (sum of all above)
4. Hotel/hostel booking links: Use real booking URLs like https://www.makemytrip.com/hotels/, https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}, https://www.goibibo.com/hotels/
5. Restaurant addresses must be real and specific
6. All activity timings must respect actual operating hours

Trip Details:
- Destination: ${city}, ${country}
- Duration: ${duration} days
- Travelers: ${travelers} person(s)
- Budget Level: ${budget} (approximately ${budgetLabel})
- Travel Style: ${travelStyle}
- Interests: ${interests.join(', ') || 'General sightseeing'}
- Start Date: ${startDate || 'Flexible'}

Return ONLY a valid JSON object (no markdown, no code blocks, no explanation) with this EXACT structure:
{
  "summary": "2-3 sentence trip overview mentioning key highlights",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],
  "travelCost": {
    ${isInternational ? '"visaFee": "INR X,XXX (e.g. tourist visa fee)",' : ''}
    "flightOrTrain": "INR X,XXX return per person (specify mode and route)",
    "totalTravelCost": "INR X,XXX per person"
  },
  "dailyPlan": [
    {
      "day": 1,
      "date": "Day 1",
      "theme": "Arrival & First Exploration",
      "morning": [
        {
          "time": "9:00 AM",
          "title": "Activity name",
          "description": "Detailed description including what to see and why it matters",
          "location": "Specific address or landmark name",
          "duration": "2 hours",
          "cost": "INR 200 per person",
          "tips": "Specific insider tip (best timing, what to avoid, local secret)",
          "type": "sightseeing",
          "openingHours": "9:00 AM - 6:00 PM (verify before visiting)"
        }
      ],
      "afternoon": [],
      "evening": []
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "address": "Full street address",
      "rating": 4,
      "priceRange": "INR 2,000-4,000/night",
      "description": "Why this hotel suits this trip",
      "amenities": ["WiFi", "AC", "Restaurant"],
      "bookingLink": "https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}",
      "makemytripLink": "https://www.makemytrip.com/hotels/hotel-listing.html?checkin=&city=${city}"
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant name",
      "cuisine": "Cuisine type",
      "priceRange": "INR 300-600 per person",
      "description": "What makes it special and must-try dishes",
      "mustTry": ["dish1", "dish2"],
      "location": "Full address or area",
      "zomatoLink": "https://www.zomato.com/search?q=${encodeURIComponent(city)}"
    }
  ],
  "transportation": [
    {
      "type": "Transport type",
      "description": "How to use it, where to board",
      "estimatedCost": "INR 30-100 per ride",
      "tips": "Practical advice for travelers"
    }
  ],
  "budgetBreakdown": {
    ${isInternational ? '"visaFees": "INR X,XXX",' : ''}
    "travelToDestination": "INR X,XXX (return per person)",
    "accommodation": "INR X,XXX (${duration} nights)",
    "food": "INR X,XXX (all ${duration} days)",
    "activities": "INR X,XXX (entry fees + experiences)",
    "localTransport": "INR X,XXX",
    "shopping": "INR X,XXX",
    "miscellaneous": "INR X,XXX",
    "total": "INR XX,XXX per person"
  },
  "travelTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "packingList": ["item1", "item2", "item3", "item4", "item5", "item6"],
  "emergencyContacts": [
    {"name": "Police", "number": "100", "note": "Emergency"},
    {"name": "Ambulance", "number": "108", "note": "Medical emergency"},
    {"name": "Tourist Helpline", "number": "1363", "note": "24/7 tourist assistance"}
  ],
  "bestTimeToVisit": "Specific months with reasons (weather, festivals, crowd levels)",
  "weather": {
    "description": "Accurate climate description for ${city}",
    "temperature": "15-30°C",
    "humidity": "Moderate",
    "rainfall": "Low"
  },
  "mustVisitPlaces": [
    {
      "name": "Place name",
      "description": "Why you must visit and what to expect",
      "location": "Address or area",
      "entryFee": "INR 50 per person or Free",
      "openingHours": "9:00 AM - 5:00 PM, closed Mondays",
      "googleMapsLink": "https://maps.google.com/?q=${encodeURIComponent(city)}"
    }
  ],
  "hiddenGems": [
    {
      "name": "Hidden spot name",
      "description": "What makes it special and why locals love it",
      "location": "Specific directions or area"
    }
  ],
  "foodRecommendations": [
    {
      "name": "Food/dish name",
      "description": "What it is and why you must try it",
      "where": "Best place to find it with address",
      "approxCost": "INR 50-150"
    }
  ],
  "shoppingSpots": [
    {
      "name": "Market/shop name",
      "description": "What to find here",
      "whatToBuy": "Best purchases and price range"
    }
  ],
  "nearbyAttractions": [
    {
      "name": "Nearby place",
      "distance": "X km from ${city}",
      "description": "Brief description and how to reach"
    }
  ],
  "mapLocations": [
    {
      "name": "Location name",
      "lat": 28.6139,
      "lng": 77.2090,
      "type": "sightseeing"
    }
  ]
}

IMPORTANT: Make all ${duration} days unique with different themes. Each day's activities MUST fit within actual operating hours of those attractions. Use INR for ALL costs. Be specific with real places and verified timings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = response.text;
  const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        const fixed = jsonMatch[0]
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        return JSON.parse(fixed);
      }
    }
    throw new Error('Failed to parse AI response as JSON');
  }
};

module.exports = { generateTripItinerary };
