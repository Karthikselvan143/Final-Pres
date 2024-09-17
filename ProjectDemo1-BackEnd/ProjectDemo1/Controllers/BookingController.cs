using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {

        private readonly ProjectDbContext dbContext;

        public BookingController(ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await dbContext.bookings.ToListAsync();
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await dbContext.bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await dbContext.bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            dbContext.bookings.Remove(booking);
            await dbContext.SaveChangesAsync();

            return NoContent(); // Success status for a DELETE request
        }

        // GET: api/Bookings/Details
        [HttpGet("Details")]
        public async Task<ActionResult<IEnumerable<BookingWithDetails>>> GetBookingDetails()
        {
            var bookingDetails = await dbContext.bookings
                .Join(
                    dbContext.DatePickers,
                    booking => booking.RoomId,
                    datePicker => datePicker.Id,
                    (booking, datePicker) => new { booking, datePicker }
                )
                .Join(
                    dbContext.Rooms,
                    bookingDate => bookingDate.booking.RoomId,
                    room => room.Id,
                    (bookingDate, room) => new BookingWithDetails
                    {
                        BookingId = bookingDate.booking.Id,
                        RoomId = bookingDate.booking.RoomId,
                        UserEmail = bookingDate.booking.UserEmail,
                        BookingDate = bookingDate.booking.BookingDate,
                        IsConfirmed = bookingDate.booking.IsConfirmed,
                        RoomNumber = bookingDate.booking.RoomNumber,
                        RoomType = bookingDate.booking.RoomType,
                        RoomPrice = bookingDate.booking.RoomPrice,
                        Location = bookingDate.datePicker.Location,
                        StartDate = bookingDate.datePicker.StartDate,
                        EndDate = bookingDate.datePicker.EndDate,
                        IsBooked = room.IsBooked // Check if the room is booked or available
                    })
                .ToListAsync();

            return bookingDetails;
        }

        [HttpPost]
        [Route("CancelBookingStatus")]
        public async Task<IActionResult> CancelBookingStatus([FromBody] CancelBookingRequests request)
        {
            if (request == null || request.BookingId <= 0)
            {
                return BadRequest(new { message = "Invalid request data." });
            }

            // Retrieve the booking based on the provided BookingId
            var booking = await dbContext.bookings
                .Include(b => b.roomDetails)
                .FirstOrDefaultAsync(b => b.Id == request.BookingId);

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            // Update the booking status to "Cancelled"
            booking.IsConfirmed = false;

            // Optionally, update the room status if needed
            if (booking.roomDetails != null)
            {
                booking.roomDetails.IsBooked = false;
                dbContext.roomDetails.Update(booking.roomDetails);
            }

            dbContext.bookings.Update(booking);
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Booking successfully cancelled." });
        }
    }
    public class CancelBookingRequests
    {
        public int BookingId { get; set; }
    }
}