// src/api/productApi.js
export const getProducts = async (params = {}) => {
  // Mock data
  const mockProducts = Array.from({ length: 8 }, (_, index) => ({
    _id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    description: 'This is a mock product description',
    images: ['/api/placeholder/300/300'],
    category: 'Electronics',
    featured: index < 4,
    discount: index % 3 === 0 ? 10 : 0,
    createdAt: new Date().toISOString()
  }));

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter products based on params
  let filteredProducts = [...mockProducts];
  
  if (params.featured) {
    filteredProducts = filteredProducts.filter(product => product.featured);
  }
  
  if (params.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === params.category.toLowerCase()
    );
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort products
  if (params.sortBy) {
    const sortDirection = params.order === 'desc' ? -1 : 1;
    
    filteredProducts.sort((a, b) => {
      if (params.sortBy === 'price') {
        return (a.price - b.price) * sortDirection;
      } else if (params.sortBy === 'name') {
        return a.name.localeCompare(b.name) * sortDirection;
      } else if (params.sortBy === 'createdAt') {
        return (new Date(a.createdAt) - new Date(b.createdAt)) * sortDirection;
      }
      return 0;
    });
  }
  
  // Pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    pages: Math.ceil(filteredProducts.length / limit)
  };
};

export const getProductById = async (id) => {
  // Mock product data
  const product = {
    _id: id,
    name: `Product ${id}`,
    price: Math.floor(Math.random() * 100) + 10,
    description: 'This is a detailed product description with all the information a customer might need to make an informed purchase decision. It includes details about the product features, benefits, and specifications.',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    category: 'Electronics',
    featured: true,
    discount: 10,
    rating: 4.5,
    numReviews: 12,
    stockCount: 15,
    createdAt: new Date().toISOString(),
    brand: 'Brand Name',
    specifications: {
      weight: '300g',
      dimensions: '10 x 5 x 2 cm',
      color: 'Black',
      material: 'Aluminum'
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { product };
};