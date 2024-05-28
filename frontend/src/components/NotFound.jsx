import React from 'react';
import Navbar from './Navbar';

function NotFound() {
    return (
        <>
            <Navbar />

            <section style={{ padding: '40px 0', background: 'black', fontFamily: 'Arvo, serif', height: '100%', width: '100%' }}>
                <div className='container' style={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
                    <div className="row">
                        <div className="col-sm-12">
                            <div style={{ margin: '0 auto', textAlign: 'center', backgroundColor: 'black' }}>
                                <div style={{ backgroundImage: "url(https://freefrontend.com/assets/img/html-funny-404-pages/HTML-404-Error-Page.gif)", height: '400px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'black' }}>
                                    {/* <h1 style={{ fontSize: '80px', margin: '0', backgroundColor: 'black' }}>404</h1> */}
                                </div>


                                <a href="/" style={{ color: 'white', padding: '10px 20px', backgroundColor: 'black', margin: '20px 0', display: 'inline-block', textDecoration: 'none', height: '15%', width: '15%', fontSize: '2rem' }}>Go to Home</a>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>

    );
}

export default NotFound;
