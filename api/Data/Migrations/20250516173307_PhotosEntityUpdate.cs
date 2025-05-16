using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class PhotosEntityUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_AppuserId",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "AppuserId",
                table: "Photos",
                newName: "AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Photos_AppuserId",
                table: "Photos",
                newName: "IX_Photos_AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_AppUserId",
                table: "Photos",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_AppUserId",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "Photos",
                newName: "AppuserId");

            migrationBuilder.RenameIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos",
                newName: "IX_Photos_AppuserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_AppuserId",
                table: "Photos",
                column: "AppuserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
