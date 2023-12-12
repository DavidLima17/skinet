using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IBasketRepository
    {
        Task<CustomerBasket> GetBasketAsync(string basketId); // Get basket by id
        Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket); // Update basket
        Task<bool> DeleteBasketAsync(string basketId); // Delete basket
    }
}