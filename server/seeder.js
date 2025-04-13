const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    addresses: [
      {
        fullName: 'Admin User',
        address: '123 Admin St',
        city: 'Admin City',
        postalCode: '12345',
        country: 'US',
        phone: '123-456-7890',
        isDefault: true
      }
    ]
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    addresses: [
      {
        fullName: 'John Doe',
        address: '123 Main St',
        city: 'Boston',
        postalCode: '02108',
        country: 'US',
        phone: '555-555-5555',
        isDefault: true
      }
    ]
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    addresses: [
      {
        fullName: 'Jane Smith',
        address: '456 Park Ave',
        city: 'New York',
        postalCode: '10001',
        country: 'US',
        phone: '555-123-4567',
        isDefault: true
      }
    ]
  }
];

// Sample Categories
const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    image: '/uploads/category-electronics.jpg'
  },
  {
    name: 'Clothing',
    description: 'Men\'s and women\'s clothing',
    image: '/uploads/category-clothing.jpg'
  },
  {
    name: 'Home & Kitchen',
    description: 'Home decor and kitchen accessories',
    image: '/uploads/category-home.jpg'
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Beauty products and personal care items',
    image: '/uploads/category-beauty.jpg'
  },
  {
    name: 'Books',
    description: 'Books in all genres',
    image: '/uploads/category-books.jpg'
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    image: '/uploads/category-sports.jpg'
  },
  {
    name: 'Toys & Games',
    description: 'Toys and games for all ages',
    image: '/uploads/category-toys.jpg'
  }
];

