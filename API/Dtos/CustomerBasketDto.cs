using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class CustomerBasketDto
    {
        [Required]
        public string Id { get; set; } // The basket id.
        public List<BasketItemDto> Items { get; set; } // The basket items.
        public int? DeliveryMethodId { get; set; } // The delivery method id.
        public string ClientSecret { get; set; } // The client secret.
        public string PaymentIntentId { get; set; } // The payment intent id.
        public decimal ShippingPrice { get; set; } // The shipping price.
        
    }
}