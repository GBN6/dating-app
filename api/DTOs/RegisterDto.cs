using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;
    [Required]
    [StringLength(20, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

}