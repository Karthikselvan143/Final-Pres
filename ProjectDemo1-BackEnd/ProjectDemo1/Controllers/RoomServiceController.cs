using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomServiceController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;

        public RoomServiceController(ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpGet]
        [Route("GetStaff")]
        public async Task<IActionResult> GetStaff()
        {
            try
            {
                var staffs = await dbContext.roomServices.ToListAsync();
                return Ok(staffs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving staffs: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("CreateStaff")]
        public async Task<IActionResult> CreateStaff([FromBody] RoomService roomService)
        {
            if (roomService == null)
            {
                return BadRequest("staff data is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid staff data.");
            }
            var emailLower = roomService.Email.ToLower();

            if (await dbContext.roomServices.AnyAsync(s => s.Email.ToLower() == emailLower))
            {
                return BadRequest("Email already exists.");
            }
            var roomservice = new RoomService
            {
                StaffName = roomService.StaffName,
                Address = roomService.Address,
                Email = roomService.Email,
                IsAvailable = roomService.IsAvailable,
                Contact = roomService.Contact,
                Rating = roomService.Rating,
                Aadhar = roomService.Aadhar,
                ImagePath = roomService.ImagePath,
                JoinedDate = roomService.JoinedDate
            };

            try
            {
                dbContext.roomServices.Add(roomservice);
                await dbContext.SaveChangesAsync();
                return Ok(new { Message = "Staff added successful" });
            }
            catch (Exception ex)
            {
                // Log the exception (you might use a logging framework here)
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }

        }

        [HttpPut]
        [Route("UpdateStaff/{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] RoomService roomService)
        {
            if (id != roomService.Id)
            {
                return BadRequest("Staff ID mismatch");
            }

            // Check if the updated room model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the existing room by ID
            var existingstaff = await dbContext.roomServices.FindAsync(id);
            if (existingstaff == null)
            {
                return NotFound();
            }

            // Update the existing room with new values
            existingstaff.StaffName = roomService.StaffName;
            existingstaff.Address = roomService.Address;
            existingstaff.Contact = roomService.Contact;
            existingstaff.Email = roomService.Email;
            existingstaff.Rating = roomService.Rating;
            existingstaff.IsAvailable = roomService.IsAvailable;
            existingstaff.ImagePath = roomService.ImagePath;

            // Save changes to the database
            dbContext.roomServices.Update(existingstaff);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteStaff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            try
            {
                var staff = await dbContext.roomServices.FindAsync(id);
                if (staff == null)
                {
                    return NotFound($"staff with ID {id} not found.");
                }

                dbContext.roomServices.Remove(staff);
                await dbContext.SaveChangesAsync();
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting Staff: {ex.Message}");
            }
        }
    }
}
