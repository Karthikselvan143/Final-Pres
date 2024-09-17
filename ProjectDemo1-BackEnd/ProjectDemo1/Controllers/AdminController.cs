using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class AdminController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;
        public AdminController(ProjectDbContext context)
        {
            this.dbContext = context;
        }

        [HttpGet]
        [Route("GetFeedback")]
        public async Task<IActionResult> GetFeedback()
        {
            try
            {
                var feedbacks = await dbContext.Feedbacks.ToListAsync();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving Feedback: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("CreateFeedback")]
        public async Task<IActionResult> CreateResult([FromBody] Feedback feedback)
        {
            if (feedback == null)
            {
                return BadRequest("Feedback data is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Feedback data.");
            }

            try
            {
                dbContext.Feedbacks.Add(feedback);
                await dbContext.SaveChangesAsync();
               return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding Feedback: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("UpdateFeedback/{id}")]
        public async Task<IActionResult> UpdateFeedback(int id, [FromBody] Feedback feedback)
        {
            if (id != feedback.Id)
            {
                return BadRequest("FeedBack ID mismatch");
            }

            // Check if the updated room model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the existing room by ID
            var existingFeedback = await dbContext.Feedbacks.FindAsync(id);
            if (existingFeedback == null)
            {
                return NotFound();
            }

            // Update the existing room with new values
            existingFeedback.Name = feedback.Name;
            existingFeedback.Email = feedback.Email;
            existingFeedback.PhoneNumber = feedback.PhoneNumber;
            existingFeedback.message = feedback.message;

            // Save changes to the database
            dbContext.Feedbacks.Update(existingFeedback);
            await dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteFeedback/{id}")]

        public async Task<IActionResult> DeleteFeedBack(int id)
        {
            try
            {
                var feedback = await dbContext.Feedbacks.FindAsync(id);
                if (feedback == null)
                {
                    return NotFound($"FeedBack with ID {id} not found.");
                }

                dbContext.Feedbacks.Remove(feedback);
                await dbContext.SaveChangesAsync();
                return NoContent(); // HTTP 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting Feedback: {ex.Message}");
            } 
        }
    }
}
