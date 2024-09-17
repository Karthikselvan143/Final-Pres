using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;
using static System.Net.Mime.MediaTypeNames;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class RoomController : ControllerBase
    {

        private readonly ProjectDbContext dbContext;

        public RoomController(ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        [Route("GetRoom")]

        public async Task<IActionResult> GetRoom()
        {
            try
            {
                var rooms = await dbContext.Rooms.ToListAsync();
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving rooms: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("GetRooms")]

        public async Task<IActionResult> GetRooms()
        {
            try
            {
                var rooms = await dbContext.Rooms.ToListAsync();
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving rooms: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("AddRoom")]
        [Authorize]
        public async Task<IActionResult> AddRoom([FromBody] Room room)
        {
            if (room == null)
            {
                return BadRequest("Room data is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid room data.");
            }

            try
            {
                // Check if a room with the same RoomNumber already exists
                bool roomExists = await dbContext.Rooms
                    .AnyAsync(r => r.RoomNumber == room.RoomNumber);

                if (roomExists)
                {
                    return Conflict($"A room with number {room.RoomNumber} already exists.");
                }

                // Add the new room
                dbContext.Rooms.Add(room);
                await dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRooms), new { id = room.Id }, room);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding room: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("UpdateRoom/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] Room updatedRoom)
        {
            // Check if the ID from the route matches the ID in the request body
            if (id != updatedRoom.Id)
            {
                return BadRequest("Room ID mismatch");
            }

            // Check if the updated room model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the existing room by ID
            var existingRoom = await dbContext.Rooms.FindAsync(id);
            if (existingRoom == null)
            {
                return NotFound();
            }

            // Update the existing room with new values
            existingRoom.RoomType = updatedRoom.RoomType;
            existingRoom.Price = updatedRoom.Price;
            existingRoom.ISAvailable = updatedRoom.ISAvailable;
            existingRoom.Rating = updatedRoom.Rating;
            existingRoom.Location = updatedRoom.Location;
            existingRoom.Description = updatedRoom.Description;
            existingRoom.Amenities = updatedRoom.Amenities;
            if (!string.IsNullOrEmpty(updatedRoom.ImagePath))
            {
                existingRoom.ImagePath = updatedRoom.ImagePath;
            }
            if (!string.IsNullOrEmpty(updatedRoom.BathRoom))
            {
                existingRoom.BathRoom = updatedRoom.BathRoom;
            }
            if (!string.IsNullOrEmpty(updatedRoom.Hall))
            {
                existingRoom.Hall = updatedRoom.Hall;
            }
            if (!string.IsNullOrEmpty(updatedRoom.BedRoom))
            {
                existingRoom.BedRoom = updatedRoom.BedRoom;
            }
            // Save changes to the database
            dbContext.Rooms.Update(existingRoom);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }





        [HttpDelete]
        [Route("DeleteRoom/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                var room = await dbContext.Rooms.FindAsync(id);
                if (room == null)
                {
                    return NotFound($"Room with ID {id} not found.");
                }

                dbContext.Rooms.Remove(room);
                await dbContext.SaveChangesAsync();
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting room: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("CancelBooking")]
        public async Task<IActionResult> CancelBooking([FromBody] CancelBookingRequest request)
        {
            if (request == null || request.RoomNumber <= 0 || string.IsNullOrEmpty(request.UserEmail))
            {
                return BadRequest(new { message = "Invalid request data." });
            }

            // Find the booking based on RoomNumber and UserEmail
            var booking = await dbContext.bookings
                .Include(b => b.roomDetails) // Ensure Room details are included
                .Where(b => b.RoomNumber.Equals(request.RoomNumber.ToString()) && b.UserEmail == request.UserEmail && b.IsConfirmed)
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found or already canceled." });
            }

            // Mark the booking as canceled
            booking.IsConfirmed = false;
            dbContext.bookings.Update(booking);

            // Retrieve the associated room
            var room = booking.roomDetails;

            if (room != null)
            {
                // Mark the room as available
                room.IsBooked = false;
                dbContext.roomDetails.Update(room);
            }
            else
            {
                return NotFound(new { message = "Associated room not found." });
            }

            // Save changes to the database
            await dbContext.SaveChangesAsync();

            return Ok(new { message = "Booking successfully canceled." });
        }


        public class CancelBookingRequest
        {
            public int RoomNumber { get; set; }
            public string UserEmail { get; set; }
        }
    }
}