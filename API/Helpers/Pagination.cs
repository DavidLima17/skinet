using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class Pagination<T> where T : class
    {

        public int PageIndex { get; set; } // current page
        public int PageSize { get; set; } // number of items per page
        public int Count { get; set; } // total number of items
        public IReadOnlyList<T> Data { get; set; } // data to be returned
    
        public Pagination(int pageIndex, int pageSize, int count, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex; // current page
            PageSize = pageSize; // number of items per page
            Count = count; // total number of items
            Data = data; // data to be returned
        }
    }
}