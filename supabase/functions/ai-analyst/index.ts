import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, context } = await req.json();

    const environmentalResponses: Record<string, string> = {
      deforestation: "Deforestation is a critical environmental issue. Current trends show significant forest loss in tropical regions, particularly in the Amazon, Congo Basin, and Southeast Asia. Satellite imagery reveals approximately 10 million hectares of forest are lost annually. This impacts biodiversity, carbon storage, and local climate patterns. Key actions include: supporting reforestation projects, reducing paper consumption, and advocating for sustainable forestry practices.",
      
      air_quality: "Air quality is measured using the Air Quality Index (AQI), which ranges from 0-500. Good (0-50): Air quality is satisfactory. Moderate (51-100): Acceptable for most, but sensitive groups may experience minor effects. Unhealthy for Sensitive Groups (101-150): General public not likely affected. Unhealthy (151-200): Everyone may begin to experience health effects. Very Unhealthy (201-300): Health alert, everyone may experience serious effects. Hazardous (301+): Health warning of emergency conditions. Major pollutants include PM2.5, PM10, ozone, CO, SO2, and NO2.",
      
      water: "Water resources are increasingly stressed by climate change. Key concerns include: 1) Drought prediction - Machine learning models analyze precipitation patterns, soil moisture, and temperature data to forecast water scarcity. 2) Water pollution - Industrial discharge, agricultural runoff, and plastic waste contaminate freshwater sources. 3) Glacier melt - Accelerating ice loss threatens water supply for millions. Actions: Conserve water, support watershed protection, reduce plastic use, and advocate for clean water policies.",
      
      climate: "Climate change is the defining challenge of our time. Current global average temperature has risen 1.1°C above pre-industrial levels. Impacts include: extreme weather events, sea-level rise, ocean acidification, and ecosystem disruption. The scientific consensus is clear - human activities, primarily burning fossil fuels, are the main cause. We need urgent action: transition to renewable energy, improve energy efficiency, protect forests, adopt sustainable agriculture, and implement circular economy principles.",
      
      action: "Individual actions make a difference when multiplied across communities. High-impact actions: 1) Reduce energy consumption - use LED bulbs, improve insulation, use renewable energy. 2) Sustainable transportation - walk, bike, use public transit, consider electric vehicles. 3) Diet changes - reduce meat consumption, choose local/seasonal foods, minimize food waste. 4) Conscious consumption - buy less, choose sustainable products, repair instead of replace. 5) Advocate - support environmental policies, participate in local initiatives, educate others. 6) Monitor and report - use apps like this to track environmental issues in your area.",
    };

    const lowerMessage = message.toLowerCase();
    let response = "";

    if (lowerMessage.includes('deforest') || lowerMessage.includes('forest') || lowerMessage.includes('tree')) {
      response = environmentalResponses.deforestation;
    } else if (lowerMessage.includes('air') || lowerMessage.includes('pollution') || lowerMessage.includes('aqi') || lowerMessage.includes('quality')) {
      response = environmentalResponses.air_quality;
    } else if (lowerMessage.includes('water') || lowerMessage.includes('drought') || lowerMessage.includes('flood')) {
      response = environmentalResponses.water;
    } else if (lowerMessage.includes('climate') || lowerMessage.includes('warming') || lowerMessage.includes('temperature')) {
      response = environmentalResponses.climate;
    } else if (lowerMessage.includes('action') || lowerMessage.includes('help') || lowerMessage.includes('do') || lowerMessage.includes('can i')) {
      response = environmentalResponses.action;
    } else {
      response = "I'm your AI Environmental Analyst, specialized in helping you understand environmental data and climate science. I can provide insights on:\n\n• Deforestation and land-use changes\n• Air quality and pollution levels\n• Water resources and drought prediction\n• Climate change impacts and trends\n• Actions you can take to make a difference\n\nOur system uses satellite data from NASA and ESA, combined with machine learning models to monitor Earth's ecosystems in real-time. What specific environmental topic would you like to explore?";
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        response: 'I apologize, but I encountered an error processing your request. Please try rephrasing your question or ask about specific environmental topics like deforestation, air quality, water resources, or climate change.',
        error: error.message 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});