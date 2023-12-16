using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet] // This is the route.
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value; // Get the email from the claims.

            var user = await _userManager.FindByEmailFromClaimsPrincipal(User); // Find the user by email.

            return new UserDto // Return the user.
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpGet("emailexists")] // This is the route.
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null; // Return true if the email exists.
        }

        [Authorize]
        [HttpGet("address")] // This is the route.
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            // var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value; // Get the email from the claims.

            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(User); // Find the user by email.

            return _mapper.Map<Address, AddressDto>(user.Address); // Return the user's address.
        }

        [Authorize]
        [HttpPut("address")] // This is the route.
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            // var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value; // Get the email from the claims.

            var user = await _userManager.FindUserByClaimsPrincipalWithAddressAsync(HttpContext.User); // Find the user by email.

            user.Address = _mapper.Map<AddressDto, Address>(address); // Update the user's address.

            var result = await _userManager.UpdateAsync(user); // Update the user.

            if (result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address)); // If the user is updated, return the user's address.

            return BadRequest("Problem updating the user"); // If the user is not updated, return BadRequest.
        }

        [HttpPost("login")] // This is the route.
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email); // Find the user by email.
            if (user == null) return Unauthorized(new ApiResponse(401)); // If the user is not found, return Unauthorized.

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false); // Check the password.

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401)); // If the password is incorrect, return Unauthorized.

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")] // This is the route.
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser // Create a new user.
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password); // Create the user with the password.

            if (!result.Succeeded) return BadRequest(new ApiResponse(400)); // If the user is not created, return BadRequest.

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

    }
}