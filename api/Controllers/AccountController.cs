using System.Security.Cryptography;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using AutoMapper;
using API.Extensions;

namespace API.Controllers;

public class AccountController(IUserRepository userRepository, IMapper mapper, DataContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        using var hmac = new HMACSHA512();

        var user = mapper.Map<AppUser>(registerDto);

        user.UserName = registerDto.Username.ToLower();
        user.KnownAs = registerDto.FirstName;
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        user.PasswordSalt = hmac.Key;
        var memberDto = mapper.Map<MemberDto>(user);

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDto
        {
            UserData = memberDto,
            Token = tokenService.CreateToken(user)
        };
    }


    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(loginDto.Username);

        if (user == null) return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");

        }

        var memberDto = mapper.Map<MemberDto>(user);

        return new UserDto
        {
            UserData = memberDto,
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