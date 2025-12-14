import React from 'react';
import { useAuth } from '../context/AuthContext';

const SweetCard = ({ sweet, onPurchase }) => {
  const { isAdmin } = useAuth();
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="sweet-card">
      <h3>{sweet.name}</h3>
      <div className="category">{sweet.category}</div>
      <div className="price">${sweet.price.toFixed(2)}</div>
      <div className={`quantity ${isOutOfStock ? 'out-of-stock' : ''}`}>
        {isOutOfStock ? 'Out of Stock' : `In Stock: ${sweet.quantity}`}
      </div>
      {onPurchase && !isAdmin && (
        <button
          className="btn btn-primary"
          onClick={() => onPurchase(sweet._id, 1)}
          disabled={isOutOfStock}
          style={{ width: '100%' }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>
      )}
    </div>
  );
};

export default SweetCard;

