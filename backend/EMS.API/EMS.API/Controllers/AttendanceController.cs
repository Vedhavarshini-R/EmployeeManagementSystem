using EMS.API.Data;
using EMS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL ATTENDANCE
        [HttpGet]
        public IActionResult GetAttendance()
        {
            return Ok(_context.Attendances.ToList());
        }

        // GET COUNT
        [HttpGet("count")]
        public IActionResult GetAttendanceCount()
        {
            return Ok(_context.Attendances.Count());
        }

        // EMPLOYEE LOGIN
        [HttpPost("login")]
        public IActionResult EmployeeLogin(string employeeName)
        {
            try
            {
                var attendance = new Attendance
                {
                    EmployeeName = employeeName,

                    Date = DateTime.SpecifyKind(
                        DateTime.Now.Date,
                        DateTimeKind.Unspecified
                    ),

                    Status = "Present",

                    LoginTime = DateTime.UtcNow,

                    LogOffTime = null,

                    WorkingHours = 0
                };
                var existingAttendance = _context.Attendances
    .FirstOrDefault(a =>
        a.EmployeeName == attendance.EmployeeName &&
        a.Date.Date == attendance.Date.Date);

if (existingAttendance != null)
{
    return BadRequest(new
    {
        message = "Attendance already marked for today"
    });
}

                _context.Attendances.Add(attendance);
                _context.SaveChanges();

                return Ok(attendance);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        // EMPLOYEE LOG OFF
        [HttpPut("logoff/{id}")]
        public IActionResult EmployeeLogOff(
    int id,
    string reason
)
        {
            try
            {
                var attendance = _context.Attendances.Find(id);

                if (attendance == null)
                    return NotFound("Attendance record not found");

                attendance.LogOffTime = DateTime.UtcNow;

                if (attendance.LoginTime.HasValue)
                {
                    attendance.WorkingHours =
                        (attendance.LogOffTime.Value -
                         attendance.LoginTime.Value)
                        .TotalHours;

                    if (attendance.WorkingHours < 8)
                    {
                        attendance.Status = "Pending Approval";

                        attendance.ApprovalStatus = "Pending";

                        attendance.HrApproved = false;

                        attendance.EmployeeReason = reason;
                    }
                    else
                    {
                        attendance.Status = "Present";

                        attendance.ApprovalStatus = "Approved";

                        attendance.HrApproved = true;
                    }   
                }

                _context.SaveChanges();

                return Ok(attendance);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        // MANUAL ATTENDANCE ENTRY
        [HttpPost]
        public IActionResult MarkAttendance(Attendance attendance)
        {
            try
            {
                attendance.Date =
                    DateTime.SpecifyKind(
                        attendance.Date,
                        DateTimeKind.Unspecified
                    );

                if (attendance.LoginTime.HasValue)
                {
                    attendance.LoginTime =
                        DateTime.SpecifyKind(
                            attendance.LoginTime.Value,
                            DateTimeKind.Utc
                        );
                }

                if (attendance.LogOffTime.HasValue)
                {
                    attendance.LogOffTime =
                        DateTime.SpecifyKind(
                            attendance.LogOffTime.Value,
                            DateTimeKind.Utc
                        );
                }

                var existingAttendance = _context.Attendances
                    .FirstOrDefault(a =>
                        a.EmployeeName == attendance.EmployeeName &&
                        a.Date.Date == attendance.Date.Date);

                if (existingAttendance != null)
                {
                    return BadRequest(new
                    {
                        message = "Attendance already marked for today"
                    });
                }

                _context.Attendances.Add(attendance);

                _context.SaveChanges();

                return Ok(new
                {
                    message = "Attendance Marked Successfully"  
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPut("approve/{id}")]
        public IActionResult ApproveAttendance(
    int id,
    string reason)
        {
            var attendance =
                _context.Attendances.Find(id);

            if (attendance == null)
                return NotFound();

            attendance.Status = reason;

            attendance.ApprovalStatus = "Approved";

            attendance.HrApproved = true;

            attendance.AdminDecision = reason;

            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("reject/{id}")]
        public IActionResult RejectAttendance(int id)
        {
            var attendance =
                _context.Attendances.Find(id);

            if (attendance == null)
                return NotFound();

            attendance.Status = "Absent";

            attendance.ApprovalStatus = "Rejected";

            attendance.HrApproved = false;

            _context.SaveChanges();

            return Ok();
        }
        // DELETE ATTENDANCE
        [HttpDelete("{id}")]
        public IActionResult DeleteAttendance(int id)
        {
            var attendance =
                _context.Attendances.Find(id);

            if (attendance == null)
                return NotFound();

            _context.Attendances.Remove(attendance);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Attendance Deleted"
            });
        }
    }
}