
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class UsersController(DataContext context) : BaseApiController
{

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await context.Users.ToListAsync();

        return users;
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDataDto>> GetUser()
    {
        var username = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(username))
            return Unauthorized("Invalid token or username not found");

        var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);


        if (user == null) return NotFound("User not found");

        return new UserDataDto
        {
            Id = user.Id,
            Username = user.UserName,
        };
    }

}