namespace EMS.API.Models
{
    public class Announcement
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }
    }
}