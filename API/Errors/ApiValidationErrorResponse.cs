namespace API.Errors
{
    /// <summary>
    /// Represents an API validation error response.
    /// </summary>
    public class ApiValidationErrorResponse : ApiResponse
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ApiValidationErrorResponse"/> class with a status code of 400.
        /// </summary>
        public ApiValidationErrorResponse() : base(400)
        {
        }

        /// <summary>
        /// Gets or sets the collection of error messages.
        /// </summary>
        public IEnumerable<string> Errors { get; set; }
    }
}