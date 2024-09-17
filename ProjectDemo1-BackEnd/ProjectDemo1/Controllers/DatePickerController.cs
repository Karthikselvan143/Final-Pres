using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatePickerController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;


        public DatePickerController(ProjectDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        [Route("GetDate")]
        public async Task<IActionResult> GetDate()
        {
            try
            {
                var dates = await dbContext.DatePickers.ToListAsync();
                return Ok(dates);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving staffs: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("CreateDate")]
        public async Task<IActionResult> CreateDate([FromBody] DatePicker newDatePicker)
        {
            if (newDatePicker == null)
            {
                return BadRequest("DatePicker object is null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                dbContext.DatePickers.Add(newDatePicker);
                await dbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(GetDate), new { id = newDatePicker.Id }, newDatePicker);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating date picker: {ex.Message}");
            }
        }

    }
}

