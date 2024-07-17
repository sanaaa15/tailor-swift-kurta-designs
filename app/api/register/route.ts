import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConfig from '../dbconfig'

export async function POST(request: NextRequest) {
  const { fullName, email, password } = await request.json();
  console.log('Attempting to connect to database with config:', dbConfig);
  try {
    console.log('Creating connection...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connection created successfully');

    // Check if user already exists
    const [existingUsers] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const [result] = await connection.execute<mysql.OkPacket>(
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
      [fullName, email, hashedPassword]
    );
    const userId = result.insertId;

    await connection.end();

    // Create and sign a JWT
    const token = jwt.sign({ userId: userId, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const response = NextResponse.json({ success: true, email: email, token: token });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}