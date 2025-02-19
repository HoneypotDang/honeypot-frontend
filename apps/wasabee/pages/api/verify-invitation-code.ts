import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Invitation code is required' });
  }

  const correctCode = process.env.INVITATION_CODE;

  if (code === correctCode) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid invitation code' });
  }
} 