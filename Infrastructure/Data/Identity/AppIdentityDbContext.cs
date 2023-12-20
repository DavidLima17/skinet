using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser> // This is the class that will be used to create the database.
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder) // This method is used to configure the relationship between the AppUser and Address entities.
        {
            base.OnModelCreating(builder);
            // builder.Entity<AppUser>()
            //     .HasOne(u => u.Address)
            //     .WithOne(a => a.AppUser)
            //     .HasForeignKey<Address>(a => a.AppUserId); // This is the foreign key that will be used to join the two tables.
        }
    }
}