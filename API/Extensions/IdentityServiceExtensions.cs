using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AppIdentityDbContext>(x =>
            {
                x.UseSqlite(config.GetConnectionString("IdentityConnection"));
            });

            services.AddIdentityCore<AppUser>(opt => // AddIdentityCore is used when we don't want to use Entity Framework.
            {
                // opt.Password.RequireNonAlphanumeric = false; // This is to allow passwords like "Pa$$w0rd".
            })
                .AddEntityFrameworkStores<AppIdentityDbContext>() // This is to tell Identity where to find the database.
                .AddSignInManager<SignInManager<AppUser>>(); // This is to tell Identity where to find the SignInManager.

            // Authentication always comes before Authorization.
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) // This is to tell the API that we are using JWT authentication.
                .AddJwtBearer(opt => // This is to tell the API how to configure JWT authentication.
                {
                    opt.TokenValidationParameters = new TokenValidationParameters // This is to tell the API what to validate.
                    {
                        ValidateIssuerSigningKey = true, // This is to tell the API to validate the signing key.
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])), // This is to tell the API what the signing key is.
                        ValidIssuer = config["Token:Issuer"], // This is to tell the API what the issuer is.
                        ValidateIssuer = true, // This is to tell the API to validate the issuer.
                        ValidateAudience = false, // This is to tell the API to not validate the audience.
                    };
                });

            // services.AddAuthorization();

            return services;
        }
    }
}