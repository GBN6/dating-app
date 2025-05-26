using API.Entities;

namespace API.DTOs;

public class UserDto
{
    public required MemberDto UserData { get; set; }
    public required string Token { get; set; }
}