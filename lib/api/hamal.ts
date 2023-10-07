import clientPromise from '@/lib/mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { stringify } from 'querystring';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Jerusalem');

const collectionName = 'faces';

export async function getLogs(reportId: number): Promise<any[]> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection
    .aggregate([
      {
        $match: {
          report_id: String(reportId)
        }
      }
    ])
    .toArray();
}

export async function insertFace(data: any): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('hamal').collection(collectionName);

  console.log({ data });

  const newData = {
    ...data,
    id: uuidv4(),

    createdAt: dayjs().tz('Asia/Jerusalem').format('DD/MM/YYYY HH:mm')
  };

  console.log({ newData });
  return await collection.insertMany([newData]);
}

export async function getFaces(
  generatedName: string,
  faceId: string
): Promise<any[]> {
  const client = await clientPromise;
  const collection = client.db('hamal').collection(collectionName);
  console.log({ generatedName, faceId });
  return await collection
    .aggregate([
      {
        $match: {
          faceId: String(faceId),
          generatedName: String(generatedName)
        }
      }
    ])
    .toArray();
}

export async function insertLogs(data: any[]): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection.insertMany(data);
}
