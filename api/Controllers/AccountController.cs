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
using Microsoft.AspNetCore.Identity;

namespace API.Controllers;

public class AccountController(IMapper mapper, UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        var user = mapper.Map<AppUser>(registerDto);

        user.UserName = registerDto.Username.ToLower();
        user.KnownAs = registerDto.FirstName;
        var memberDto = mapper.Map<MemberDto>(user);

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return new UserDto
        {
            UserData = memberDto,
            Token = await tokenService.CreateToken(user)
        };
    }


    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        // var user = await userRepository.GetUserByUsernameAsync(loginDto.Username);
        var user = await userManager.Users.Include(u => u.Photos).FirstOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());

        if (user == null || user.UserName == null) return Unauthorized("Invalid username");

        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result) return Unauthorized("Invalid password");

        var memberDto = mapper.Map<MemberDto>(user);

        return new UserDto
        {
            UserData = memberDto,
            Token = await tokenService.CreateToken(user)
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
        return await userManager.Users.AnyAsync(user => user.NormalizedUserName == username.ToUpper());
    }
}