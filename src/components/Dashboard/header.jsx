// 'use client';
// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import Navbar from './Navbar';
// import { useSession, signIn, signOut } from "next-auth/react";
// import { HoverBorderGradient as Button } from "../ui/hover-border-gradient";
// import Link from 'next/link';

// const Header = () => {
//   const { data: session, status } = useSession();

//   return (
//     <div className='flex items-center justify-between px-10 py-4'>
//       <Avatar>
//         <AvatarImage src="https://github.com/shadcn.png" />
//         <AvatarFallback>CN</AvatarFallback>
//       </Avatar>
//       {/* <Navbar /> */}
//       <div>
//         {status === "authenticated" ? (
//           <div className="flex items-center gap-4">
//             {/* ✅ Conditional Admin Panel Link */}
//             {session?.user?.role === 'admin' && (
//               <Link href="/admin">
//                 <Button variant="destructive">Admin Panel</Button>
//               </Link>
//             )}
//             <p>Welcome, {session.user.name}</p>
//             <Button onClick={() => signOut()}>Sign Out</Button>
//           </div>
//         ) : (
//           <Button onClick={() => signIn()}>Sign In</Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Header;
