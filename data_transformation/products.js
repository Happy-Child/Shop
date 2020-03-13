export default function (products) {
  return products.map(product => ({
    ...product.data(),
    id: product.id
  }));
}
