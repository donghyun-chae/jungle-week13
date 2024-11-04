import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/meals', async (req, res) => {
  const meals = await fs.readFile('./data/available-meals.json', 'utf8');
  res.json(JSON.parse(meals));
});

// CREATE - 주문 생성
app.post('/orders', async (req, res) => {
  try {
    const orderData = req.body.order;

    if (orderData === null || orderData.items === null || orderData.items.length === 0) {
      return res
        .status(400)
        .json({ message: 'Missing data.' });
    }

    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toString(),
      createdAt: new Date().toISOString(),
    };

    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    allOrders.push(newOrder);
    await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
    res.status(201).json({ message: 'Order created!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Creating order failed.' });
  }
});

// READ - 전체 주문 조회
app.get('/orders', async (req, res) => {
  try {
    const orders = await fs.readFile('./data/orders.json', 'utf8');
    res.json(JSON.parse(orders));
  } catch (error) {
    res.status(500).json({ message: 'Loading orders failed.' });
  }
});

// READ - 특정 주문 조회
app.get('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    const order = allOrders.find(order => order.id === orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Loading order failed.' });
  }
});

// UPDATE - 주문 수정
app.put('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrderData = req.body.order;

    if (!updatedOrderData) {
      return res.status(400).json({ message: 'Missing data.' });
    }

    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    const orderIndex = allOrders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updatedOrder = {
      ...allOrders[orderIndex],
      ...updatedOrderData,
      id: orderId, // ID는 변경되지 않도록 보존
      updatedAt: new Date().toISOString(),
    };

    allOrders[orderIndex] = updatedOrder;
    await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
    res.json({ message: 'Order updated!', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Updating order failed.' });
  }
});

// DELETE - 주문 삭제
app.delete('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    const orderIndex = allOrders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    allOrders.splice(orderIndex, 1);
    await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
    res.json({ message: 'Order deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Deleting order failed.' });
  }
});

// PATCH - 주문 부분 수정
app.patch('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    const orders = await fs.readFile('./data/orders.json', 'utf8');
    const allOrders = JSON.parse(orders);
    const orderIndex = allOrders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const updatedOrder = {
      ...allOrders[orderIndex],
      ...updatedFields,
      id: orderId, // ID는 변경되지 않도록 보존
      updatedAt: new Date().toISOString(),
    };

    allOrders[orderIndex] = updatedOrder;
    await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
    res.json({ message: 'Order updated!', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Updating order failed.' });
  }
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(3000);