import React from 'react';
import { Card, Button } from 'antd';
import { useDispatch } from 'react-redux';

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, quantity: 1 },  // Ensure quantity is always passed as part of the payload
    });
  };

  const { Meta } = Card;

  return (
    <div>
      <Card
        style={{
          width: 190,
        }}
        cover={<img alt={item.name} src={item.image} style={{ height: 200 }} />}
      >
        <Meta title={item.name} />
        <div style={{ marginTop: 10 }}>
          <p>Price: ${parseFloat(item.price).toFixed(2)}</p>  {/* Display the price here */}
        </div>
        <div className="item-button">
          <Button onClick={handleAddToCart}>Add To Cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
