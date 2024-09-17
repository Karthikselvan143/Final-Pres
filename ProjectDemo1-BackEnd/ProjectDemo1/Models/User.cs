namespace ProjectDemo1.Models
{
    public class User
    {
        public int Id { get; set; } = 0;
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String Password { get; set; }
        public int IsActive { get; set; } = 1;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string Role { get; set; }
    }
}
