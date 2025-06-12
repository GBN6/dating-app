
using System.Security.Claims;
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
public class UsersController(IMapper mapper, IPhotoService photoService, IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedResponse<IEnumerable<MemberDto>>>> GetUsers([FromQuery] UserParams userParams)
    {
        userParams.CurrentUserName = User.GetUserName();
        var users = await unitOfWork.UserRepository.GetMembersAsync(userParams);

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

        var user = await unitOfWork.UserRepository.GetMemberAsync(username, true);


        if (user == null) return NotFound("User not found");

        return user;
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser2(string username)
    {
        var currentUsername = User.GetUserName();
        var user = await unitOfWork.UserRepository.GetMemberAsync(username, isCurrentUser: currentUsername == username);
        if (user == null) return NotFound();

        return user;

    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Could not find user");

        mapper.Map(memberUpdateDto, user);

        if (await unitOfWork.Complete()) return NoContent();

        return BadRequest("Failed to update the user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Cannot update user");

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        user.Photos.Add(photo);

        if (await unitOfWork.Complete())
            return CreatedAtAction(nameof(GetUser),
                new { username = user.UserName }, mapper.Map<PhotoDto>(photo));

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("Could not find user");

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null || photo.isMain) return BadRequest("Cannot use this as main photo");

        var currentMain = user.Photos.FirstOrDefault(x => x.isMain);
        if (currentMain != null) currentMain.isMain = false;
        photo.isMain = true;

        if (await unitOfWork.Complete()) return NoContent();

        return BadRequest("Problem setting main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null) return BadRequest("User not found");

        var photo = await unitOfWork.PhotoRepository.GetPhotoById(photoId);

        if (photo == null || photo.isMain) return BadRequest("This photo cannot be deleted");

        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        user.Photos.Remove(photo);

        if (await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem deleting photo");
    }

}