using EMS.API.Data;
using EMS.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            // Hardcoded Admin
            if (model.Username == "admin" && model.Password == "admin123")
            {
                var token = GenerateJwtToken("ADMIN");

                return Ok(new
                {
                    token,
                    role = "ADMIN"
                });
            }

            // Hardcoded HR
            if (model.Username == "hr" && model.Password == "hr123")
            {
                var token = GenerateJwtToken("HR");

                return Ok(new
                {
                    token,
                    role = "HR"
                });
            }

            // Employee Login
            var employee = await _context.Employees
                .FirstOrDefaultAsync(x =>
                    x.Username == model.Username &&
                    x.Password == model.Password);

            if (employee == null)
            {
                return Unauthorized("Invalid Username or Password");
            }

            var employeeToken = GenerateJwtToken("EMPLOYEE");
            return Ok(new
            {
                token = employeeToken,
                role = "EMPLOYEE",
                employeeName = employee.FullName,
                username = employee.Username
            });
        }

        private string GenerateJwtToken(string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(5),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}