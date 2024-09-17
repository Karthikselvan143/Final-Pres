namespace ProjectDemo1.Models
{
    public class PaymentRequest
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public decimal Amount { get; set; } 
        public string CardNumber { get; set; } 
        public string ExpiryDate { get; set; } 
        public string Cvv { get; set; }
        public string UserEmail { get; set; }
    }
}
