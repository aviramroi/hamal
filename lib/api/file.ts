import clientPromise from '@/lib/mongodb';
import { report } from 'process';
import { v4 as uuidv4 } from 'uuid';

const collectionName = 'files';

export async function getFiles(reportId: number): Promise<any[]> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection
    .aggregate([
      {
        $match: {
          itemId: String(reportId)
        }
      }
    ])
    .toArray();
}

export async function saveFile(
  reportId: number,
  fileName: string,
  filePath: string
): Promise<any[]> {
  const object = {
    tableId: 103,
    id: uuidv4(),
    itemId: reportId,
    fileName: fileName,
    fileSerialized: filePath
  };

  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection.insertMany([object]);
}

export async function insertFiles(data: any): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection.insertMany(data);
}
