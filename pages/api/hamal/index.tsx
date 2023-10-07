import { insertFace } from '@/lib/api/hamal';
import {
  getInjuryReports,
  getInjuryReportsFilters,
  insertReport
} from '@/lib/api/injury';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const data = JSON.parse(req.body);

    const response = await insertFace(data);
    return res.status(200).json(response);
    //   const { username, bio } = req.body;
    //   const session = await getSession({ req });
    //   if (!session || session.username !== username) {
    //     return res.status(401).json({
    //       error: 'Unauthorized'
    //     });
    //   }
    //   try {
    //     const result = await updateUser(username, bio);
    //     if (result) {
    //       await res.unstable_revalidate(`/${username}`);
    //     }
    //     const bioMdx = await getMdxSource(bio); // return bioMdx to optimistically show updated state
    //     return res.status(200).json(bioMdx);
    //   } catch (e: any) {
    //     console.log(e);
    //     return res.status(500).json({
    //       error: e.toString()
    //     });
    //   }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
