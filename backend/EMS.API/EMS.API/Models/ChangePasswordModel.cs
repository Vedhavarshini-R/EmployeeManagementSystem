namespace EMS.API.Models
{
    public class ChangePasswordModel
    {
        public string Username { get; set; } = string.Empty;

        public string CurrentPassword { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;
    }
}