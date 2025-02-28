import { auth } from "@clerk/nextjs/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();
  } catch (err) {
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }

  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch Clerk user data
    const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!clerkRes.ok) {
      throw new Error("Failed to fetch Clerk user data");
    }

    const clerkUser = await clerkRes.json();

    // Check if user exists in MongoDB
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: clerkUser.email_addresses[0].email_address,
        fullName: clerkUser.full_name,
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({ message: "User synced", user, token });
  } catch (err) {
    console.error("❌ API Error:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
