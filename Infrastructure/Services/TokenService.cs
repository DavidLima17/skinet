using System.Text;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Infrastructure.Services
{
    public class TokenService : ITokenService // This is the service that will create the token.
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
        }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim> // Create a list of claims.
            {
                new Claim(ClaimTypes.Email, user.Email), // Add the email claim.
                new Claim(ClaimTypes.GivenName, user.DisplayName) // Add the display name claim.
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature); // Create the credentials.

            var tokenDescriptor = new SecurityTokenDescriptor // Create the token descriptor.
            {
                Subject = new ClaimsIdentity(claims), // Add the claims.
                Expires = DateTime.Now.AddDays(7), // Set the expiration date.
                SigningCredentials = creds, // Add the credentials.
                Issuer = _config["Token:Issuer"], // Add the issuer.
            };

            var tokenHandler = new JwtSecurityTokenHandler(); // Create the token handler.
            var token = tokenHandler.CreateToken(tokenDescriptor); // Create the token.

            return tokenHandler.WriteToken(token); // Return the token.
        }
    }
}