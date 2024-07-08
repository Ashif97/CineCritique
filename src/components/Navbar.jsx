import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../baseurl/baseurl';

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    axios.get(`${baseurl}/api/movies/search?query=${searchQuery}`)
      .then(response => {
        setSuggestions(response.data.map(movie => ({
          id: movie._id,
          title: movie.title
        })));
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      });
  }, [searchQuery]);

  const handleLogoutClick = () => {
    navigate('/logout');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
    navigate(`/api/movies/${searchQuery}`);
  };

  const handleSuggestionClick = (movieId) => {
    setSearchQuery('');
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-6">
          <a onClick={() => navigate('/home')} className="btn btn-ghost text-xl">CineCritique</a>
          <button onClick={() => navigate('/movies')} className="btn btn-ghost">All Movies</button>
          <form onSubmit={handleSearchSubmit} className="form-control">
            <input 
              type="text" 
              placeholder="Search" 
              className="input input-bordered w-full md:w-auto" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {suggestions.length > 0 && (
              <ul className="dropdown-content absolute  bg-base-100 rounded-box shadow-lg mt-1 w-[10rem]">
                {suggestions.map((movie) => (
                  <li key={movie.id}>
                    <button
                      type="button"
                      className="btn w-full"
                      onClick={() => handleSuggestionClick(movie.id)}
                    >
                      {movie.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex cursor-pointer gap-2">
          <label className="flex cursor-pointer gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          <input type="checkbox" value="synthwave" className="toggle theme-controller"/>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </label>
          </label>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="User profile" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              {/* <li>
                <a onClick={() => navigate('/profile')} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li> */}
              <li><a onClick={handleLogoutClick}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
// return (
//   <div className="navbar bg-base-100">
//     <div className="flex justify-between w-full">
//       <div className="flex items-center gap-6">
//         <a onClick={() => navigate('/home')} className="btn btn-ghost text-xl">CineCritique</a>
//         <button onClick={() => navigate('/movies')} className="btn btn-ghost">All Movies</button>
//         <form onSubmit={handleSearchSubmit} className="form-control">
//           <input 
//             type="text" 
//             placeholder="Search" 
//             className="input input-bordered w-full md:w-auto" 
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </form>
//       </div>

//       <div className="flex items-center gap-6">
//         <label className="flex cursor-pointer gap-2">
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
//           <input type="checkbox" value="synthwave" className="toggle theme-controller"/>
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
//         </label>
//         <div className="dropdown dropdown-end">
//           <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//             <div className="w-10 rounded-full">
//               <img alt="User profile" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
//             </div>
//           </div>
//           <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//             {/* <li>
//               <a onClick={() => navigate('/profile')} className="justify-between">
//                 Profile
//                 <span className="badge">New</span>
//               </a>
//             </li> */}
//             <li><a onClick={handleLogoutClick}>Logout</a></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// }