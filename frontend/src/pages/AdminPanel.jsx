import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import SweetForm from '../components/SweetForm';
import SweetCard from '../components/SweetCard';

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sweets');
      setSweets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (sweetData) => {
    try {
      await axios.post('/api/sweets', sweetData);
      setMessage('Sweet created successfully!');
      setShowForm(false);
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create sweet');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdate = async (id, sweetData) => {
    try {
      await axios.put(`/api/sweets/${id}`, sweetData);
      setMessage('Sweet updated successfully!');
      setEditingSweet(null);
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update sweet');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await axios.delete(`/api/sweets/${id}`);
      setMessage('Sweet deleted successfully!');
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete sweet');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      await axios.post(`/api/sweets/${id}/restock`, { quantity });
      setMessage('Sweet restocked successfully!');
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restock sweet');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Admin Panel</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingSweet(null);
              setShowForm(true);
            }}
          >
            Add New Sweet
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <SweetForm
            sweet={editingSweet}
            onSubmit={editingSweet ? (data) => handleUpdate(editingSweet.id, data) : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingSweet(null);
            }}
          />
        )}

        <div className="grid">
          {sweets.map(sweet => (
            <div key={sweet.id} className="sweet-card">
              <SweetCard sweet={sweet} />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingSweet(sweet);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(sweet.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    const quantity = prompt('Enter quantity to restock:');
                    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
                      handleRestock(sweet.id, parseInt(quantity));
                    }
                  }}
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

