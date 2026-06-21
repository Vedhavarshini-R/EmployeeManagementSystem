using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovalStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovalStatus",
                table: "Attendances",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "HrApproved",
                table: "Attendances",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "HrApproved",
                table: "Attendances");
        }
    }
}
