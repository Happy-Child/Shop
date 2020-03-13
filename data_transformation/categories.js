export default function (categories) {
  return categories.map(category => ({
    ...category.data(),
    id: category.id
  }));
}
