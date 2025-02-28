import { headers } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const signature = headers().get('clerk-signature'); // Verify signature if needed

  if (!body || !body.data) {
    return Response.json({ error: 'Invalid webhook payload' }, { status: 400 });
  }

  const { id, email_addresses, full_name } = body.data;

  if (body.type === 'user.created') {
    await User.create({
      clerkId: id,
      email: email_addresses[0].email_address,
      fullName: full_name,
    });
  } else if (body.type === 'user.deleted') {
    await User.deleteOne({ clerkId: id });
  }

  return Response.json({ message: 'Webhook received' });
}
