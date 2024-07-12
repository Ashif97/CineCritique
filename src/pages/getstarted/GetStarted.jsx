import React from 'react';
import bgImage from '../../assets/getstarted.jpg';
import { useNavigate } from 'react-router-dom';

export default function GetStarted() {
    const navigate = useNavigate();
  return (
    <div>
      {/* Navigation Bar */}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">CineCritique</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a onClick={() => navigate('/signin')} className="cursor-pointer">Sign in</a></li>
            <li><label className="flex cursor-pointer gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
  <input type="checkbox" value="sunset" className="toggle theme-controller"/>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
</label></li>
            {/* <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li><a>Link 1</a></li>
                  <li><a>Link 2</a></li>
                </ul>
              </details>
            </li> */}
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-screen" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-base-content-">
          <div className="max-w-md mx-auto">
            <h1 className="mb-5 text-5xl font-bold">CineCritique</h1>
            <p className="mb-6 text-2xl font-bold">At Cine Critique, we're passionate about movies and believe in the power of community-driven insights. Whether you're a seasoned cinephile or just getting started, our platform offers everything you need to explore, rate, and discuss your favorite films.</p>
            <p>Join us by clicking get started</p>
            <br />
            <button onClick={() => navigate('/signup')} className="btn btn-primary cursor-pointer" >Get Started</button>
            <br />
            <br />
            {/* <button onClick={() => navigate('/home')} className= "cursor-pointer" className="btn btn-neutral ">Explore movies</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
