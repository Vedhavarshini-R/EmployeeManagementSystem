using EMS.API.Data;
using EMS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnnouncementController(AppDbContext context)
        {
            _context = context;
        }

        // Get All Announcements
        [HttpGet]
        public IActionResult GetAnnouncements()
        {
            var announcements = _context.Announcements
                .OrderByDescending(x => x.CreatedDate)
                .ToList();

            return Ok(announcements);
        }

        // Add Announcement
        [HttpPost]
        public IActionResult AddAnnouncement(Announcement announcement)
        {
            announcement.CreatedDate = DateTime.UtcNow;

            _context.Announcements.Add(announcement);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Announcement Added Successfully"
            });
        }

        // Delete Announcement
        [HttpDelete("{id}")]
        public IActionResult DeleteAnnouncement(int id)
        {
            var announcement = _context.Announcements.Find(id);

            if (announcement == null)
            {
                return NotFound();
            }

            _context.Announcements.Remove(announcement);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Announcement Deleted Successfully"
            });
        }
    }
}