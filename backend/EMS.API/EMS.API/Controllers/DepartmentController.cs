using EMS.API.Data;
using EMS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public IActionResult GetDepartments()
        {
            return Ok(_context.Departments.ToList());
        }

        // GET COUNT
        [HttpGet("count")]
        public IActionResult GetDepartmentCount()
        {
            return Ok(_context.Departments.Count());
        }

        // ADD
        [HttpPost]
        public IActionResult AddDepartment(Department department)
        {
            _context.Departments.Add(department);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Department Added Successfully"
            });
        }

        // UPDATE
        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, Department updatedDepartment)
        {
            var department = _context.Departments.Find(id);

            if (department == null)
            {
                return NotFound();
            }

            department.Name = updatedDepartment.Name;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Department Updated Successfully"
            });
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            var department = _context.Departments.Find(id);

            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Department Deleted Successfully"
            });
        }
    }
}