namespace API.Helpers;

public class PaginationParams
{
    private const int MaxPageSize = 5;
    public int PageNumber { get; set; } = 1;

    public int _pageSize { get; set; } = 5;

    public int PageSize { get => _pageSize; set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; }

}