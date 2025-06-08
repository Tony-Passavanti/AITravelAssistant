using System.Collections.Generic;

namespace AITravelAssistant.Models
{
    public class ItineraryDay
    {
        public string? Date { get; set; }
        public List<Activity> Activities { get; set; } = new List<Activity>();
        public Meals? Meals { get; set; }
        public List<Transportation>? Transportations { get; set; }
    }

    public class MealRecommendation
    {
        public string? Name { get; set; }
        public string? Cuisine { get; set; }
        public string? PriceRange { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? BookingUrl { get; set; }
    }

    public class Meals
    {
        public MealRecommendation? Breakfast { get; set; }
        public MealRecommendation? Lunch { get; set; }
        public MealRecommendation? Dinner { get; set; }
    }

    public class Transportation
    {
        public string? Type { get; set; }
        public string? From { get; set; }
        public string? To { get; set; }
        public string? Time { get; set; }
        public string? Notes { get; set; }
    }

    public class Activity
    {
        public string? Date { get; set; }
        public string? Title { get; set; }
        public string? Time { get; set; }
        public string? Type { get; set; } = "activity"; // 'activity' or 'meal'
        public string? Duration { get; set; }
        public string? PriceRange { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public string? BookingUrl { get; set; }
    }
}
