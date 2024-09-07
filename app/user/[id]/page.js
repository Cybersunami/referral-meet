'use client'
import React from "react";
import { useRouter } from "next/navigation";
import UserProfile from "../../components/UserProfile";
import Navbarloggedin from "@/app/components/navbarloggedin";
import { useAuthRedirect } from "@/app/components/useauthredirect";

const UserPage = ({params}) => {
  const router = useRouter();
  const { id } = params;

  const { isAuthenticated, loading:authloading } = useAuthRedirect();
  
  if (!id) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return null; // This is a safeguard; user will be redirected if not authenticated
  }
  return (
  <>

  <Navbarloggedin />
  <UserProfile uid={id} />

  </>

);
};

export default UserPage;
