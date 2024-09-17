using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectDemo1.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ProjectDemo1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class UsersController : ControllerBase
    {
        private readonly ProjectDbContext dbContext;
        private readonly IConfiguration configuration;

        public UsersController(ProjectDbContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("Registration")]
        public async Task<IActionResult> Register([FromBody] Registration registration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var emailLower = registration.Email.ToLower();

            if (await dbContext.Users.AnyAsync(s => s.Email.ToLower() == emailLower))
            {
                return BadRequest("Email already exists.");
            }

            var user = new User
            {
                FirstName = registration.FirstName,
                LastName = registration.LastName,
                Email = registration.Email,
                Password = registration.Password, // Store plaintext password
                Role = registration.Email == "admin123@gmail.com" ? "admin" : "user"
            };

            try
            {
                dbContext.Users.Add(user);
                await dbContext.SaveChangesAsync();
                return Ok(new { Message = "Registration successful" });
            }
            catch (Exception ex)
            {
                // Log the exception (you might use a logging framework here)
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login([FromBody] Login login)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.Email == login.Email && x.Password == login.Password);
            if (user != null)
            {
                // Assign role based on email
                string role = user.Email == "admin123@gmail.com" ? "admin" : "user";

                var claims = new[]
                {
            new Claim(JwtRegisteredClaimNames.Sub, configuration["Jwt:Subject"]),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("UserId", user.Id.ToString()),
            new Claim("Email", user.Email),
            new Claim("Role", role) // Use the determined role
        };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    issuer: configuration["Jwt:Issuer"],
                    audience: configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(24),
                    signingCredentials: signIn
                );

                string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new
                {
                    Token = tokenValue,
                    User = new
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Role = role // Ensure role is included
                    }
                });
            }

            return Unauthorized();
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Clear the session
            return Ok();
        }


        //[HttpPost]
        //[Route("Login")]
        //public IActionResult Login([FromBody] Login login)
        //{
        //    var user = dbContext.Users.FirstOrDefault(x => x.Email == login.Email && x.Password == login.Password);
        //    if (user != null)
        //    {
        //        //if user is valid we have to claims some 
        //        var claims = new[]
        //        {
        //            new Claim(JwtRegisteredClaimNames.Sub,configuration["Jwt:Subject"]),
        //            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
        //            new Claim("UserId",user.Id.ToString()),
        //            new Claim("Email",user.Email.ToString())
        //        };
        //        var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        //        var signIn=new SigningCredentials(Key,SecurityAlgorithms.HmacSha256);
        //        var token = new JwtSecurityToken(
        //            configuration["Jwt:Issuer"],
        //            configuration["Jwt:Audience"],
        //            claims,
        //            expires: DateTime.UtcNow.AddHours(24),
        //            signingCredentials: signIn
        //            );
        //        string tokenValue=new JwtSecurityTokenHandler().WriteToken(token); 
        //        return Ok(new {Token=tokenValue,User=user,access= tokenValue });
        //        //return Ok(user);
        //    }
        //    return Unauthorized();
        //}

        //[HttpGet]
        //[Route("GetUsers")]
        //public async Task<IActionResult> GetUsers()
        //{
        //    var users = await dbContext.Users.ToListAsync();
        //    return Ok(new
        //    {
        //        users
        //    });
        //}
        [HttpGet]
        [Route("GetUsers")]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            var users = await dbContext.Users
                .Where(u => u.Role != "admin") // Exclude admins
                .ToListAsync();

            return Ok(new
            {
                users
            });
        }


        [HttpGet()]
        [Route("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var users = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (users != null)
            {
                return Ok(users);
            }
            return NotFound(); // Return 404 Not Found if user doesn't exist
        }

        [HttpPatch]
        [Route("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest("User ID mismatch");
            }

            var existingUser = await dbContext.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            // Update only the fields that are provided
            if (!string.IsNullOrEmpty(userDto.FirstName))
            {
                existingUser.FirstName = userDto.FirstName;
            }
            if (!string.IsNullOrEmpty(userDto.LastName))
            {
                existingUser.LastName = userDto.LastName;
            }
            if (!string.IsNullOrEmpty(userDto.Email))
            {
                existingUser.Email = userDto.Email;
            }
            if (userDto.IsActive.HasValue)
            {
                existingUser.IsActive = userDto.IsActive.Value;
            }

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound("User not found");
                }
                else
                {
                    throw;
                }
            }

            return Ok(existingUser);
        }
        private bool UserExists(int id)
        {
            return dbContext.Users.Any(e => e.Id == id);
        }

        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {

            try
            {
                var users = await dbContext.Users.FindAsync(id);
                if (users == null)
                {
                    return NotFound();
                }
                dbContext.Users.Remove(users);
                await dbContext.SaveChangesAsync();
                return NoContent();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting user: {ex.Message}");
            }
        }

    }

}
