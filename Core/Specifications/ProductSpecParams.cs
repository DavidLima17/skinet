using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1; // default value
        private int _pageSize = 6; // default value
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // if value > MaxPageSize, then _pageSize = MaxPageSize, else _pageSize = value
        }
        public int? BrandId { get; set; } // ? means nullable
        public int? TypeId { get; set; } // ? means nullable
        public string Sort { get; set; }
        private string _search; // default value
        public string Search
        {
            get => _search;
            set => _search = value.ToLower(); // if value is null, then _search = null, else _search = value.ToLower()
        }

    }
}