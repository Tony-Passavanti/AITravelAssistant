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

        [AllowAnonymous]  
        [HttpPost ("create")]
        public async Task<IActionResult> GenerateItinerary([FromBody] ItineraryRequest request)
        {
            try
            {
                var apiKey = _configuration["OpenAI:ApiKey"];
                if (string.IsNullOrEmpty(apiKey) || apiKey == "your-openai-api-key-here")
                {
                    return BadRequest("OpenAI API key is not configured");
                }

                var prompt = $@"Create a detailed travel itinerary for {request.Destination} 
                    from {request.TravelDates.Start} to {request.TravelDates.End}. 
                    The traveler's budget is {request.Budget} and they're interested in {string.Join(", ", request.Interests)}. 
                    Their travel style is {request.TravelStyle} and they prefer to stay in {request.Accommodation}. 
                    Include daily activities, restaurant recommendations, and any travel tips.
                    Format the response in HTML with appropriate headings and lists.";

                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Bearer", apiKey);

                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { 
                            role = "system", 
                            content = "You are a helpful travel assistant that creates detailed travel itineraries in HTML format." 
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
                var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                var messageContent = jsonResponse
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return Ok(new { itinerary = messageContent });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating itinerary");
                return StatusCode(500, new { error = "An error occurred while generating the itinerary.", details = ex.Message });
            }
        }
    }
}