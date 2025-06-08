namespace AITravelAssistant.Models
{
    public class ItineraryRequest
    {
        public string Destination { get; set; }
        public TravelDateRange TravelDates { get; set; }
        public string Budget { get; set; }
        public string TravelStyle { get; set; }
        public List<string> Interests { get; set; }
        public string Accommodation { get; set; }
    }

    public class TravelDateRange
    {
        public string Start { get; set; }
        public string End { get; set; }
    }
}