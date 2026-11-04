// 'use client'
// import { Button, Description, FieldError, Form, Input, InputGroup, Label, TextField } from '@heroui/react';
// import React, { useState } from 'react';
// import {Check, Eye, EyeSlash} from "@gravity-ui/icons";
// import { authClient, signIn, signUp } from '@/lib/auth-client';
// import { toast } from 'react-toastify';
// import { redirect } from 'next/navigation';
// import { FaGoogle ,FaGithub} from 'react-icons/fa';
// import Link from 'next/link';

// const SignUpPage = () => {
//       const onSubmit = async(e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const data = Object.fromEntries(formData.entries());
//     // const password = formData.get("password");
//     // c
//     console.log('from data',data)

//     const {data:resData,error}=await signUp.email({
//         name:'',
//         email:data.email,
//         password:data.password
//     })

// toast.success(`You have submited successfully!`);
  
// console.log(resData,error)

// if(data){
//     redirect("/")
// }
// };
// // google signin

// const handleGoogleSignIn=async(e)=>{
//   e.preventDefault()
//   const resData=await signIn.social({
//     provider:"google"
//   })
//   console.log("google",resData)
// }
//  const [isVisible, setIsVisible] = useState(false);
// // github signin

// const handleGithubsignIn = async () => {
//     const data = await authClient.signIn.social({
//         provider: "github"
//     })
// }
//     return (
       
// <main className="min-h-screen bg-green-50 px-4 py-8">
//   <div className="mx-auto flex w-full max-w-md flex-col items-center">
//     <div className="text-center">
//       <h1 className="text-2xl font-bold text-gray-900">
//         অ্যাকাউন্ট তৈরি করুন
//       </h1>
//       <p className="mt-2 text-sm text-gray-600">
//         বিনামূল্যে সাইন আপ করে পণ্যের বিস্তারিত দাম দেখুন।
//       </p>
//     </div>

//     <Form
//       className="mt-5 flex w-full flex-col items-stretch gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
//       onSubmit={onSubmit}
//       onInvalid={() => {
//     toast.error("সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
//   }}
//     >
//       <TextField
//         isRequired
//         name="name"
//         className="w-full"
//         validate={(value) => {
//           if (value.length < 3) {
//             return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে";
//           }
//           return null;
//         }}
//       >
//         <Label>আপনার নাম</Label>
//         <Input placeholder="সম্পূর্ণ নাম লিখুন" />
//         <FieldError />
//       </TextField>

//       <TextField
//         isRequired
//         className="w-full"
//         name="email"
//         type="email"
//         validate={(value) => {
//           if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
//             return "সঠিক ইমেইল ঠিকানা লিখুন";
//           }
//           return null;
//         }}
//       >
//         <Label>ইমেইল ঠিকানা</Label>
//         <Input placeholder="আপনার ইমেইল লিখুন" />
//         <FieldError />
//       </TextField>

//          <TextField isRequired
//                   name="password"
//                   type={isVisible ? "text" : "password"}
//                   className="w-full"
//                   validate={(value) => {
//                     if (value.length < 8) {
//                       return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
//                     }
      
//                     if (!/[A-Z]/.test(value)) {
//                       return "কমপক্ষে একটি ইংরেজি বড় হাতের অক্ষর দিন";
//                     }
      
//                     if (!/[0-9]/.test(value)) {
//                       return "কমপক্ষে একটি সংখ্যা দিন";
//                     }
      
//                     return null;
//                   }}>
//                   <Label>পাসওয়ার্ড</Label>
      
//                   <InputGroup className="w-full">
//                     <Input className="flex-1 min-w-0" placeholder="পাসওয়ার্ড লিখুন" />
      
//                     <InputGroup.Suffix className="shrink-0">
//                       <Button
//                         type="button"
//                         isIconOnly
//                         aria-label={isVisible ? "Hide password" : "Show password"}
//                         variant="ghost"
//                         onPress={() => setIsVisible(!isVisible)}
//                       >
//                         {isVisible ? (
//                           <Eye className="size-4" />
//                         ) : (
//                           <EyeSlash className="size-4" />
//                         )}
//                       </Button>
//                     </InputGroup.Suffix>
//                   </InputGroup>
      
//                   <Description>
//                     কমপক্ষে ৮ অক্ষর, একটি বড় হাতের ইংরেজি অক্ষর ও একটি সংখ্যা দিন।
//                   </Description>
      
//                   <FieldError />
//                 </TextField>
      
//    <TextField isRequired
//             name="confirmPassword"
//             type={isVisible ? "text" : "password"}
//             className="w-full"
//             validate={(value) => {
//               if (value.length < 8) {
//                 return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
//               }

//               if (!/[A-Z]/.test(value)) {
//                 return "কমপক্ষে একটি ইংরেজি বড় হাতের অক্ষর দিন";
//               }

//               if (!/[0-9]/.test(value)) {
//                 return "কমপক্ষে একটি সংখ্যা দিন";
//               }

//               return null;
//             }}>
//             <Label>পাসওয়ার্ড নিশ্চিত করুন </Label>

//             <InputGroup className="w-full">
//               <Input className="flex-1 min-w-0" placeholder="পাসওয়ার্ড লিখুন" />

//               <InputGroup.Suffix className="shrink-0">
//                 <Button
//                   type="button"
//                   isIconOnly
//                   aria-label={isVisible ? "Hide password" : "Show password"}
//                   variant="ghost"
//                   onPress={() => setIsVisible(!isVisible)}
//                 >
//                   {isVisible ? (
//                     <Eye className="size-4" />
//                   ) : (
//                     <EyeSlash className="size-4" />
//                   )}
//                 </Button>
//               </InputGroup.Suffix>
//             </InputGroup>

//             <Description>
//               কমপক্ষে ৮ অক্ষর, একটি বড় হাতের ইংরেজি অক্ষর ও একটি সংখ্যা দিন।
//             </Description>

//             <FieldError />
//           </TextField>
// {/* পাসওয়ার্ড নিশ্চিত করুন */}

//       <div className="flex gap-3 pt-2">
//         <Button type="submit" className="flex-1 ">
//           <Check />
//           সাইন আপ করুন
//         </Button>

//         <Button type="reset" variant="secondary">
//           মুছে ফেলুন
//         </Button>
//       </div>
//        <div>
   
// <div className="w-full">
//   <p className="mb-3 text-center">অথবা</p>

//   <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
//     <button
//   type="button"
//   onClick={handleGoogleSignIn}
//   className="btn btn-success w-full min-w-0 flex-nowrap whitespace-nowrap text-xs sm:text-sm"
// >
//   <FaGoogle className="shrink-0" />
//   <span>Google দিয়ে চালিয়ে যান</span>
// </button>

// <button
//   type="button"
//   onClick={handleGithubsignIn}
//   className="btn btn-success w-full min-w-0 flex-nowrap whitespace-nowrap text-xs sm:text-sm"
// >
//   <FaGithub className="shrink-0" />
//   <span>GitHub দিয়ে চালিয়ে যান</span>
// </button>
//   </div>

//   <p className="mt-4 text-center">
//     অ্যাকাউন্ট আছে?{" "}
//     <Link  href={"/auth/sign-in"}>
//       <span className="text-green-500 underline">সাইন ইন করুন</span>
//     </Link>
//   </p>
// </div>

    
//     </div>
//     </Form>

//   </div>
 
// </main>

//     );
// };

// export default SignUpPage;
