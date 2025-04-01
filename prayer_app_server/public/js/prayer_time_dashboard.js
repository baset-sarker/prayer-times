const dataFetchInterval = 10000; // 10 seconds
const hadisShowInterval = 10000; // 10 seconds

let hadisArray = [];
let current_hadis = 0; // Track the current index
let current_datetime = null;


// ############ Helpers Start
// Function to convert "hh:mm AM/PM" to minutes since midnight
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





// Function to determine the active prayer
function highlightActivePrayer(prayerTimes) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let activePrayer = null;
    
    try {

        // Convert API prayer times to minutes
        const fajrTime = timeToMinutes(prayerTimes.fajr_api);
        const sunriseTime = timeToMinutes(prayerTimes.sunrise);
        const duhrTime = timeToMinutes(prayerTimes.dhuhr_api);
        const asrTime = timeToMinutes(prayerTimes.asr_api);
        const magribTime = timeToMinutes(prayerTimes.magrib_api);
        const ishaTime = timeToMinutes(prayerTimes.isha_api);

        // Determine active prayer
        if (currentTime >= fajrTime && currentTime < sunriseTime) {
            activePrayer = "fajr_card";
        } else if (currentTime >= duhrTime && currentTime < asrTime) {
            activePrayer = "dhuhr_card";
        } else if (currentTime >= asrTime && currentTime < magribTime) {
            activePrayer = "asr_card";
        } else if (currentTime >= magribTime && currentTime < ishaTime) {
            activePrayer = "magrib_card";
        } else if (currentTime >= ishaTime || currentTime < fajrTime) {
            activePrayer = "isha_card"; // Keep Esha active until Fajr
        }

        // Remove previous active class
        document.querySelectorAll(".golden-card").forEach(div => div.classList.remove("golden-card-active"));

        // Add active class to the current prayer
        if (activePrayer) {
            document.getElementById(activePrayer).classList.add("golden-card-active");
        }
    } catch (error) {
        console.error('Error highlighting active prayer:', error);
    }
}

// ############ Helpers end 
// ############ Helper end 


function getNextHadis() {

    try {
        const hadis = hadisArray[current_hadis]; // Get the current hadis
        current_hadis = (current_hadis + 1) % hadisArray.length; // Move to the next index (circular)
        return hadis;
    } catch (error) {
        console.error('Error fetching or parsing hadis:', error);
        return '';
    }

}

async function updatePrayerTimes() {
    try {
        const response = await fetch('/prayer-times');
        const data = await response.json();

        if(data){
            // set current datetime
            current_datetime = data.current_datetime
        }

        if (data.prayers) {
        
            if(data.prayers.fajr_api){
                const element_fajr_api = document.getElementById('fajr_api');
                element_fajr_api.innerHTML = 'Fajr '+data.prayers.fajr_api
            } 

            if(data.prayers.fajr){
                const fajr = getIqaamahTime(data.prayers.fajr_api, data.prayers.fajr, data.prayers.fajr_added_time);
                const element_fajr = document.getElementById('fajr');
                element_fajr.innerHTML = 'Iqama '+fajr
            }

            if(data.prayers.sunrise){
                const element_sunrise = document.getElementById('sunrise');
                element_sunrise.innerHTML = 'Sunrise '+data.prayers.sunrise
            }

            if(data.prayers.dhuhr_api){
                const element_dhuhr_api = document.getElementById('dhuhr_api');
                element_dhuhr_api.innerHTML = 'Dhuhr '+data.prayers.dhuhr_api
            }

            if(data.prayers.dhuhr){
                const dhuhr = getIqaamahTime(data.prayers.dhuhr_api, data.prayers.dhuhr, data.prayers.dhuhr_added_time);
                const element_dhuhr = document.getElementById('dhuhr');
                element_dhuhr.innerHTML = 'Iqama '+dhuhr
            }

            if(data.prayers.jummah){
                const element_jummah = document.getElementById('jummah');
                element_jummah.innerHTML = 'Jummah '+data.prayers.jummah
            }

            if(data.prayers.asr_api){
                const element_asr_api = document.getElementById('asr_api');
                element_asr_api.innerHTML = 'Asr '+data.prayers.asr_api
            }


            if(data.prayers.asr){
                const asr = getIqaamahTime(data.prayers.asr_api, data.prayers.asr,data.prayers.asr_added_time);
                const element_asr = document.getElementById('asr');
                element_asr.innerHTML = 'Iqama '+asr
            }

            if(data.prayers.magrib_api){
                const element_magrib_api = document.getElementById('magrib_api');
                element_magrib_api.innerHTML = 'Magrib '+data.prayers.magrib_api
            }

            if(data.prayers.magrib){
                const magrib = getIqaamahTime(data.prayers.magrib_api, data.prayers.magrib,data.prayers.magrib_added_time);
                const element_magrib = document.getElementById('magrib');
                element_magrib.innerHTML = 'Iqama '+magrib
            }

            if(data.prayers.isha_api){
                const element_isha_api = document.getElementById('isha_api');
                element_isha_api.innerHTML = 'Isha '+data.prayers.isha_api
            }

            let isha = null;  // isha iqama
            if(data.prayers.isha){
                isha = getIqaamahTime(data.prayers.isha_api, data.prayers.isha,data.prayers.isha_added_time);
                const element_isha = document.getElementById('isha');
                element_isha.innerHTML = 'Iqama '+isha
            }
            if(data.prayers.tarawih && data.prayers.tarawih !== ""){
                // if tarawi is not empty, and not less than isha api time then show tarawih
                // if greater than isha api time than show as it is
                const tarawih = getTarawihTime(isha, data.prayers.tarawih);
                const element_tarawih = document.getElementById('tarawih');
                element_tarawih.innerHTML = 'Taraweeh '+tarawih
            }
            
        }

        if (data.ssid) {
            document.getElementById('wifi').textContent = data.ssid;
        }


        // Update noticeprayerTimes
        if (data.notice) {
            if (data.notice.head_line != '') {
                document.getElementById('head_line').textContent = data.notice.head_line || '';
                document.getElementById('first_line').textContent = data.notice.first_line || '';
                document.getElementById('second_line').textContent = data.notice.second_line || '';
            }else {
                document.getElementById('head_line').textContent = data.notice_default.head_line || '';
                document.getElementById('first_line').textContent = data.notice_default.first_line || '';
                document.getElementById('second_line').textContent = data.notice_default.second_line || '';
            }
            
        }

        if (data.hadis) {
            hadisArray = []
            hadisArray.push(data.hadis.hadis1)
            hadisArray.push(data.hadis.hadis2)
            hadisArray.push(data.hadis.hadis3)
            hadisArray.push(data.hadis.hadis4)
            hadisArray.push(data.hadis.hadis5)
            if (current_hadis == 0) {
                document.getElementById('hadis_today_text').textContent = getNextHadis();
            }   
        }


        // highlight active prayer
        // if (data.prayers) {
        //     highlightActivePrayer(data.prayers);
        // }
    } catch (error) {
        console.error('Error fetching or parsing prayer times:', error);
    }
}



