using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEmployeeReasonAndAdminDecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Reason",
                table: "Attendances",
                newName: "EmployeeReason");

            migrationBuilder.AddColumn<string>(
                name: "AdminDecision",
                table: "Attendances",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminDecision",
                table: "Attendances");

            migrationBuilder.RenameColumn(
                name: "EmployeeReason",
                table: "Attendances",
                newName: "Reason");
        }
    }
}
