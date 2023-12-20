using System.Reflection;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
            
        }

        // This DbSet will be used to query the database for products
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) // This method is used to configure the database
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly()); // This will apply the configurations from the ProductConfiguration class
        
            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite") // This will check if the database provider is SQLite
            {
                foreach (var entityType in modelBuilder.Model.GetEntityTypes()) // This will loop through all the entities in the model
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal)); // This will get all the properties of type decimal
                    foreach (var property in properties) // This will loop through all the properties
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>(); // This will convert the decimal properties to double
                    }
                }
            }
        }
    }
}