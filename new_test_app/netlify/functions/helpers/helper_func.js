
function convert24to12(time24) {
    const [hours, minutes] = time24.split(':');
    let hours12 = hours % 12 || 12; // Handle midnight (00:00)
    const ampm = hours < 12 || hours === 24 ? 'AM' : 'PM'; // Determine AM/PM
    hours12 = hours12 % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  }

  function timeToMinutes(time) {
    try {
      const [timePart, period] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
  
      if (period === "PM" && hours !== 12) hours += 12; // Convert PM hours to 24-hour format
      if (period === "AM" && hours === 12) hours = 0;   // Convert 12 AM to 0
  
      return hours * 60 + minutes; // Return total minutes since midnight
    } catch (error) {
      console.error("Error converting time to minutes:", error);
      return null;
    }
    
}
   
  
  function getCurrentDateFormatted() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Pad with leading zero if needed
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = now.getFullYear();
  
    return `${day}-${month}-${year}`;
  }
  
  const fetchData = async () => {
    const lat = '44.676048';
    const lon = '-74.992142';
    const dt = getCurrentDateFormatted();
  
    const api_url = `https://api.aladhan.com/v1/timings/${dt}?latitude=${lat}&longitude=${lon}&method=2&shafaq=general&timezonestring=America%2FNew_York&calendarMethod=UAQ`;
  
    console.log(api_url);
  
    try {
        const response = await fetch(api_url, {
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
  };



  function getCurrentDateFormatted_YYYY_mm_dd() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit format
    const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit format

    return `${year}-${month}-${day}`;
  }

  const fetchIslamicFinderData = async () => {
    const baseUrl = 'https://www.islamicfinder.us/index.php/api/prayer_times';

    const dt = getCurrentDateFormatted_YYYY_mm_dd();

    const params = new URLSearchParams({
        city: 'Potsdam',
        country: 'US',
        date: dt,  // Use the appropriate date format as specified in the API documentation.
        zipcode: '13676',    
        method: '2',  
        time_format: '0',        // Calculation method (e.g., 2 for Umm al-Qura)
      }).toString();
      
      // Make the GET request to the API using Fetch.
      const url = `${baseUrl}?${params.toString()}`; // Use toString()
      
      try {
        const response = await fetch(url,  { headers: { 'Accept': 'application/json'}});
  
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


  export {convert24to12,
          getCurrentDateFormatted,
          fetchIslamicFinderData,
          timeToMinutes,
          fetchData}