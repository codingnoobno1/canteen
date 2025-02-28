"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      router.push(`/user/${user.username || user.id}`);
    }
  }, [isSignedIn, user, router]);

  return <SignIn routing="path" path="/sign-in" />;
}
