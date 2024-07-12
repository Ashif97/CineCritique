import React, { useState, useEffect } from 'react';
import AllMovies from '../Movies/AllMovies';
import MovieList from '../../components/movielist';
import Navbar from '../../components/Navbar';
import AdminDashboard from '../../components/AdminDashboard';
import axios from 'axios';
import { baseurl } from '../../baseurl/baseurl';



const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [image, setImage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [castMembers, setCastMembers] = useState([{ name: '', role: '' }]);

  const genres = ['Action', 'Comedy', 'Adventure', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller'];
  const roles = ['Actor', 'Director', 'Producer', 'Camera', 'Writer', 'Editor'];

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleCastChange = (index, field, value) => {
    const newCastMembers = [...castMembers];
    newCastMembers[index][field] = value;
    setCastMembers(newCastMembers);
  };

  const addCastMember = () => {
    setCastMembers([...castMembers, { name: '', role: '' }]);
  };

  const removeCastMember = (index) => {
    const newCastMembers = castMembers.filter((_, i) => i !== index);
    setCastMembers(newCastMembers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const movieData = {
      title,
      description,
      releaseDate,  
      image,
      genres: [selectedGenre],
      topCast: castMembers.map(member => `${member.name} (${member.role})`),
    };

    axios.post(`${baseurl}/api/movies`, movieData, { withCredentials: true })
      .then(response => {
        console.log('Success:', response.data);
        // Clear the form
        setTitle('');
        setDescription('');
        setReleaseDate('');
        setImage('');
        setSelectedGenre('');
        setCastMembers([{ name: '', role: '' }]);
        // Reload the page
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <Navbar />
      <AdminDashboard />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Add Movies </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">Release Date</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold">Genre</label>
            <select value={selectedGenre} onChange={handleGenreChange} className="border rounded p-2 w-full" required>
              <option value="">Select Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-semibold">Cast</label>
            {castMembers.map((castMember, index) => (
              <div key={index} className="flex space-x-4 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={castMember.name}
                  onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                  className="border rounded p-2 w-full"
                  required
                />
                <select
                  value={castMember.role}
                  onChange={(e) => handleCastChange(index, 'role', e.target.value)}
                  className="border rounded p-2 w-full"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => removeCastMember(index)} className="bg-red-500 text-white p-2 rounded">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addCastMember} className="bg-green-500 text-white p-2 rounded">
              Add Cast Member
            </button>
          </div>
          <div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Add Movie
            </button>
          </div>
        </form>
      </div>
      <MovieList isAdmin={true} />
    </div>
  );
};

export default AdminPage;