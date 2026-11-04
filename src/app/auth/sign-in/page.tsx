// "use client";
// import {
//   Button,
//   Description,
//   FieldError,
//   Form,
//   Input,
//   InputGroup,
//   Label,
//   TextField,
// } from "@heroui/react";
// import { toast } from "react-toastify";
// import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
// import { redirect } from "next/navigation";
// import { useState } from "react";
// import Link from "next/link";

// const SignInPage = () => {
//   const onSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const data = {};
//     // Convert FormData to plain object
//     formData.forEach((value, key) => {
//       data[key] = value.toString();
//     });
//     if (data) {
//       redirect("/");
//     }

//     toast.success(`You have logedin successfully!`);
//   };
//   const [isVisible, setIsVisible] = useState(false);
//   return (
//     <main className="min-h-screen px-4 py-8">
//       <div className="mx-auto  bg-green-50  flex w-full max-w-md flex-col items-center">
//         <div className="text-center ">
//           <h1 className="text-2xl font-bold text-gray-900">সাইন ইন</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
//           </p>
//         </div>
//         <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}     onInvalid={() => {
//             toast.error("সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
//           }}>
//           <TextField
//             isRequired
//             name="email"
//             type="email"
//             validate={(value) => {
//               if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
//                 return "সঠিক ইমেইল ঠিকানা লিখুন";
//               }
//               return null;
//             }}
//           >
//             <Label>ইমেইল ঠিকানা</Label>
//             <Input placeholder="আপনার ইমেইল লিখুন" />
//             <FieldError />
//           </TextField>

//           <TextField isRequired
//             name="password"
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
//             <Label>পাসওয়ার্ড</Label>

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
//           <div className="w-full ">
//             <Button type="submit" className="w-full ">
//               <Check />
//               সাইন ইন
//             </Button>
//           </div>
//         </Form>
//         <p>
//           অ্যাকাউন্ট নেই?{" "}
//           <Link href={"/auth/sign-up"}>
//             <span className="text-green-600 underline">সাইন আপ করুন</span>
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// };

// export default SignInPage;


const SignInPage = () => {
    return (
        <div>
           <h1>signin page</h1> 
        </div>
    );
};

export default SignInPage;