import { NextResponse } from 'next/server';
import driver from '../neo4j';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request: Request) {
  const session = driver.session();

  try {
    const { description, imageUrl } = await request.json();

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
      userId = decoded.userId;
    } catch (error) {
      console.error('Invalid token:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Kurta node with description and image
    const result = await session.run(
      `
      MATCH (u:User {userId: $userId})
      CREATE (k:Kurta {
        kurtaId: apoc.create.uuid(),
        description: $description,
        imageUrl: $imageUrl,
        createdAt: datetime()
      })
      MERGE (u)-[r:WISHLIST]->(k)
      RETURN k
      `,
      { userId, description, imageUrl }
    );

    return NextResponse.json({ 
      message: 'Added to wishlist successfully',
      kurta: result.records[0].get('k').properties
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Error adding to wishlist' }, { status: 500 });
  } finally {
    await session.close();
  }
}