let isDiv1Visible = true; // Track which div is visible
document.getElementById("div2").style.display = "none";

function toggleDivs() {
    if (window.innerWidth <= 768) {
        // Mobile view: Always show div1
        document.getElementById("div1").style.display = "block";
        document.getElementById("div1").style.opacity = "1";
        document.getElementById("div2").style.display = "none";
        // clearInterval(interval); // Stop interval if it's running
        return true;
    }
    
    if (isDiv1Visible) {
        // Fade out div1 and fade in div2
        document.getElementById("div1").style.opacity = "0";
        // setTimeout(() => {
            document.getElementById("div1").style.display = "none";
            
            // set class to div2
            document.getElementById("div2").className = "d-flex justify-content-center align-items-center";

            document.getElementById("div2").style.display = "block";
            document.getElementById("div2").style.opacity = "1";
        // }, 2000); // Matches transition duration
    } else {
        // Fade out div2 and fade in div1
        document.getElementById("div2").style.opacity = "0";
        // setTimeout(() => {
            document.getElementById('hadis_today_text').textContent = getNextHadis();
            document.getElementById("div2").style.display = "none";
            document.getElementById("div2").className = "";
            document.getElementById("div1").style.display = "block";
            document.getElementById("div1").style.opacity = "1";
        // }, 2000);
    }

    isDiv1Visible = !isDiv1Visible; // Toggle state
}


// function getCurrentDateTime() {
//     const now = new Date();
//     const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//     const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
//     return `${date} ${time}`;
// }

function increase_one_second(){
    const now = new Date(current_datetime);
    now.setSeconds(now.getSeconds() + 1);
    const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    current_datetime = `${date} ${time}`;
}

function setCurrentDateTime() {
    const wifi = document.getElementById('wifi');
    const wifi_content = wifi.textContent;  

    // increase_one_second();
    
    if (wifi_content.includes('Connected')) {
        wifi.textContent = `Connected`;
    }

    if (wifi_content.includes('Scanning')) {
        wifi.textContent = `Scanning...`;
    }
}



// Initial fetch
updatePrayerTimes();

// Use the timerAPI to setInterval
// if (window.timerAPI && typeof window.timerAPI.setInterval === 'function') {
//     window.timerAPI.setInterval(updatePrayerTimes, dataFetchInterval);
//     window.timerAPI.setInterval(toggleDivs, hadisShowInterval);
// } else {
//     console.error('timerAPI is not available. Falling back to standard setInterval.');
//     setInterval(updatePrayerTimes, dataFetchInterval);
//     setInterval(toggleDivs, hadisShowInterval);
// }

setInterval(updatePrayerTimes, dataFetchInterval);
setInterval(toggleDivs, hadisShowInterval);
