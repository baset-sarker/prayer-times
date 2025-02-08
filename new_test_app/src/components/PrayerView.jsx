import React from 'react';

const PrayerView = () => {
  return (
    <div>
        <section class="py-4">
            <div className="container">
                <div className="align-items-center">
                    <div className="row">
                    <h1 style={{ textAlign: 'center' }}>Prayer Time</h1>
                    </div>
                    <div className='row'>
                        <div className="col-lg-6 my-3 my-lg-0" >
                            <h2 style={{ textAlign: 'center' }}>Potsdam (Gathering Time)</h2>
                            <ul class="list-group">
                                <li class="list-group-item">Cras justo odio</li>
                                <li class="list-group-item">Dapibus ac facilisis in</li>
                                <li class="list-group-item">Morbi leo risus</li>
                                <li class="list-group-item">Porta ac consectetur ac</li>
                                <li class="list-group-item">Vestibulum at eros</li>
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            <h2 style={{ textAlign: 'center' }}>Prayer Time</h2>
                            <ul className="list-group">
                                <li class="list-group-item">Cras justo odio</li>
                                <li class="list-group-item">Dapibus ac facilisis in</li>
                                <li class="list-group-item">Morbi leo risus</li>
                                <li class="list-group-item">Porta ac consectetur ac</li>
                                <li class="list-group-item">Vestibulum at eros</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};

export default PrayerView;