using System.Collections.Generic;

namespace AITravelAssistant.Models
{
    public class TravelDates
    {
        public string? Start { get; set; }
        public string? End { get; set; }
    }

    public class ReplaceActivityRequest
    {
        public Activity? CurrentActivity { get; set; }
        public string? Reason { get; set; }
        public string? Destination { get; set; }
        public TravelDates? TravelDates { get; set; }
        public string? TravelStyle { get; set; }
        public List<string> Interests { get; set; } = new List<string>();
    }
}
