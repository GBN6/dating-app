using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("Cannot get username form token");
        return username;
    }
}