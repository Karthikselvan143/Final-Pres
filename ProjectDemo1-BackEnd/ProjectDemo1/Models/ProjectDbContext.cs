using Microsoft.EntityFrameworkCore;

namespace ProjectDemo1.Models
{
    public class ProjectDbContext : DbContext
    {

        public ProjectDbContext(DbContextOptions<ProjectDbContext> options) : base(options) { }


        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<RoomService> roomServices { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }

        public DbSet<DatePicker> DatePickers { get; set; }
        public DbSet<Booking> bookings { get; set; }

        public DbSet<RoomDetails> roomDetails { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.roomDetails)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b.RoomId);

            base.OnModelCreating(modelBuilder);
        }


    }
}