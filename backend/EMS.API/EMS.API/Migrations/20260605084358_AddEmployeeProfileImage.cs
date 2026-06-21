using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEmployeeProfileImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImage",
                table: "Employees",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImage",
                table: "Employees");
        }
    }
}
