using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; } // order id
        public string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; } // default value
        public Address ShipToAddress { get; set; }
        public string DeliveryMethod { get; set; }
        public decimal ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; } // read only list
        public decimal Subtotal { get; set; }
        public string Status { get; set; }// default value
        public decimal Total { get; set; }
    }
}