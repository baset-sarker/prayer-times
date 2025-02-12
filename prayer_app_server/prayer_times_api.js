// const axios = require('axios');

// Define the base URL for the prayer times endpoint.
// Adjust this URL if the API endpoint differs.
const baseUrl = 'https://www.islamicfinder.us/index.php/api/prayer_times';

// Set up query parameters as needed by the API.
// const params = {
//   city: 'Potsdam',
//   country: 'US',
//   date: '2025-02-11',  // Use the appropriate date format as specified in the API documentation.
//   zipcode: '13676',        // Example timezone offset (e.g., GMT+3 for Riyadh)
//   method: '2'           // Calculation method (e.g., 2 for Umm al-Qura)
// };

// Make the GET request to the API.
// axios.get(baseUrl, { params })
//   .then(response => {
//     console.log('Prayer Times:', response.data);
//   })
//   .catch(error => {
//     console.error('Error fetching prayer times:', error);
//   });



// another implementation : 
//curl -X GET "https://api.aladhan.com/v1/timingsByCity/01-01-2025?city=London&country=GB&state=London&method=3&shafaq=general&tune=5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6&school=0&timezonestring=UTC&calendarMethod=UAQ"  -H 'accept: application/json' 


const fetchData = async () => {
  // Define the base URL for the prayer times endpoint.
  const params = new URLSearchParams({
    city: 'Potsdam',
    country: 'US',
    date: '2025-02-11',  // Use the appropriate date format as specified in the API documentation.
    zipcode: '13676',    
    method: '2', 
    time_format: '0' // 24 hrs format
            // Calculation method (e.g., 2 for Umm al-Qura)
  }).toString();

  // Make the GET request to the API using Fetch.
  const url = `${baseUrl}?${params.toString()}`; // Use toString()

  // fetch(url)
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
  //     }
  //     return response.json(); // Parse the JSON response
  //   })
  //   .then(data => {
  //     console.log('Prayer Times:', data);
  //   })
  //   .catch(error => {
  //     console.error('Error fetching prayer times:', error);
  //   });

  try {
      const response = await fetch(url, {
          headers: {
              'Accept': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;

  } catch (error) {
      console.error('Error fetching data:', error.message);
  }

}

const data = await fetchData();
console.log(data.results.Fajr);