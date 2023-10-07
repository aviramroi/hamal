import clientPromise from '@/lib/mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { stringify } from 'querystring';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Jerusalem');

const collectionName = 'logs';

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

export async function insertLog(reportId: number, data: any): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);

  const newData = {
    ...data,
    report_id: data.reportId,
    id: uuidv4(),
    changeDate: dayjs().tz('Asia/Jerusalem').format('DD/MM/YYYY HH:mm')
  };
  return await collection.insertMany([newData]);
}

export async function insertLogs(data: any[]): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection.insertMany(data);
}
