using API.Helpers;

public static class PaginationHelper
{
    public static object GetPaginationMeta<T>(PagedList<T> pagedList)
    {
        return new
        {
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        };
    }
}