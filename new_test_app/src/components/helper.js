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
  
  function getUpdatedTime(timeString, change) {
    change = parseInt(change) || 0;
    
    let [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    // Convert to 24-hour format for easier calculations
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    // Adjust time
    let totalMinutes = hours * 60 + minutes + change;
    totalMinutes = (totalMinutes + 1440) % 1440; // Handle negative values and wrap around
    
    // Convert back to hours and minutes
    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;
    
    // Convert back to 12-hour format
    period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 -> 12 for AM
    
    // Format output
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  }
  
  
  function getIqaamahTime(prayerTimeApi, prayerTime, add_or_sub = 0) {
      let add_or_sub_int = parseInt(add_or_sub) || 0;
      // prayer time contains @ symbol remove @ symbol and return 
      if (prayerTime.includes('@')) {
        return prayerTime.replace('@', '');
      }
  
      if (add_or_sub_int !== -1) {
        return getUpdatedTime(prayerTimeApi, add_or_sub_int);
      }
  
      let apiTimeInMinutes = timeToMinutes(prayerTimeApi);
      let timeInMinutes = timeToMinutes(prayerTime);
  
      if (timeInMinutes === null) {
        return prayerTimeApi;
      }
      if (apiTimeInMinutes >= timeInMinutes) {
        return prayerTimeApi;
      }else {
        return prayerTime;
      }
  }

  // api time is isha iqama time , prayerTime is tarawih time
function getTarawihTime(isha_iqama, tarawihTime, add_or_sub = 0) {
    
  let apiTimeInMinutes = timeToMinutes(isha_iqama);
  let timeInMinutes = timeToMinutes(tarawihTime);

  if (timeInMinutes === null) {
      return isha_iqama;
  }
  if (apiTimeInMinutes >= timeInMinutes) {
      return isha_iqama;
  }else {
      return tarawihTime;
  }
}

  function updateIqamaTimeForFirstTim(prayer){
    let updatedTime = '';
    if(prayer.fajr_added_time !== -1){
      updatedTime = getUpdatedTime(prayer.fajr_api, prayer.fajr_added_time);
      prayer.fajr = updatedTime;
    }
    
    if(prayer.duhr_added_time !== -1){
      updatedTime = getUpdatedTime(prayer.duhr_api, prayer.duhr_added_time);
      prayer.duhr = updatedTime;
    }
  
    if(prayer.asr_added_time !== -1){
      updatedTime = getUpdatedTime(prayer.asr_api, prayer.asr_added_time);
      prayer.asr = updatedTime;
    }
  
    if(prayer.magrib_added_time !== -1){
      updatedTime = getUpdatedTime(prayer.magrib_api, prayer.magrib_added_time);
      prayer.magrib = updatedTime;
    }
  
    if(prayer.isha_added_time !== -1){
      updatedTime = getUpdatedTime(prayer.isha_api, prayer.isha_added_time);
      prayer.isha = updatedTime;
    }
  
    return prayer;
  
  }


  export { timeToMinutes, getUpdatedTime, getIqaamahTime, updateIqamaTimeForFirstTim, getTarawihTime };
  