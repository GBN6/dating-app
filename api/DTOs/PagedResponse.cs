namespace API.DTOs;

public class PagedResponse<T>
{
    public required T Data { get; set; }
    public required object Meta { get; set; }
}