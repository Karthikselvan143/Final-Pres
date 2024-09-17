namespace ProjectDemo1.Models
{
    public class BookedRoomResponse
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public string UserEmail { get; set; }
        public DateTime BookingDate { get; set; }
        public bool IsConfirmed { get; set; }
        public RoomDetails RoomDetails { get; set; }
    }
}
