namespace API.DTOs;

public class UserDto
{
    public required UserDataDto UserData { get; set; }
    public required string Token { get; set; }
}