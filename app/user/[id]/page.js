'use client'
import React from "react";
import { useRouter } from "next/navigation";
import UserProfile from "../../components/UserProfile";
import Navbarloggedin from "@/app/components/navbarloggedin";
import { useAuthRedirect } from "@/app/firebasefunctions/auth";

const UserPage = ({params}) => {
  useAuthRedirect()
  const router = useRouter();
  const { id } = params;

  if (!id) return <div>Loading...</div>;

  return (
  <>

  <Navbarloggedin />
  <UserProfile uid={id} />

  </>

);
};

export default UserPage;
