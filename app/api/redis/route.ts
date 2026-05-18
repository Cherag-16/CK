import { redisSet, redisGet } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  // Get cached data
  const cached = await redisGet('my-data');
  if (cached) {
    return NextResponse.json({ data: cached, source: 'cache' });
  }

  // Fetch fresh data
  const data = { message: 'Hello World', timestamp: new Date() };
  
  // Cache for 1 hour
  await redisSet('my-data', data, 3600);

  return NextResponse.json({ data, source: 'fresh' });
}
