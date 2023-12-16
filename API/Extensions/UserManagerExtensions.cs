using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtensions
    {
        public static async Task<AppUser> FindUserByClaimsPrincipalWithAddressAsync(this UserManager<AppUser> userManager, ClaimsPrincipal user) // This is an extension method for UserManager<AppUser>.
        {
            var email = user.FindFirstValue(ClaimTypes.Email); // Get the email from the claims.

            return await userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email); // Return the user with the address.
        }

        public static async Task<AppUser> FindByEmailFromClaimsPrincipal(this UserManager<AppUser> userManager, ClaimsPrincipal user) // This is an extension method for UserManager<AppUser>.
        {
            var email = user.FindFirstValue(ClaimTypes.Email); // Get the email from the claims.

            return await userManager.Users.SingleOrDefaultAsync(x => x.Email == email); // Return the user.
        }
    }
}