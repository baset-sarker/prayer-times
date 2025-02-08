import React from 'react';
import PrayerView from './PrayerView';
import Contact  from './Contact';

const Home = () => {
  return (
    <div>
       <header class="masthead">
            <div class="container">
                <div class="masthead-subheading">Welcome To Potsdam Masjid!</div>
                <div class="h4"></div>
            </div>
        </header>
        <PrayerView />
        {/* <Contact /> */}
    </div>
    
  );
};

export default Home;