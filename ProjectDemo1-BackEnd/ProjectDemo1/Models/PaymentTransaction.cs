namespace ProjectDemo1.Models
{
    public class PaymentTransaction
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public Room Room { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string CardNumber { get; set; } // Masked for security in real scenarios
        public string ExpiryDate { get; set; }
        public string Cvv { get; set; }
        public string Status { get; set; } // e.g., "Success" or "Failed"
        public bool IsBooked { get; set; }
    }
}
