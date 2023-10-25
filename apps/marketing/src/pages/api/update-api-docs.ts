import { NextApiRequest, NextApiResponse } from 'next';

import { promises as fsPromises } from 'fs';

import { doc } from '@documenso/trpc/server/api-docs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docJson = JSON.stringify(doc, null, 3);

  await fsPromises.writeFile('./public/openapi.json', docJson, 'utf-8');

  res.status(200).json({ message: 'done' });
}
