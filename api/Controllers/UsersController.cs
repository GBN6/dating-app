
using System.Security.Claims;
using API.Data.Migrations;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedResponse<IEnumerable<MemberDto>>>> GetUsers([FromQuery] UserParams userParams)
    {
        userParams.CurrentUserName = User.GetUserName();
        var users = await userRepository.GetMembersAsync(userParams);

        var pagination = PaginationHelper.GetPaginationMeta(users);

        var response = new PagedResponse<IEnumerable<MemberDto>>
        {
            Data = users,
            Meta = pagination
        };

        return Ok(response);
    }

    [HttpGet("profile")]
    public async Task<ActionResult<MemberDto>> GetUser()
    {
        var username = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(username))
            return Unauthorized("Invalid token or username not found");

        var user = await userRepository.GetMemberAsync(username);


        if (user == null) return NotFound("User not found");

        return user;
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser2(string username)
    {
        var user = await userRepository.GetMemberAsync(username);
        if (user == null) return NotFound();

        return user;

    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {

        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Could not found user");

        mapper.Map(memberUpdateDto, user);
        if (await userRepository.SaveAllasync()) return NoContent();

        return BadRequest("Failed to update");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Cannot update user");

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count == 0) photo.isMain = true;

        user.Photos.Add(photo);

        if (await userRepository.SaveAllasync()) return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, mapper.Map<PhotoDto>(photo));

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Could not found user");

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

        if (photo == null || photo.isMain) return BadRequest("Cannot use this as main photo");

        var currentMainPhoto = user.Photos.FirstOrDefault(photo => photo.isMain);
        if (currentMainPhoto != null) currentMainPhoto.isMain = false;
        photo.isMain = true;

        if (await userRepository.SaveAllasync()) return NoContent();
        return BadRequest("Problem setting main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Could not found user");

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

        if (photo == null || photo.isMain) return BadRequest("Cannot delete this main photo");

        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        user.Photos.Remove(photo);

        if (await userRepository.SaveAllasync()) return Ok();
        return BadRequest("Problem deleting photo");
    }

}