// Sample Products
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and up to 20 hours of battery life. Perfect for music lovers and travelers.',
    price: 149.99,
    discount: 10,
    countInStock: 15,
    brand: 'SoundMaster',
    category: 'Electronics',
    features: [
      'Active Noise Cancellation',
      '20 hours battery life',
      'Bluetooth 5.0',
      'Built-in microphone',
      'Comfortable ear cushions'
    ],
    images: [
      '/uploads/headphones-1.jpg',
      '/uploads/headphones-2.jpg',
      '/uploads/headphones-3.jpg'
    ],
    rating: 4.5,
    numReviews: 12,
    featured: true,
    sku: 'SM-WH-001',
    reviews: []
  },
  {
    name: 'Smartphone X Pro',
    description: 'Latest smartphone with 6.5-inch OLED display, triple camera system, and 256GB storage. Experience lightning-fast performance with the new A15 processor.',
    price: 999.99,
    discount: 0,
    countInStock: 7,
    brand: 'TechGiant',
    category: 'Electronics',
    features: [
      '6.5-inch OLED display',
      'Triple camera system',
      '256GB storage',
      'A15 processor',
      'All-day battery life'
    ],
    images: [
      '/uploads/smartphone-1.jpg',
      '/uploads/smartphone-2.jpg'
    ],
    rating: 4.8,
    numReviews: 24,
    featured: true,
    sku: 'TG-SP-002',
    reviews: []
  },
  {
    name: 'Slim Fit Men\'s Dress Shirt',
    description: 'Classic slim fit dress shirt made from 100% cotton. Perfect for formal occasions or office wear. Available in various colors and sizes.',
    price: 49.99,
    discount: 20,
    countInStock: 25,
    brand: 'FashionElite',
    category: 'Clothing',
    features: [
      '100% cotton material',
      'Slim fit design',
      'Button-down collar',
      'Machine washable',
      'Available in multiple colors'
    ],
    images: [
      '/uploads/shirt-1.jpg',
      '/uploads/shirt-2.jpg'
    ],
    rating: 4.2,
    numReviews: 18,
    featured: false,
    sku: 'FE-DS-003',
    reviews: []
  },
  {
    name: 'Professional Chef Knife Set',
    description: 'Premium 8-piece knife set made from high-carbon stainless steel. Includes chef\'s knife, bread knife, utility knife, and more. Perfect for professional chefs and home cooking enthusiasts.',
    price: 129.99,
    discount: 15,
    countInStock: 10,
    brand: 'CulinaryPro',
    category: 'Home & Kitchen',
    features: [
      'High-carbon stainless steel',
      '8-piece set',
      'Ergonomic handles',
      'Includes knife block',
      'Dishwasher safe'
    ],
    images: [
      '/uploads/knives-1.jpg',
      '/uploads/knives-2.jpg'
    ],
    rating: 4.7,
    numReviews: 15,
    featured: true,
    sku: 'CP-KS-004',
    reviews: []
  },
  {
    name: 'Organic Face Serum',
    description: 'Rejuvenating face serum made with organic ingredients. Helps reduce fine lines, hydrate skin, and improve complexion. Suitable for all skin types.',
    price: 39.99,
    discount: 0,
    countInStock: 20,
    brand: 'NaturalGlow',
    category: 'Beauty & Personal Care',
    features: [
      'Organic ingredients',
      'Anti-aging formula',
      'Hydrating',
      'Suitable for all skin types',
      'No parabens or sulfates'
    ],
    images: [
      '/uploads/serum-1.jpg',
      '/uploads/serum-2.jpg'
    ],
    rating: 4.4,
    numReviews: 22,
    featured: false,
    sku: 'NG-FS-005',
    reviews: []
  },
  {
    name: 'Bestselling Fiction Novel',
    description: 'The latest bestselling novel from acclaimed author J.R. Wordsmith. A thrilling story of adventure, mystery, and romance that keeps readers on the edge of their seats.',
    price: 24.99,
    discount: 5,
    countInStock: 35,
    brand: 'PageTurner Publishing',
    category: 'Books',
    features: [
      'Hardcover edition',
      '400 pages',
      'Award-winning author',
      'Includes bonus chapter',
      'Signed by author (limited copies)'
    ],
    images: [
      '/uploads/book-1.jpg',
      '/uploads/book-2.jpg'
    ],
    rating: 4.9,
    numReviews: 30,
    featured: true,
    sku: 'PT-BK-006',
    reviews: []
  },
  {
    name: 'Professional Yoga Mat',
    description: 'High-quality yoga mat made from eco-friendly materials. Non-slip surface provides excellent grip during practice. Perfect for yoga, pilates, and other floor exercises.',
    price: 59.99,
    discount: 10,
    countInStock: 15,
    brand: 'YogaFlex',
    category: 'Sports & Outdoors',
    features: [
      'Eco-friendly materials',
      'Non-slip surface',
      '6mm thickness',
      'Lightweight and portable',
      'Includes carrying strap'
    ],
    images: [
      '/uploads/yoga-1.jpg',
      '/uploads/yoga-2.jpg'
    ],
    rating: 4.6,
    numReviews: 25,
    featured: false,
    sku: 'YF-YM-007',
    reviews: []
  },
  {
    name: 'Interactive Board Game',
    description: 'Fun and engaging board game for the whole family. Suitable for 2-6 players and ages 8+. Combines strategy, luck, and creativity for hours of entertainment.',
    price: 34.99,
    discount: 0,
    countInStock: 12,
    brand: 'GameMaster',
    category: 'Toys & Games',
    features: [
      'For 2-6 players',
      'Ages 8+',
      'Average playtime: 45 minutes',
      'Includes game board, cards, and pieces',
      'Award-winning design'
    ],
    images: [
      '/uploads/game-1.jpg',
      '/uploads/game-2.jpg'
    ],
    rating: 4.3,
    numReviews: 20,
    featured: false,
    sku: 'GM-BG-008',
    reviews: []
  }
];

// Import Data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Category.deleteMany();

    // Insert new data
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Add user reference to products
    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser };
    });

    // Insert categories
    await Category.insertMany(categories);

    // Insert products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy Data
const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Category.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Use command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}