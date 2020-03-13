export default function (orders) {
  return orders.map(order => ({
    ...order.data(),
    id: order.id
  }));
}
