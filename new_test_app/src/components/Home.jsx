import PrayerView from './PrayerView';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Home = () => {
  return (
    <div>
       <header class="masthead">
            <div class="container">
                {/* <div class="masthead-subheading">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div> */}
                {/* <div class="h4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div> */}
            </div>
        </header>
        <PrayerView/>
    </div>
    
  );
};

export default Home;