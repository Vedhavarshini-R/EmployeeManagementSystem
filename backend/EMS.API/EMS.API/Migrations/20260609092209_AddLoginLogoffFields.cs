using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLoginLogoffFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LogOffTime",
                table: "Attendances",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LoginTime",
                table: "Attendances",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "WorkingHours",
                table: "Attendances",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogOffTime",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "LoginTime",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "WorkingHours",
                table: "Attendances");
        }
    }
}
