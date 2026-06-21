using EMS.API.Data;
using EMS.API.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        // Add Employee
        [HttpPost]
        public IActionResult AddEmployee(Employee employee)
        {
            // Auto Username
            employee.Username = "EMP" + new Random().Next(1000, 9999);

            // Default Password
            employee.Password = "emp@123";

            _context.Employees.Add(employee);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Employee Added Successfully",
                username = employee.Username,
                password = employee.Password
            });
        }

        // Get All Employees
        
        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = _context.Employees.ToList();

            return Ok(employees);
        }
        [HttpGet("username/{username}")]
        public IActionResult GetEmployeeByUsername(string username)
        {
            var employee = _context.Employees
                .FirstOrDefault(x => x.Username == username);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            return Ok(employee);
        }

        [HttpGet("count")]
        public IActionResult GetEmployeeCount()
        {
            var count = _context.Employees.Count();

            return Ok(count);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, Employee updatedEmployee)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            employee.FullName = updatedEmployee.FullName;
            employee.Email = updatedEmployee.Email;
            employee.Phone = updatedEmployee.Phone;
            employee.Department = updatedEmployee.Department;
            employee.Designation = updatedEmployee.Designation;
            employee.Salary = updatedEmployee.Salary;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Employee Updated Successfully"
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            _context.Employees.Remove(employee);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Employee Deleted Successfully"
            });
        }

        [HttpGet("salary/{username}")]
        public IActionResult GetSalaryByUsername(string username)
        {
            var employee = _context.Employees
                .FirstOrDefault(x => x.Username == username);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                employee.FullName,
                employee.Department,
                employee.Designation,
                employee.Salary
            });
        }
        [HttpPost("upload-photo/{id}")]
        public IActionResult UploadPhoto(int id, IFormFile file)
        {
            var employee = _context.Employees.Find(id);

            if (employee == null)
            {
                return NotFound();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected");
            }

            var fileName =
                Guid.NewGuid() + Path.GetExtension(file.FileName);

            var filePath =
                Path.Combine("Uploads", fileName);

            using (var stream =
                new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            employee.ProfileImage = fileName;

            _context.SaveChanges();

            return Ok(new
            {
                image = fileName
            });
        }
        [HttpPost("change-password")]
        public IActionResult ChangePassword(ChangePasswordModel model)
        {
            var employee = _context.Employees
                .FirstOrDefault(x =>
                    x.Username == model.Username);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            if (employee.Password != model.CurrentPassword)
            {
                return BadRequest("Current password is incorrect");
            }

            employee.Password = model.NewPassword;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Password changed successfully"
            });
        }
    }
}