import { NextResponse } from 'next/server';
import driver from '../neo4j';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import neo4j from 'neo4j-driver';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request: Request) {
  const session = driver.session();

  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      console.error('Invalid token:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await session.run(
      `
      MATCH (u:User {userId: $userId})
      MATCH (u)-[:HAS_PREFERENCES]->(p:Preferences)
      MATCH (u)-[:SIMILAR_TO]->(similar_user:User)
      MATCH (similar_user)-[:BUYS|WISHLIST|CART]->(k:Kurta)
      MATCH (u)-[:BUYS|WISHLIST|CART]->(z:Kurta)

      WITH u, 
           collect(DISTINCT z.color) AS user_colors,
           collect(DISTINCT z.sleeveStyle) AS user_sleeves,
           collect(DISTINCT z.hemlineStyle) AS user_hemlines,
           collect(DISTINCT z.necklineStyle) AS user_necklines,
           collect(DISTINCT k.color) AS similar_colors,
           collect(DISTINCT k.sleeveStyle) AS similar_sleeves,
           collect(DISTINCT k.hemlineStyle) AS similar_hemlines,
           collect(DISTINCT k.necklineStyle) AS similar_necklines

      WITH
           user_colors + similar_colors AS combined_colors,
           user_sleeves + similar_sleeves AS combined_sleeves,
           user_hemlines + similar_hemlines AS combined_hemlines,
           user_necklines + similar_necklines AS combined_necklines

      WITH
           apoc.coll.shuffle(combined_colors) AS shuffled_colors,
           apoc.coll.shuffle(combined_sleeves) AS shuffled_sleeves,
           apoc.coll.shuffle(combined_hemlines) AS shuffled_hemlines,
           apoc.coll.shuffle(combined_necklines) AS shuffled_necklines,
           size(combined_colors) AS color_size,
           size(combined_sleeves) AS sleeve_size,
           size(combined_hemlines) AS hemline_size,
           size(combined_necklines) AS neckline_size

      UNWIND range(0, 9) AS idx
      RETURN shuffled_colors[idx % color_size] AS color,
             shuffled_sleeves[idx % sleeve_size] AS sleeve,
             shuffled_hemlines[idx % hemline_size] AS hemline,
             shuffled_necklines[idx % neckline_size] AS neckline
      `,
      { userId }
    );

    const prompts = result.records.map(record => ({
      color: record.get('color'),
      sleeveStyle: record.get('sleeve'),
      hemlineStyle: record.get('hemline'),
      necklineStyle: record.get('neckline')
    }));

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error generating prompts:', error);
    return NextResponse.json({ error: 'Error generating prompts' }, { status: 500 });
  } finally {
    await session.close();
  }
}
