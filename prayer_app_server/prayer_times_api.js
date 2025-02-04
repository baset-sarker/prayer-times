const axios = require('axios');

// Define the base URL for the prayer times endpoint.
// Adjust this URL if the API endpoint differs.
const baseUrl = 'https://www.islamicfinder.us/index.php/api/prayer_times';

// Set up query parameters as needed by the API.
const params = {
  city: 'Potsdam',
  country: 'US',
  // date: '2025-02-02',  // Use the appropriate date format as specified in the API documentation.
  zipcode: '13676'        // Example timezone offset (e.g., GMT+3 for Riyadh)
};

// Make the GET request to the API.
axios.get(baseUrl, { params })
  .then(response => {
    console.log('Prayer Times:', response.data);
  })
  .catch(error => {
    console.error('Error fetching prayer times:', error);
  });



// another implementation : 
//curl -X GET "https://api.aladhan.com/v1/timingsByCity/01-01-2025?city=London&country=GB&state=London&method=3&shafaq=general&tune=5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6&school=0&timezonestring=UTC&calendarMethod=UAQ"  -H 'accept: application/json' 
