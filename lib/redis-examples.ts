import {
  redisGet,
  redisSet,
  redisDel,
  redisExists,
  redisExpire,
  redisIncr,
  redisDecr,
  redisPush,
  redisGetList,
} from '@/lib/redis';

async function exampleBasicSet() {
  await redisSet('username', 'john_doe');
  
  const username = await redisGet<string>('username');
  console.log('Username:', username); 
}


interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Set and get complex objects
async function exampleObjectOperations() {
  const user: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
  };

  // Set with expiration (3600 seconds = 1 hour)
  await redisSet('user:1', user, 3600);

  // Get and parse automatically
  const retrievedUser = await redisGet<User>('user:1');
  console.log('User:', retrievedUser);
}

// Set expiration after creating a key
async function exampleExpiration() {
  await redisSet('session:token123', { userId: 1, token: 'abc123' });
  
  // Set expiration to 30 minutes
  await redisExpire('session:token123', 60 * 30);
}

// Or set expiration during set operation
async function exampleExpirationDuringSet() {
  // Expires in 1 hour
  await redisSet('otp:user@email.com', { code: '123456' }, 3600);
}

// Page views counter
async function exampleCounter() {
  // Initialize counter
  await redisSet('page:views', 0);

  // Increment on each visit
  const views = await redisIncr('page:views');
  console.log('Total views:', views);

  // Decrement if needed
  const decremented = await redisDecr('page:views');
  console.log('After decrement:', decremented);
}


interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
}

// Working with lists
async function exampleListOperations() {
  const notification1: NotificationItem = {
    id: '1',
    message: 'New order received',
    timestamp: new Date().toISOString(),
  };

  const notification2: NotificationItem = {
    id: '2',
    message: 'Payment processed',
    timestamp: new Date().toISOString(),
  };

  // Push multiple items to a list
  await redisPush('notifications:user:1', notification1, notification2);

  // Get all items from list
  const notifications = await redisGetList<NotificationItem>('notifications:user:1');
  console.log('Notifications:', notifications);
}


async function exampleKeyExists() {
  await redisSet('mykey', 'value');

  const exists = await redisExists('mykey');
  console.log('Key exists:', exists); // true

  const notExists = await redisExists('nonexistent');
  console.log('Key exists:', notExists); // false
}

// Delete single key
async function exampleDeleteSingle() {
  const deletedCount = await redisDel('mykey');
  console.log('Deleted:', deletedCount); // 1 or 0
}

// Delete multiple keys
async function exampleDeleteMultiple() {
  const deletedCount = await redisDel(['key1', 'key2', 'key3']);
  console.log('Deleted:', deletedCount); // Could be 0-3
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

async function getProductWithCache(productId: string) {
  const cacheKey = `product:${productId}`;

  // Try to get from cache
  let product = await redisGet<Product>(cacheKey);
  if (product) {
    console.log('Retrieved from cache');
    return product;
  }

  // Cache miss - fetch from database/API
  console.log('Cache miss, fetching from source...');
  const apiResponse = await fetch(`https://api.example.com/products/${productId}`);
  product = await apiResponse.json();

  // Store in cache for 1 hour
  await redisSet(cacheKey, product, 3600);

  return product;
}

async function checkRateLimit(userId: string, maxRequests: number = 10, window: number = 60) {
  const key = `ratelimit:${userId}`;

  // Get current count
  const count = await redisGet<number>(key);
  const currentCount = typeof count === 'number' ? count : 0;

  if (currentCount >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  // Increment and set expiration if first request
  const newCount = await redisIncr(key);
  if (newCount === 1) {
    await redisExpire(key, window);
  }

  return { allowed: true, remaining: maxRequests - newCount };
}

interface SessionData {
  userId: string;
  username: string;
  loginTime: string;
  permissions: string[];
}

async function createSession(sessionId: string, userData: SessionData) {
  // Store session with 24 hour expiration
  await redisSet(`session:${sessionId}`, userData, 24 * 60 * 60);
}

async function getSession(sessionId: string) {
  return await redisGet<SessionData>(`session:${sessionId}`);
}

async function destroySession(sessionId: string) {
  await redisDel(`session:${sessionId}`);
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

async function addToCart(userId: string, item: CartItem) {
  const cartKey = `cart:${userId}`;
  const currentCart = await redisGetList<CartItem>(cartKey);

  // Check if item already exists
  const existingIndex = currentCart.findIndex((i) => i.productId === item.productId);

  if (existingIndex >= 0) {
    currentCart[existingIndex].quantity += item.quantity;
  } else {
    currentCart.push(item);
  }

  // Store updated cart
  await redisSet(cartKey, currentCart, 7 * 24 * 60 * 60); // 7 days
}

async function getCart(userId: string) {
  return await redisGetList<CartItem>(`cart:${userId}`);
}

async function clearCart(userId: string) {
  await redisDel(`cart:${userId}`);
}

// File: app/api/user/profile/route.ts
async function exampleAPIRoute() {
  // Example for GET request
  const cacheKey = 'user:profile:123';

  // Try cache first
  let userProfile = await redisGet(cacheKey);

  if (!userProfile) {
    // Fetch from database
    // userProfile = await db.users.findById('123');

    // Store in Redis for 1 hour
    // await redisSet(cacheKey, userProfile, 3600);
  }

  // return userProfile;
}

export {
  exampleBasicSet,
  exampleObjectOperations,
  exampleExpiration,
  exampleExpirationDuringSet,
  exampleCounter,
  exampleListOperations,
  exampleKeyExists,
  exampleDeleteSingle,
  exampleDeleteMultiple,
  getProductWithCache,
  checkRateLimit,
  createSession,
  getSession,
  destroySession,
  addToCart,
  getCart,
  clearCart,
};
