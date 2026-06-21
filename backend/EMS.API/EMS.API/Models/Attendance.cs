public class Attendance
{
    public int Id { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime? LoginTime { get; set; }

    public DateTime? LogOffTime { get; set; }

    public double WorkingHours { get; set; }

    public string ApprovalStatus { get; set; } = "Approved";

    public bool HrApproved { get; set; } = false;

    public string EmployeeReason { get; set; } = "";

    public string AdminDecision { get; set; } = "";
}