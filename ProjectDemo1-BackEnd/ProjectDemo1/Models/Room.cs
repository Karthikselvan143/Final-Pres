namespace ProjectDemo1.Models
{
    public class Room
    {
        public int Id { get; set; } = 0;
        public int RoomNumber { get; set; }
        public String RoomType { get; set; }
        public int Price { get; set; }
        public bool ISAvailable { get; set; }
        public string ImagePath { get; set; }
        public int Rating { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public string Amenities { get; set; }
        public bool IsBooked { get; set; }
        public string BathRoom { get; set; }
        public string Hall { get; set; }
        public string BedRoom { get; set; }

       
    }
}
