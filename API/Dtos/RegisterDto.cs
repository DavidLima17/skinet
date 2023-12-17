using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress] // This is a data annotation that will check if the email is in the correct format.
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$", 
                            ErrorMessage = "Password must have 1 uppercase, 1 lowercase, 1 non alphanumeric, and at least 6 characters")] // This is a data annotation that will check if the password is in the correct format.
        public string Password { get; set; } // This is the password that the user will enter.

    }
}