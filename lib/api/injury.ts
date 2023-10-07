import clientPromise from '@/lib/mongodb';
import dayjs from 'dayjs';

const collectionName = 'reports';

export async function getInjuryReportsFilters(
  pageNumber: number,
  nPerPage: number,
  filters: any
): Promise<any[]> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);

  const { troop, nameTz, reportId, type, fromDate, toDate } = filters;

  let filterObject: any = {};

  console.log({ filters });

  if (fromDate || toDate) {
    const key = type === '1' ? 'pDate' : 'iDate';

    if (fromDate && toDate) {
      filterObject['$expr'] = {
        $and: [
          {
            $gte: [
              {
                $toDate: `$${key}`
              },
              {
                $toDate: dayjs(fromDate).format('YYYY-MM-DD')
              }
            ]
          },
          {
            $lt: [
              {
                $toDate: `$${key}`
              },
              {
                $toDate: dayjs(toDate).format('YYYY-MM-DD')
              }
            ]
          }
        ]
      };
    } else {
      if (fromDate) {
        filterObject['$expr'] = {
          $gte: [
            {
              $toDate: `$${key}`
            },
            {
              $toDate: dayjs(fromDate).format('YYYY-MM-DD')
            }
          ]
        };
      } else {
        filterObject['$expr'] = {
          $lte: [
            {
              $toDate: `$${key}`
            },
            {
              $toDate: dayjs(toDate).format('YYYY-MM-DD')
            }
          ]
        };
      }
    }
  }

  if (troop && nameTz) {
    filterObject['$and'] = [
      {
        $or: [
          { troopName: { $regex: troop, $options: 'i' } },
          { parentName: { $regex: troop, $options: 'i' } }
        ]
      },
      {
        $or: [
          { injuredName: { $regex: nameTz, $options: 'i' } },
          { injuredTzNum: { $regex: nameTz, $options: 'i' } }
        ]
      }
    ];
  } else {
    if (troop) {
      filterObject['$or'] = [
        { troopName: { $regex: troop, $options: 'i' } },
        { parentName: { $regex: troop, $options: 'i' } }
      ];
    } else {
      if (nameTz) {
        filterObject['$or'] = [
          { injuredName: { $regex: nameTz, $options: 'i' } },
          { injuredTzNum: { $regex: nameTz, $options: 'i' } }
        ];
      }
    }
  }

  if (reportId) {
    filterObject['id'] = {
      $regex: reportId,
      $options: 'i'
    };
  }

  return (
    (await collection
      .aggregate([
        {
          $match: filterObject
        },
        {
          $project: {
            id: 1,
            troopName: 1,
            injuredName: 1,
            iDate: 1,
            pDate: 1,
            injuredTzNum: 1,
            parentName: 1
          }
        },
        {
          $lookup: {
            from: 'files',
            localField: 'id',
            foreignField: 'itemId',
            as: 'files'
          }
        }
      ])
      // .find(filterObject)
      .sort({ id: -1 })
      .limit(nPerPage)
      .toArray()) ?? []
  );
}

export async function getInjuryReports(
  pageNumber: number,
  nPerPage: number
): Promise<any[]> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection
    .aggregate([
      {
        $project: {
          id: {
            $toInt: '$id'
          },
          troopName: 1,
          injuredName: 1,
          iDate: 1,
          pDate: 1,
          injuredTzNum: 1,
          parentName: 1
        }
      },
      {
        $lookup: {
          from: 'files',
          localField: 'id',
          foreignField: 'itemId',
          as: 'files'
        }
      }
    ])
    .sort({ id: -1 })
    .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage)
    .toArray();
}

export async function getInjuryReport(id: number): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection.findOne({ id: String(id) });
}

export async function updateInjury(id: number, data: any): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  const newData = data;
  delete newData._id;
  return await collection.findOneAndUpdate(
    { id: String(id) },
    { $set: newData }
  );
}

export async function insertReport(data: any): Promise<any> {
  const client = await clientPromise;
  const collection = client.db('injury').collection(collectionName);
  return await collection.insertMany(
    data.map((d: any) => {
      return {
        ...d,
        iDate: dayjs(d.iDate).format('YYYY-MM-DD'),
        pDate: dayjs(d.pDate).format('YYYY-MM-DD')
      };
    })
  );
}
