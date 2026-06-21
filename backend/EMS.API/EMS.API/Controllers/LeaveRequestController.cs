using EMS.API.Data;
using EMS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveRequestController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL LEAVES
        [HttpGet]
        public IActionResult GetLeaves()
        {
            return Ok(_context.LeaveRequests.ToList());
        }

        // GET PENDING COUNT
        [HttpGet("count")]
        public IActionResult GetPendingLeaveCount()
        {
            var count = _context.LeaveRequests
                .Count(x => x.Status == "Pending");

            return Ok(count);
        }

        [HttpPost]
        public IActionResult ApplyLeave(LeaveRequest leaveRequest)
        {
            leaveRequest.Status = "Pending";

            leaveRequest.FromDate =
                DateTime.SpecifyKind(leaveRequest.FromDate, DateTimeKind.Unspecified);

            leaveRequest.ToDate =
                DateTime.SpecifyKind(leaveRequest.ToDate, DateTimeKind.Unspecified);

            _context.LeaveRequests.Add(leaveRequest);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave Request Submitted Successfully"
            });
        }

        // APPROVE LEAVE
        [HttpPut("approve/{id}")]
        public IActionResult ApproveLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound();
            }

            leave.Status = "Approved";

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave Approved"
            });
        }

        // REJECT LEAVE
        [HttpPut("reject/{id}")]
        public IActionResult RejectLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound();
            }

            leave.Status = "Rejected";

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave Rejected"
            });
        }

        // DELETE LEAVE
        [HttpDelete("{id}")]
        public IActionResult DeleteLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound();
            }

            _context.LeaveRequests.Remove(leave);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Leave Deleted"
            });
        }
    }
}