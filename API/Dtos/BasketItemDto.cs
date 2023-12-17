using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class BasketItemDto
    {
        [Required]
        public int Id { get; set; } // The basket item id.
        [Required]
        public string ProductName { get; set; } // The basket item product name.
        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; } // The basket item price.
        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; } // The basket item quantity.
        [Required]
        public string PictureUrl { get; set; } // The basket item picture url.
        [Required]
        public string Brand { get; set; } // The basket item brand.
        [Required]
        public string Type { get; set; } // The basket item type.

    }
}