import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import SweetCard from '../components/SweetCard';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sweets');
      setSweets(response.data);
      setFilteredSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id, quantity) => {
    try {
      const response = await axios.post(`/api/sweets/${id}/purchase`, { quantity: 1 });
      setMessage('Purchase successful!');
      setTimeout(() => setMessage(''), 3000);
      fetchSweets();
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSearch = (filters) => {
    let filtered = [...sweets];

    if (filters.name) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(sweet =>
        sweet.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(sweet => sweet.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(sweet => sweet.price <= parseFloat(filters.maxPrice));
    }

    setFilteredSweets(filtered);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Sweet Shop Dashboard</h1>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <SearchBar onSearch={handleSearch} sweets={sweets} />
        
        {filteredSweets.length === 0 ? (
          <p>No sweets found. Try adjusting your search filters.</p>
        ) : (
          <div className="grid">
            {filteredSweets.map(sweet => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

