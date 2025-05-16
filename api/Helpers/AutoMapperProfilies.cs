using API.DTOs;
using API.Entities;
using AutoMapper;
using API.Extensions;


namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
        .ForMember(destination => destination.Age, options => options.MapFrom(source => source.DateOfBirth.CalculateAge()))
        .ForMember(destination => destination.PhotoUrl, option => option.MapFrom(source => source.Photos.FirstOrDefault(x => x.isMain)!.Url));
        CreateMap<Photo, PhotoDto>();
    }
}