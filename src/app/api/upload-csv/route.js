import { NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.DATABASE_ID;
const COLLECTION_ID = process.env.COLLECTION_ID;

export async function GET() {
    return Response.json({ message: 'Hello World', "APPWRITE_ENDPOINT": process.env.APPWRITE_ENDPOINT });
}

export async function POST(request) {
    try {
        const { headers, data } = await request.json();

        for (const field of headers) {
            try {
                await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, field, 255, false);
            } catch (err) {
                if (!err.message.includes('already exists')) {
                    console.error(`Attribute "${field}" error:`, err.message);
                    return new Response(JSON.stringify({ message: `Failed to create attribute "${field}".` }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }
        }

        for (const row of data) {
            try {
                console.log({ row });
                await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', row);
            } catch (err) {
                console.error('Document insert failed:', err.message);
                return NextResponse.json(JSON.stringify({ message: 'Failed to insert document.' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        return NextResponse.json({ message: 'Upload complete' });
    } catch (error) {
        console.error('Error uploading CSV:', error);
        return NextResponse.json(JSON.stringify({ message: 'Failed to upload CSV data.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}