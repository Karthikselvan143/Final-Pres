using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;

        public PaymentController
            (ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet]
        [Route("GetRooms")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await dbContext.Rooms
                .Select(r => new
                {
                    r.RoomNumber,
                    r.IsBooked // Assuming you have an IsBooked property
                })
                .ToListAsync();

            return Ok(rooms);
        }
        [HttpGet]
        [Route("GetAvailableRooms")]
        public async Task<IActionResult> GetAvailableRooms()
        {
            var availableRooms = await dbContext.Rooms
                .Where(r => !r.IsBooked) // Assuming you have an IsBooked property
                .Select(r => new { r.RoomNumber }) // Select only RoomNumber
                .ToListAsync();

            return Ok(availableRooms);
        }

        [HttpGet]
        [Route("GetBookedRoomsimage")]
        public async Task<IActionResult> GetBookedRoomsimage()
        {
            var bookedRooms = await dbContext.Rooms
                .Where(r => r.IsBooked)
                .ToListAsync();

            return Ok(bookedRooms);
        }

        [HttpGet]
        [Route("GetBookedRooms")]
        public async Task<IActionResult> GetBookedRooms()
        {
            var bookedRooms = await dbContext.Rooms
                .Where(r => r.IsBooked)
                .Select(r => new { r.RoomNumber }) // Select only RoomNumber
                .ToListAsync();

            return Ok(bookedRooms);
        }


        [HttpGet]
        [Route("GetBookedRoomsPayments")]
        public async Task<IActionResult> GetBookedRoomsPayments()
        {
            var bookedRooms = await dbContext.Rooms
                .Join(
                    dbContext.PaymentTransactions,
                    room => room.Id,
                    payment => payment.RoomId,
                    (room, payment) => new { room, payment }
                )
                .Join(
                    dbContext.Users,
                    rp => rp.room.Id, // Assuming RoomId is used to relate to User
                    user => user.Id,
                    (rp, user) => new { rp.room, rp.payment, user }
                )
                .Join(
                    dbContext.DatePickers, // Join with DatePickers to fetch StartDate, EndDate, and Location
                    rp => rp.room.Id,
                    datePicker => datePicker.Id, // Assuming DatePicker is associated with the Room using RoomId
                    (rp, datePicker) => new
                    {
                        rp.room.RoomNumber,
                        rp.room.RoomType,
                        rp.room.Price,
                        rp.payment.Amount,
                        rp.payment.Date,
                        rp.room.Location,
                        rp.user.FirstName,
                        rp.user.LastName,
                        rp.user.Email,

                        // DatePicker details
                        DatePickerLocation = datePicker.Location,
                        StartDate = DateOnly.FromDateTime(datePicker.StartDate), // Convert DateTime to DateOnly
                        EndDate = DateOnly.FromDateTime(datePicker.EndDate)      // Convert DateTime to DateOnly
                    }
                )
                .Where(rp => rp.Amount > 0) // Ensure there is a payment amount
                .ToListAsync();

            return Ok(bookedRooms);
        }


        [HttpPost]
        [Route("ProcessPayment")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest paymentRequest)
        {
            if (paymentRequest == null)
            {
                return BadRequest(new { message = "Invalid payment request." });
            }

            using var transaction = await dbContext.Database.BeginTransactionAsync();

            try
            {
                // Retrieve the room details
                var room = await dbContext.Rooms.FindAsync(paymentRequest.RoomId);
                if (room == null)
                {
                    return NotFound(new { message = "Room not found." });
                }

                // Check if the room is currently booked
                var existingBooking = await dbContext.bookings
                    .Where(b => b.RoomId == paymentRequest.RoomId && b.IsConfirmed)
                    .FirstOrDefaultAsync();

                if (existingBooking != null)
                {
                    // Mark the previous booking as canceled
                    existingBooking.IsConfirmed = false;
                    dbContext.bookings.Update(existingBooking);
                }

                // Create a new booking record
                var newBooking = new Booking
                {
                    RoomId = paymentRequest.RoomId,
                    UserEmail = paymentRequest.UserEmail,
                    BookingDate = DateTime.UtcNow,
                    IsConfirmed = true,
                    RoomNumber = room.RoomNumber.ToString(),
                    RoomType = room.RoomType,
                    RoomPrice = paymentRequest.Amount // Assuming you want to store the payment amount
                };

                // Update the room status
                room.IsBooked = true;
                dbContext.Rooms.Update(room);

                // Save changes
                dbContext.bookings.Add(newBooking);
                await dbContext.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return Ok(new { message = "Payment and booking successful!" });
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Database update failed." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = $"Payment processing failed: {ex.Message}" });
            }
        }

        private string MaskCardNumber(string cardNumber)
        {
            if (cardNumber.Length > 4)
            {
                return "**** **** **** " + cardNumber.Substring(cardNumber.Length - 4);
            }
            return cardNumber;
        }



        [HttpGet]
        [Route("GetBookedRoomsByUserEmail")]
        public async Task<IActionResult> GetBookedRoomsByUserEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Invalid user email." });
            }

            try
            {
                var bookedRooms = await dbContext.bookings
                    .Where(b => b.UserEmail == email && b.IsConfirmed)
                    .Select(b => new
                    {
                        b.RoomNumber,
                        b.RoomType,
                        RoomPrice = b.RoomPrice, // Use alias if needed
                        b.BookingDate,
                        b.UserEmail,
                        b.IsConfirmed,
                        b.RoomId,

                        // Join with the Room table to get additional room details
                        RoomDetails = dbContext.Rooms
                            .Where(r => r.Id == b.RoomId)
                            .Select(r => new
                            {
                                r.Location,
                                r.Amenities,
                                r.Description,
                                r.ImagePath,
                                r.Rating,
                                r.Price,
                                r.IsBooked
                            }).FirstOrDefault() // Assuming each RoomId corresponds to one room
                    })
                    .ToListAsync();

                if (bookedRooms == null || !bookedRooms.Any())
                {
                    return NotFound(new { message = "No booked rooms found for the specified user email." });
                }

                return Ok(bookedRooms);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while retrieving booked rooms by user email: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }

        }
    }
}
