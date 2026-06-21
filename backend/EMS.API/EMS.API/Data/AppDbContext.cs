using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LeaveRequest>()
                .Property(x => x.FromDate)
                .HasColumnType("timestamp without time zone");

            modelBuilder.Entity<LeaveRequest>()
                .Property(x => x.ToDate)
                .HasColumnType("timestamp without time zone"); 
            modelBuilder.Entity<Attendance>()
                .Property(x => x.Date)
                .HasColumnType("timestamp without time zone");
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Department> Departments { get; set; }

        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        public DbSet<Announcement> Announcements { get; set; }
    }
}