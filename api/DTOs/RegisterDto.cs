using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string? Email { get; set; }
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string? LastName { get; set; }
    [Required]
    public string? Gender { get; set; }
    [Required]
    public string? DateOfBirth { get; set; }
    [Required]
    public string? City { get; set; }
    [Required]
    public string? Country { get; set; }

    [Required]
    [StringLength(20, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

}