import { getFiles, saveFile } from '@/lib/api/file';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const result = await getFiles(+(req.query.reportId as string));
      return res.status(200).json(result);
    } catch (e: any) {
      console.log(e);
      return res.status(500).json({
        error: e.toString()
      });
    }
  } else if (req.method === 'POST') {
    const { fileName, filePath } = req.body;
    const reportId = +(req.query.reportId as string);
    try {
      const result = await saveFile(reportId, fileName, filePath);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({
        error: e.toString()
      });
    }

    // saveFile
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
