namespace ProjectDemo1.Models
{
    public class BookingWithDetails
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public string UserEmail { get; set; }
        public DateTime BookingDate { get; set; }
        public bool IsConfirmed { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public decimal RoomPrice { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsBooked { get; set; }
    }
}
