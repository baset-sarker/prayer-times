import { useState, useEffect } from "react";
import {PrayTimes} from './PrayerTime'


const PrayerTimesTable = () => {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  const [currentDay, setCurrentDay] = useState([]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const timesArray = [];

      setCurrentDay(today.toLocaleDateString());

      const long_month = today.toLocaleString('default', { month: 'long' });
      setCurrentMonth(`${long_month} ${year}`);

      var prayTimes = new PrayTimes();
      prayTimes.setMethod('ISNA');
    //   console.log(prayTimes.getTimes(new Date(), [44.6611,-74.9708], -5));
      
      var timezone = new Date().getTimezoneOffset()/-60;
      console.log("Timezone: ",timezone);
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const times = prayTimes.getTimes(date, [44.6611,-74.9708], timezone)
        timesArray.push({ date: date.toLocaleDateString(), ...times });
      }

      setPrayerTimes(timesArray);
    };

    fetchPrayerTimes();
  }, []);

  return (
    
    <section className="page-section" id="calender">
        <div className="container">
            <div className="text-center">
                    <h2 className="section-heading text-uppercase">Calendar</h2>
                    <h4 className="section-subheading text-white">{currentMonth}, Potsdam, NY</h4>
                    <br />
                </div>
            <div className="row justify-content-center">
                <div className="overflow-x-auto">
                <table className="custom-table border border-gray-300">
                        <thead>
                        <tr className="">
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Fajr</th>
                            <th className="border p-2">Sunrise</th>
                            <th className="border p-2">Dhuhr</th>
                            <th className="border p-2">Asr</th>
                            <th className="border p-2">Magrib</th>
                            <th className="border p-2">Isha</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prayerTimes.map((entry, index) => (
                            <tr key={index} 
                            className={entry.date === currentDay ? 'text-gold-large text-center' : 'text-center'}>
                            <td className="border p-2">{entry.date}</td>
                            <td className="border p-2">{entry.fajr}</td>
                            <td className="border p-2">{entry.sunrise}</td>
                            <td className="border p-2">{entry.dhuhr}</td>
                            <td className="border p-2">{entry.asr}</td>
                            <td className="border p-2">{entry.maghrib}</td>
                            <td className="border p-2">{entry.isha}</td>
                            </tr>
                        ))}
                        </tbody>
                        
                    </table>
                    
                </div>
                <p className='text-white text-center text-justify'> *Calendar calculations are taken from  <a href='https://praytimes.org/'>PrayerTimes.org</a>, 
                                                                           method: ISNA - Islamic Society of North America, juristic: Standard (Shafi, Hanbli, Maliki), Place: Potsdam, NY, USA.
                                                                           
                                          </p>
            </div>
        </div>

        </section>

  );
};

export default PrayerTimesTable;
