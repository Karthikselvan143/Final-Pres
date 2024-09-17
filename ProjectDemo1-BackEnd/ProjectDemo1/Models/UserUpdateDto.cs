namespace ProjectDemo1.Models
{
    public class UserUpdateDto
    {

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? IsActive { get; set; } // Use nullable for optional fields
    }
}
