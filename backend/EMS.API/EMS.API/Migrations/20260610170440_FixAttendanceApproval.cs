using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class FixAttendanceApproval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Reason",
                table: "Attendances",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reason",
                table: "Attendances");
        }
    }
}
