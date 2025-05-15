using System.Security.Cryptography;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;

namespace API.Controllers;

public class AccountController(DataContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");
        return Ok();

        //     using var hmac = new HMACSHA512();

        //     var user = new AppUser
        //     {
        //         UserName = registerDto.Username.ToLower(),
        //         Email = registerDto.Email.ToLower(),
        //         FirstName = registerDto.FirstName,
        //         LastName = registerDto.LastName,
        //         PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
        //         PasswordSalt = hmac.Key
        //     };

        //     context.Users.Add(user);
        //     await context.SaveChangesAsync();

        //     return new UserDto
        //     {
        //         UserData = new UserDataDto
        //         {
        //             Id = user.Id,
        //             Username = user.UserName,
        //         },
        //         Token = tokenService.CreateToken(user)
        //     };
        // }
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.FirstOrDefaultAsync(user => user.UserName == loginDto.Username.ToLower());

        if (user == null) return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");

        }

        return new UserDto
        {
            UserData = new UserDataDto
            {
                Id = user.Id,
                Username = user.UserName,
            },
            Token = tokenService.CreateToken(user)
        };

    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Since JWTs are stateless, you can't "invalidate" a token directly.
        // However, you can implement token blacklisting or simply return a success response.
        return Ok(new { message = "Logged out successfully" }); // Return JSON instead of plain text
    }

    private async Task<bool> UserExists(string username)
    {
        return await context.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
    }
}