namespace ProjectDemo1.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string UserEmail { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;
        public bool IsConfirmed { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public decimal RoomPrice { get; set; }

        public RoomDetails roomDetails { get; set; }

    }

}
