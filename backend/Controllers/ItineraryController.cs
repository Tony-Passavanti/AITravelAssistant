using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AITravelAssistant.Models;
using Microsoft.AspNetCore.Authorization;

namespace AITravelAssistant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItineraryController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ItineraryController> _logger;

        public ItineraryController(
            IConfiguration configuration, 
            IHttpClientFactory httpClientFactory,
            ILogger<ItineraryController> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            _logger.LogInformation("Test endpoint was called");
            return Ok(new { 
                message = "Backend is working!",
                timestamp = DateTime.UtcNow,
                status = "Success"
            });
        }

        [HttpPost("replace-activity")]
        public async Task<IActionResult> ReplaceActivity([FromBody] ReplaceActivityRequest request)
        {
            try
            {
                var apiKey = _configuration["OpenAI:ApiKey"];
                if (string.IsNullOrEmpty(apiKey) || apiKey == "your-openai-api-key-here")
                {
                    return BadRequest("OpenAI API key is not configured");
                }

                if (request.CurrentActivity == null || request.TravelDates == null)
                {
                    return BadRequest("Current activity and travel dates are required");
                }

                var prompt = "I need to replace an activity in my travel itinerary.\n" +
                    $"Current activity: {JsonSerializer.Serialize(request.CurrentActivity)}\n" +
                    $"Reason for replacement: {request.Reason ?? "Not specified"}\n\n" +
                    "Please suggest a better activity that fits with the following trip details:\n" +
                    $"Destination: {request.Destination ?? "Not specified"}\n" +
                    $"Travel Dates: {request.TravelDates.Start} to {request.TravelDates.End}\n" +
                    $"Travel Style: {request.TravelStyle ?? "Not specified"}\n" +
                    $"Interests: {(request.Interests != null && request.Interests.Any() ? string.Join(", ", request.Interests) : "Not specified")}\n\n" +
                    "Return the new activity in the following JSON format:\n" +
                    "{\n" +
                    "  \"title\": \"Activity Name\",\n" +
                    "  \"time\": \"HH:MM\",\n" +
                    "  \"duration\": \"X hours\",\n" +
                    "  \"priceRange\": \"$\",\n" +
                    "  \"description\": \"Detailed description of the activity\",\n" +
                    "  \"location\": \"Address or area\",\n" +
                    "  \"notes\": \"Any additional notes\",\n" +
                    "  \"bookingUrl\": \"https://example.com\"\n" +
                    "}";

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = "You are a helpful travel assistant that suggests activities for travel itineraries. Always respond with valid JSON." },
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.7,
                    max_tokens = 500
                };

                var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Raw OpenAI response for activity replacement: {Response}", responseContent);
                
                var jsonResponse = JsonDocument.Parse(responseContent);
                var messageContent = jsonResponse.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (string.IsNullOrEmpty(messageContent))
                {
                    throw new Exception("Empty response content from OpenAI");
                }

                _logger.LogInformation("Message content from OpenAI for activity replacement: {Content}", messageContent);

                // Try to parse the JSON content from the response
                try
                {
                    // Handle case where the response might be wrapped in markdown code blocks
                    messageContent = System.Text.RegularExpressions.Regex.Replace(
                        messageContent, 
                        @"```(json\n)?|```", 
                        string.Empty, 
                        System.Text.RegularExpressions.RegexOptions.IgnoreCase).Trim();

                    var newActivity = JsonSerializer.Deserialize<Activity>(
                        messageContent, 
                        new JsonSerializerOptions 
                        { 
                            PropertyNameCaseInsensitive = true,
                            AllowTrailingCommas = true,
                            ReadCommentHandling = JsonCommentHandling.Skip
                        });

                    if (newActivity == null)
                    {
                        throw new Exception("Failed to deserialize the activity from the response");
                    }

                    return Ok(newActivity);
                }
                catch (JsonException jsonEx)
                {
                    _logger.LogError(jsonEx, "Failed to parse activity. Raw content: {Content}", messageContent);
                    throw new Exception($"Failed to parse activity: {jsonEx.Message}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error replacing activity");
                return StatusCode(500, "An error occurred while generating a replacement activity");
            }
        }

        [AllowAnonymous]  
        [HttpPost("create")]
        public async Task<IActionResult> GenerateItinerary([FromBody] ItineraryRequest request)
        {
            try
            {
                var apiKey = _configuration["OpenAI:ApiKey"];
                if (string.IsNullOrEmpty(apiKey) || apiKey == "your-openai-api-key-here")
                {
                    return BadRequest("OpenAI API key is not configured");
                }

                if (request.TravelDates == null || string.IsNullOrEmpty(request.Destination))
                {
                    return BadRequest("Destination and travel dates are required");
                }

                var prompt = @$"Create a detailed travel itinerary for {request.Destination ?? "a destination"} " + 
                    $"from {request.TravelDates.Start} to {request.TravelDates.End}." + 
                    $"\nBudget: {request.Budget ?? "Not specified"}" + 
                    $"\nTravel Style: {request.TravelStyle ?? "Not specified"}" +
                    $"\nInterests: {(request.Interests != null && request.Interests.Any() ? string.Join(", ", request.Interests) : "Not specified")}" +
                    $"\nAccommodation: {request.Accommodation ?? "Not specified"}" +
                    
                    "\n\nReturn the response as a JSON array of activity objects. The response must be a valid JSON array where each element is an activity object. Example of the expected format:\n" +
                    "[\n" +
                    "  {\n" +
                    "    \"title\": \"Activity title\",\n" +
                    "    \"time\": \"Time of day (e.g., 'Morning', 'Afternoon', or specific time)\",\n" +
                    "    \"duration\": \"Estimated duration (e.g., '2 hours', 'Half day')\",\n" +
                    "    \"priceRange\": \"Price range in local currency (e.g., '$$-$$$', '€50-100')\",\n" +
                    "    \"description\": \"Detailed description of the activity\",\n" +
                    "    \"bookingUrl\": \"URL for booking or more information (if available)\",\n" +
                    "    \"location\": \"Specific location or address\",\n" +
                    "    \"notes\": \"Any additional notes or tips\"\n" +
                    "  },\n" +
                    "  {\n" +
                    "    \"title\": \"Another activity\",\n" +
                    "    \"time\": \"Afternoon\",\n" +
                    "    \"duration\": \"2 hours\",\n" +
                    "    \"priceRange\": \"$$-$$$\",\n" +
                    "    \"description\": \"Detailed description of another activity\",\n" +
                    "    \"bookingUrl\": \"\",\n" +
                    "    \"location\": \"Specific location\",\n" +
                    "    \"notes\": \"\"\n" +
                    "  }\n" +
                    "]" +
                    "\n\nIMPORTANT: Respond with ONLY the JSON array, no other text or explanation. The response must be parseable by System.Text.Json.";

                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Bearer", apiKey);

                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    response_format = new { type = "json_object" },
                    messages = new[]
                    {
                        new { 
                            role = "system", 
                            content = "You are a helpful travel assistant that creates detailed travel itineraries. Always respond with valid JSON." 
                        },
                        new { 
                            role = "user", 
                            content = prompt 
                        }
                    }
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json");

                var response = await httpClient.PostAsync(
                    "https://api.openai.com/v1/chat/completions",
                    content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("OpenAI API error: {Error}", errorContent);
                    return StatusCode((int)response.StatusCode, new { error = "Error calling OpenAI API", details = errorContent });
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Raw OpenAI response: {Response}", responseContent);
                
                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                var messageContent = jsonResponse
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (string.IsNullOrEmpty(messageContent))
                {
                    throw new Exception("Empty response content from OpenAI");
                }

                _logger.LogInformation("Message content from OpenAI: {Content}", messageContent);

                // Try to parse the JSON content from the response
                try
                {
                    // Handle case where the response might be a JSON object with an activities array
                    using (JsonDocument doc = JsonDocument.Parse(messageContent))
                    {
                        if (doc.RootElement.ValueKind == JsonValueKind.Object && 
                            doc.RootElement.TryGetProperty("activities", out var activitiesArray))
                        {
                            messageContent = activitiesArray.GetRawText();
                        }
                    }

                    var activities = JsonSerializer.Deserialize<List<Activity>>(
                        messageContent, 
                        new JsonSerializerOptions 
                        { 
                            PropertyNameCaseInsensitive = true,
                            AllowTrailingCommas = true,
                            ReadCommentHandling = JsonCommentHandling.Skip
                        });

                    if (activities == null || !activities.Any())
                    {
                        throw new Exception("No activities were generated in the response");
                    }

                    // Convert the flat list of activities into the expected ItineraryDay format
                    var itineraryDays = new List<ItineraryDay>();
                    var currentDate = DateTime.Parse(request.TravelDates.Start);
                    var endDate = DateTime.Parse(request.TravelDates.End);
                    
                    // Group activities into days (3 activities per day by default)
                    var activitiesPerDay = 3;
                    var totalDays = (endDate - currentDate).Days + 1;
                    activitiesPerDay = (int)Math.Ceiling((double)activities.Count / totalDays);
                    
                    for (int i = 0; i < activities.Count; i += activitiesPerDay)
                    {
                        var dayActivities = activities.Skip(i).Take(activitiesPerDay).ToList();
                        var day = new ItineraryDay
                        {
                            Date = currentDate.ToString("yyyy-MM-dd"),
                            Activities = dayActivities,
                            Meals = new Meals(),
                            Transportations = new List<Transportation>()
                        };
                        itineraryDays.Add(day);
                        currentDate = currentDate.AddDays(1);
                    }

                    return Ok(itineraryDays);
                }
                catch (JsonException jsonEx)
                {
                    _logger.LogError(jsonEx, "Failed to parse activities. Raw content: {Content}", messageContent);
                    throw new Exception($"Failed to parse activities: {jsonEx.Message}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating itinerary");
                return StatusCode(500, new { error = "An error occurred while generating the itinerary.", details = ex.Message });
            }
        }
    }
}