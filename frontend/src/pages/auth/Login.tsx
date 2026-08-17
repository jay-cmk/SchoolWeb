// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import { login } from "../../features/auth/auth.slice";
// import { UserRole } from "../../types/auth.types";

// const Login = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const { loading, error } = useAppSelector(
//     (state) => state.auth
//   );

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     const result = await dispatch(
//       login({
//         email,
//         password,
//       })
//     );

//     if (login.fulfilled.match(result)) {
//       const role = result.payload.user.role;

//       if (role === UserRole.SUPER_ADMIN) {
//         navigate("/super-admin/dashboard");
//       } else if (
//         role === UserRole.SCHOOL_ADMIN
//       ) {
//         navigate("/school-admin/dashboard");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

//         <h1 className="text-2xl font-bold text-gray-800 text-center">
//           School SaaS
//         </h1>

//         <p className="text-gray-500 text-center mt-2 mb-6">
//           Login to your account
//         </p>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4"
//         >

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Email
//             </label>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter email"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Password
//             </label>

//             <input
//               type="password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter password"
//             />
//           </div>

//           {error && (
//             <p className="text-red-500 text-sm">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default Login;












// import React, { useState } from 'react';
// import { Icon } from '@iconify/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { login } from '../../features/auth/auth.slice';
// import { UserRole } from '../../types/auth.types';

// // --- TYPES & INTERFACES ---

// interface StatCardProps {
//   type: 'students' | 'revenue' | 'attendance' | 'notification';
//   className?: string;
// }

// interface LoginFormProps {
//   email: string;
//   setEmail: (val: string) => void;
//   password: string;
//   setPassword: (val: string) => void;
//   showPassword: boolean;
//   setShowPassword: (val: boolean) => void;
//   rememberMe: boolean;
//   setRememberMe: (val: boolean) => void;
//   errorMessage: string | null;
//   isSubmitting: boolean;
//   onSubmit: (e: React.FormEvent) => void;
//   onForgotPassword: () => void;
// }

// // --- HELPER SUB-COMPONENTS ---

// const Header: React.FC = () => {
//   return (
//     <header className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-10">
//       <div className="flex items-center gap-3">
//         <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#38BDF8] text-[#07152F] shadow-md">
//           <Icon icon="lucide:landmark" className="text-2xl" />
//         </div>
//         <div>
//           <div className="text-lg font-bold tracking-tight text-[#EAF3FF]">School ERP</div>
//           <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A9C0DD]">Connected intelligence</div>
//         </div>
//       </div>
//       <div className="hidden items-center gap-2 rounded-full border border-[#315783] bg-[#0D2345] px-4 py-2 text-xs text-[#A9C0DD] shadow-md md:flex">
//         <span className="relative flex h-2 w-2">
//           <span className="absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-60 animate-ping"></span>
//           <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]"></span>
//         </span>
//         Platform services operational
//       </div>
//     </header>
//   );
// };

// const StatCard: React.FC<StatCardProps> = ({ type, className = '' }) => {
//   if (type === 'students') {
//     return (
//       <div className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}>
//         <div className="flex items-center gap-3">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] text-[#130B2A]">
//             <Icon icon="lucide:users" className="text-lg" />
//           </div>
//           <div>
//             <p className="text-xs text-[#A9C0DD]">Students</p>
//             <p className="text-base font-bold text-[#EAF3FF]">1,248</p>
//           </div>
//         </div>
//         <div className="mt-3 flex items-end gap-1">
//           <span className="h-2 w-2 rounded-sm bg-[#38BDF8]"></span>
//           <span className="h-4 w-2 rounded-sm bg-[#38BDF8]"></span>
//           <span className="h-3 w-2 rounded-sm bg-[#38BDF8]"></span>
//           <span className="h-6 w-2 rounded-sm bg-[#38BDF8]"></span>
//           <span className="h-5 w-2 rounded-sm bg-[#38BDF8]"></span>
//           <span className="h-7 w-2 rounded-sm bg-[#38BDF8] animate-pulse"></span>
//         </div>
//       </div>
//     );
//   }

//   if (type === 'revenue') {
//     return (
//       <div className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}>
//         <div className="flex items-center gap-3">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#38BDF8] text-[#07152F]">
//             <Icon icon="lucide:indian-rupee" className="text-lg" />
//           </div>
//           <div>
//             <p className="text-xs text-[#A9C0DD]">Monthly revenue</p>
//             <p className="text-base font-bold text-[#EAF3FF]">₹8.46L</p>
//           </div>
//         </div>
//         <p className="mt-3 text-xs text-[#38BDF8] flex items-center">
//           <Icon icon="lucide:trending-up" className="mr-1" />
//           12.8% this month
//         </p>
//       </div>
//     );
//   }

//   if (type === 'attendance') {
//     return (
//       <div className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}>
//         <div className="flex items-center gap-3">
//           <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#A78BFA]">
//             <span className="text-[10px] font-bold text-[#EAF3FF]">94%</span>
//           </div>
//           <div>
//             <p className="text-xs text-[#A9C0DD]">Attendance</p>
//             <p className="text-base font-bold text-[#EAF3FF]">94.2%</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (type === 'notification') {
//     return (
//       <div className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}>
//         <div className="flex items-center gap-3">
//           <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#142B52]">
//             <Icon icon="lucide:bell" className="text-lg text-[#38BDF8]" />
//             <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0D2345] bg-[#A78BFA] animate-pulse"></span>
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-[#EAF3FF]">New school added</p>
//             <p className="text-[11px] text-[#A9C0DD]">Cedar Grove Academy</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// const EcosystemVisual: React.FC = () => {
//   return (
//     <section className="relative flex min-h-[520px] flex-1 items-center justify-center overflow-hidden py-4 lg:min-h-[650px] lg:justify-start" aria-label="School ERP connected ecosystem">
//       {/* Floating Stat Cards */}
//       <motion.div 
//         initial={{ y: 10, opacity: 0 }}
//         animate={{ y: [0, -10, 0], opacity: 1 }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute left-[13%] top-[12%] hidden lg:block z-20"
//       >
//         <StatCard type="students" />
//       </motion.div>

//       <motion.div 
//         initial={{ y: -10, opacity: 0 }}
//         animate={{ y: [0, 10, 0], opacity: 1 }}
//         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//         className="absolute bottom-[10%] left-[16%] hidden lg:block z-20"
//       >
//         <StatCard type="revenue" />
//       </motion.div>

//       <motion.div 
//         initial={{ y: 8, opacity: 0 }}
//         animate={{ y: [0, -8, 0], opacity: 1 }}
//         transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//         className="absolute right-[4%] top-[14%] hidden xl:block z-20"
//       >
//         <StatCard type="attendance" />
//       </motion.div>

//       <motion.div 
//         initial={{ y: -12, opacity: 0 }}
//         animate={{ y: [0, 12, 0], opacity: 1 }}
//         transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
//         className="absolute bottom-[16%] right-[2%] hidden xl:block z-20"
//       >
//         <StatCard type="notification" />
//       </motion.div>

//       {/* Interactive Network Diagram */}
//       <div className="relative h-[420px] w-full max-w-[680px] scale-90 sm:scale-100">
//         {/* Pulsing Background Rings */}
//         <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#38BDF8] opacity-20 animate-ping"></div>
//         <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A78BFA] opacity-30"></div>

//         {/* Connection Lines */}
//         <div className="absolute left-[18%] top-[23%] h-px w-[32%] origin-right rotate-[24deg] bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] opacity-80"></div>
//         <div className="absolute left-[21%] bottom-[22%] h-px w-[30%] origin-right -rotate-[24deg] bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] opacity-80"></div>
//         <div className="absolute right-[19%] top-[24%] h-px w-[31%] origin-left -rotate-[24deg] bg-gradient-to-r from-[#A78BFA] to-[#38BDF8] opacity-80"></div>
//         <div className="absolute right-[21%] bottom-[22%] h-px w-[29%] origin-left rotate-[24deg] bg-gradient-to-r from-[#A78BFA] to-[#38BDF8] opacity-80"></div>

//         {/* Pulsing Data Nodes */}
//         <div className="absolute left-[38%] top-[31%] h-2 w-2 rounded-full bg-[#38BDF8] shadow-md animate-ping"></div>
//         <div className="absolute left-[38%] bottom-[29%] h-2 w-2 rounded-full bg-[#38BDF8] shadow-md animate-ping"></div>
//         <div className="absolute right-[38%] top-[31%] h-2 w-2 rounded-full bg-[#A78BFA] shadow-md animate-ping"></div>
//         <div className="absolute right-[38%] bottom-[29%] h-2 w-2 rounded-full bg-[#A78BFA] shadow-md animate-ping"></div>

//         {/* Central Command Hub */}
//         <div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#38BDF8] bg-[#0D2345] text-center shadow-md animate-pulse">
//           <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#38BDF8] text-[#07152F] shadow-md">
//             <Icon icon="lucide:graduation-cap" className="text-3xl" />
//           </div>
//           <span className="text-sm font-bold text-[#EAF3FF]">School ERP</span>
//           <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#38BDF8]">Command hub</span>
//         </div>

//         {/* Connected Schools */}
//         <motion.div 
//           whileHover={{ scale: 1.05 }}
//           className="absolute left-[8%] top-[14%] flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md cursor-pointer"
//         >
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142B52]">
//             <Icon icon="lucide:building-2" className="text-xl text-[#38BDF8]" />
//           </div>
//           <span className="mt-2 text-xs font-semibold text-[#EAF3FF]">School A</span>
//           <span className="text-[10px] text-[#A9C0DD]">Westbridge</span>
//         </motion.div>

//         <motion.div 
//           whileHover={{ scale: 1.05 }}
//           className="absolute left-[10%] bottom-[12%] flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md cursor-pointer"
//         >
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142B52]">
//             <Icon icon="lucide:building-2" className="text-xl text-[#38BDF8]" />
//           </div>
//           <span className="mt-2 text-xs font-semibold text-[#EAF3FF]">School B</span>
//           <span className="text-[10px] text-[#A9C0DD]">Northfield</span>
//         </motion.div>

//         <motion.div 
//           whileHover={{ scale: 1.05 }}
//           className="absolute right-[8%] top-[14%] flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md cursor-pointer"
//         >
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142B52]">
//             <Icon icon="lucide:building-2" className="text-xl text-[#A78BFA]" />
//           </div>
//           <span className="mt-2 text-xs font-semibold text-[#EAF3FF]">School C</span>
//           <span className="text-[10px] text-[#A9C0DD]">Cedar Grove</span>
//         </motion.div>

//         <motion.div 
//           whileHover={{ scale: 1.05 }}
//           className="absolute right-[10%] bottom-[12%] flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md cursor-pointer"
//         >
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142B52]">
//             <Icon icon="lucide:building-2" className="text-xl text-[#A78BFA]" />
//           </div>
//           <span className="mt-2 text-xs font-semibold text-[#EAF3FF]">School D</span>
//           <span className="text-[10px] text-[#A9C0DD]">Riverstone</span>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// const LoginForm: React.FC<LoginFormProps> = ({
//   email,
//   setEmail,
//   password,
//   setPassword,
//   showPassword,
//   setShowPassword,
//   rememberMe,
//   setRememberMe,
//   errorMessage,
//   isSubmitting,
//   onSubmit,
//   onForgotPassword,
// }) => {
//   return (
//     <section className="relative z-20 w-full max-w-[460px] self-center rounded-2xl border border-[#315783] bg-[#0D2345] p-6 shadow-md sm:p-8 lg:mr-2" aria-labelledby="login-title">
//       <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#0D2345] to-[#A78BFA] opacity-30 blur-md"></div>
      
//       <div className="mb-7 flex items-start justify-between">
//         <div>
//           <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#38BDF8]">Super Admin Portal</p>
//           <h1 id="login-title" className="text-2xl font-bold tracking-tight text-[#EAF3FF]">Welcome Back</h1>
//           <p className="mt-2 max-w-sm text-sm leading-6 text-[#A9C0DD]">Sign in to manage your entire School ERP platform.</p>
//         </div>
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142B52] text-[#38BDF8]">
//           <Icon icon="lucide:shield-check" className="text-xl" />
//         </div>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-5" aria-label="Super Admin sign in form">
//         {/* Email Field */}
//         <div>
//           <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#EAF3FF]">Email Address</label>
//           <div className="group flex min-h-12 items-center gap-3 rounded-xl border border-[#244A77] bg-[#07152F] px-4 transition duration-300 focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#38BDF8] focus-within:ring-offset-2 focus-within:ring-offset-[#0D2345]">
//             <Icon icon="lucide:mail" className="text-lg text-[#A9C0DD] transition duration-300 group-focus-within:text-[#38BDF8]" />
//             <input 
//               id="email" 
//               type="email" 
//               autoComplete="email" 
//               placeholder="Enter your email" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full bg-transparent text-sm text-[#EAF3FF] outline-none placeholder:text-[#A9C0DD]" 
//             />
//           </div>
//         </div>

//         {/* Password Field */}
//         <div>
//           <div className="mb-2 flex items-center justify-between">
//             <label htmlFor="password" className="block text-sm font-semibold text-[#EAF3FF]">Password</label>
//             <span className="text-xs text-[#A9C0DD]">Secure access</span>
//           </div>
//           <div className="group flex min-h-12 items-center gap-3 rounded-xl border border-[#244A77] bg-[#07152F] px-4 transition duration-300 focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#38BDF8] focus-within:ring-offset-2 focus-within:ring-offset-[#0D2345]">
//             <Icon icon="lucide:lock-keyhole" className="text-lg text-[#A9C0DD] transition duration-300 group-focus-within:text-[#38BDF8]" />
//             <input 
//               id="password" 
//               type={showPassword ? "text" : "password"} 
//               autoComplete="current-password" 
//               placeholder="Enter your password" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full bg-transparent text-sm text-[#EAF3FF] outline-none placeholder:text-[#A9C0DD]" 
//             />
//             <button 
//               type="button" 
//               aria-label="Show password" 
//               onClick={() => setShowPassword(!showPassword)}
//               className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#A9C0DD] transition hover:bg-[#142B52] hover:text-[#38BDF8]"
//             >
//               <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} className="text-lg" />
//             </button>
//           </div>
//         </div>

//         {/* Remember Me & Forgot Password */}
//         <div className="flex items-center justify-between gap-4">
//           <label className="flex cursor-pointer items-center gap-2 text-sm text-[#A9C0DD] select-none">
//             <input 
//               type="checkbox" 
//               checked={rememberMe}
//               onChange={(e) => setRememberMe(e.target.checked)}
//               className="h-4 w-4 rounded border-[#244A77] bg-[#07152F] accent-[#38BDF8]" 
//             />
//             Remember me
//           </label>
//           <button 
//             type="button" 
//             onClick={onForgotPassword}
//             className="min-h-11 text-sm font-semibold text-[#38BDF8] transition hover:text-[#EAF3FF]"
//           >
//             Forgot Password?
//           </button>
//         </div>

//         {/* Error Message Alert */}
//         <AnimatePresence>
//           {errorMessage && (
//             <motion.div 
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="rounded-xl border border-[#C47C91] bg-[#102444] px-4 py-3 text-sm text-[#A9C0DD] flex items-center gap-2" 
//               role="alert"
//             >
//               <Icon icon="lucide:circle-alert" className="text-[#C47C91] text-lg flex-shrink-0" />
//               <span>{errorMessage}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Submit Button */}
//         <button 
//           type="submit" 
//           disabled={isSubmitting}
//           className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#38BDF8] px-5 py-3 text-sm font-bold text-[#07152F] shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:ring-offset-2 focus:ring-offset-[#0D2345] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? (
//             <>
//               <Icon icon="lucide:loader-2" className="text-lg animate-spin" />
//               <span>Authenticating...</span>
//             </>
//           ) : (
//             <>
//               <span>Sign In</span>
//               <Icon icon="lucide:arrow-right" className="text-lg" />
//             </>
//           )}
//         </button>
//       </form>

//       {/* Security Badge */}
//       <div className="mt-6 flex items-center gap-3 text-xs text-[#A9C0DD]">
//         <div className="h-px flex-1 bg-[#315783]"></div>
//         <span className="flex items-center gap-1">
//           <Icon icon="lucide:lock" className="text-sm" />
//           Enterprise-grade security
//         </span>
//         <div className="h-px flex-1 bg-[#315783]"></div>
//       </div>

//       {/* Live Ecosystem Status */}
//       <div className="mt-5 rounded-xl bg-[#142B52] p-3">
//         <div className="flex items-center gap-3">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3E6D] text-[#38BDF8]">
//             <Icon icon="lucide:activity" className="text-base" />
//           </div>
//           <p className="text-xs leading-5 text-[#A9C0DD]">
//             <span className="font-semibold text-[#EAF3FF]">Live ecosystem:</span> 24 schools securely connected to your command center.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// const Footer: React.FC = () => {
//   return (
//     <footer className="relative z-10 flex flex-col gap-2 px-6 pb-6 text-center text-xs text-[#A9C0DD] sm:flex-row sm:items-center sm:justify-between lg:px-10">
//       <span>© 2025 School ERP. Built for connected education.</span>
//       <div className="flex justify-center gap-4">
//         <a href="#" className="transition hover:text-[#38BDF8]">Privacy</a>
//         <a href="#" className="transition hover:text-[#38BDF8]">Security</a>
//         <a href="#" className="transition hover:text-[#38BDF8]">Support</a>
//       </div>
//     </footer>
//   );
// };

// // --- MAIN PAGE COMPONENT ---

// const SuperAdminLogin: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const { loading, error } = useAppSelector((state) => state.auth);

//   // State variables
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [rememberMe, setRememberMe] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   // Event Handlers
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrorMessage(null);

//     // Dispatch login action
//     const result = await dispatch(login({ email, password }));

//     if (login.fulfilled.match(result)) {
//       const role = result.payload.user.role;
      
//       // Navigate based on role
//       if (role === UserRole.SUPER_ADMIN) {
//         navigate('/super-admin/dashboard');
//       } else if (role === UserRole.SCHOOL_ADMIN) {
//         navigate('/school-admin/dashboard');
//       }
      
//       // Reset form
//       setEmail('');
//       setPassword('');
//       setErrorMessage(null);
//     } else {
//       // Show error from Redux state or fallback message
//       setErrorMessage(error || 'Invalid email or password. Please try again.');
//     }
    
//     setIsSubmitting(false);
//   };

//   const handleForgotPassword = () => {
//     if (!email) {
//       setErrorMessage('Please enter your email address first to recover your password.');
//       return;
//     }
//     setErrorMessage(null);
//     alert(`Password recovery link has been sent to: ${email}`);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#07152F] flex flex-col relative overflow-hidden text-[#EAF3FF]">
//       {/* Background Decorative Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
//         <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#38BDF8] opacity-10 blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#A78BFA] opacity-10 blur-3xl animate-pulse"></div>
//         <div className="absolute top-20 right-1/3 h-72 w-72 rounded-full bg-[#1B3E6D] opacity-60 blur-3xl"></div>
//         <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#07152F] via-[#07152F] to-[#142B52]"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#315783_1px,transparent_0)] bg-[size:28px_28px] opacity-30"></div>
        
//         {/* Floating particles */}
//         <span className="absolute left-[12%] top-[14%] h-2 w-2 rounded-full bg-[#38BDF8] animate-ping"></span>
//         <span className="absolute left-[28%] bottom-[18%] h-1.5 w-1.5 rounded-full bg-[#A78BFA] animate-pulse"></span>
//         <span className="absolute left-[52%] top-[22%] h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
//         <span className="absolute left-[66%] bottom-[20%] h-1.5 w-1.5 rounded-full bg-[#A78BFA] animate-ping"></span>
//       </div>

//       {/* Header */}
//       <Header />

//       {/* Main Content Area */}
//       <main className="relative z-10 flex flex-1 flex-col px-5 pb-8 lg:flex-row lg:items-center lg:gap-8 lg:px-10 xl:px-16">
//         {/* Left Side: Ecosystem Visual */}
//         <EcosystemVisual />

//         {/* Right Side: Login Form */}
//         <LoginForm 
//           email={email}
//           setEmail={setEmail}
//           password={password}
//           setPassword={setPassword}
//           showPassword={showPassword}
//           setShowPassword={setShowPassword}
//           rememberMe={rememberMe}
//           setRememberMe={setRememberMe}
//           errorMessage={errorMessage}
//           isSubmitting={isSubmitting}
//           onSubmit={handleSubmit}
//           onForgotPassword={handleForgotPassword}
//         />
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default SuperAdminLogin;



import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../features/auth/auth.slice";
import { UserRole } from "../../types/auth.types";

// ======================================================
// TYPES
// ======================================================

interface StatCardProps {
  type: "students" | "revenue" | "attendance" | "notification";
  className?: string;
}

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  errorMessage: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

// ======================================================
// HEADER
// ======================================================

const Header: React.FC = () => {
  return (
    <header className="relative z-20 flex h-[50px] shrink-0 items-center justify-between px-5 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8] text-[#07152F] shadow-md sm:h-11 sm:w-11">
          <Icon icon="lucide:landmark" className="text-xl sm:text-2xl" />
        </div>

        <div>
          <div className="text-base font-bold tracking-tight text-[#EAF3FF] sm:text-lg">
            School ERP
          </div>

          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A9C0DD] sm:text-[10px]">
            Connected intelligence
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-[#315783] bg-[#0D2345] px-4 py-2 text-xs text-[#A9C0DD] shadow-md md:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]" />
        </span>

        Platform services operational
      </div>
    </header>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard: React.FC<StatCardProps> = ({
  type,
  className = "",
}) => {
  if (type === "students") {
    return (
      <div
        className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] text-[#130B2A]">
            <Icon icon="lucide:users" className="text-lg" />
          </div>

          <div>
            <p className="text-xs text-[#A9C0DD]">
              Students
            </p>

            <p className="text-base font-bold text-[#EAF3FF]">
              1,248
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-end gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#38BDF8]" />
          <span className="h-4 w-2 rounded-sm bg-[#38BDF8]" />
          <span className="h-3 w-2 rounded-sm bg-[#38BDF8]" />
          <span className="h-6 w-2 rounded-sm bg-[#38BDF8]" />
          <span className="h-5 w-2 rounded-sm bg-[#38BDF8]" />
          <span className="h-7 w-2 rounded-sm bg-[#38BDF8] animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === "revenue") {
    return (
      <div
        className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#38BDF8] text-[#07152F]">
            <Icon icon="lucide:indian-rupee" className="text-lg" />
          </div>

          <div>
            <p className="text-xs text-[#A9C0DD]">
              Monthly revenue
            </p>

            <p className="text-base font-bold text-[#EAF3FF]">
              ₹8.46L
            </p>
          </div>
        </div>

        <p className="mt-3 flex items-center text-xs text-[#38BDF8]">
          <Icon icon="lucide:trending-up" className="mr-1" />
          12.8% this month
        </p>
      </div>
    );
  }

  if (type === "attendance") {
    return (
      <div
        className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#A78BFA]">
            <span className="text-[10px] font-bold text-[#EAF3FF]">
              94%
            </span>
          </div>

          <div>
            <p className="text-xs text-[#A9C0DD]">
              Attendance
            </p>

            <p className="text-base font-bold text-[#EAF3FF]">
              94.2%
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "notification") {
    return (
      <div
        className={`rounded-xl border border-[#315783] bg-[#0D2345] p-4 shadow-md ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#142B52]">
            <Icon
              icon="lucide:bell"
              className="text-lg text-[#38BDF8]"
            />

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0D2345] bg-[#A78BFA] animate-pulse" />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#EAF3FF]">
              New school added
            </p>

            <p className="text-[11px] text-[#A9C0DD]">
              Cedar Grove Academy
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ======================================================
// ECOSYSTEM VISUAL
// ======================================================

const EcosystemVisual: React.FC = () => {
  return (
    <section
      className="
        relative
        flex
        min-h-0
        flex-1
        items-center
        justify-center
        overflow-hidden
        lg:justify-start
      "
      aria-label="School ERP connected ecosystem"
    >
      {/* Students */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{
          y: [0, -10, 0],
          opacity: 1,
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[8%] top-[8%] z-20 hidden lg:block xl:left-[13%]"
      >
        <StatCard type="students" />
      </motion.div>

      {/* Revenue */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{
          y: [0, 10, 0],
          opacity: 1,
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[8%] left-[10%] z-20 hidden lg:block xl:left-[16%]"
      >
        <StatCard type="revenue" />
      </motion.div>

      {/* Attendance */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{
          y: [0, -8, 0],
          opacity: 1,
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute right-[2%] top-[10%] z-20 hidden xl:block"
      >
        <StatCard type="attendance" />
      </motion.div>

      {/* Notification */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{
          y: [0, 12, 0],
          opacity: 1,
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-[12%] right-[1%] z-20 hidden xl:block"
      >
        <StatCard type="notification" />
      </motion.div>

      {/* Network */}
      <div className="relative h-[360px] w-full max-w-[680px] sm:h-[400px] lg:h-[440px]">
        {/* Rings */}
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#38BDF8] opacity-20 animate-ping sm:h-56 sm:w-56" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A78BFA] opacity-30 sm:h-80 sm:w-80" />

        {/* Lines */}
        <div className="absolute left-[18%] top-[23%] h-px w-[32%] origin-right rotate-[24deg] bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] opacity-80" />

        <div className="absolute bottom-[22%] left-[21%] h-px w-[30%] origin-right -rotate-[24deg] bg-gradient-to-r from-[#38BDF8] to-[#A78BFA] opacity-80" />

        <div className="absolute right-[19%] top-[24%] h-px w-[31%] origin-left -rotate-[24deg] bg-gradient-to-r from-[#A78BFA] to-[#38BDF8] opacity-80" />

        <div className="absolute bottom-[22%] right-[21%] h-px w-[29%] origin-left rotate-[24deg] bg-gradient-to-r from-[#A78BFA] to-[#38BDF8] opacity-80" />

        {/* Nodes */}
        <div className="absolute left-[38%] top-[31%] h-2 w-2 rounded-full bg-[#38BDF8] shadow-md animate-ping" />

        <div className="absolute bottom-[29%] left-[38%] h-2 w-2 rounded-full bg-[#38BDF8] shadow-md animate-ping" />

        <div className="absolute right-[38%] top-[31%] h-2 w-2 rounded-full bg-[#A78BFA] shadow-md animate-ping" />

        <div className="absolute bottom-[29%] right-[38%] h-2 w-2 rounded-full bg-[#A78BFA] shadow-md animate-ping" />

        {/* Hub */}
        <div className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#38BDF8] bg-[#0D2345] text-center shadow-md animate-pulse sm:h-40 sm:w-40">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#38BDF8] text-[#07152F] sm:h-14 sm:w-14">
            <Icon
              icon="lucide:graduation-cap"
              className="text-2xl sm:text-3xl"
            />
          </div>

          <span className="text-xs font-bold text-[#EAF3FF] sm:text-sm">
            School ERP
          </span>

          <span className="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#38BDF8] sm:text-[10px]">
            Command hub
          </span>
        </div>

        {/* School A */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute left-[5%] top-[10%] flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md sm:h-24 sm:w-24 sm:left-[8%]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142B52] sm:h-10 sm:w-10">
            <Icon
              icon="lucide:building-2"
              className="text-lg text-[#38BDF8] sm:text-xl"
            />
          </div>

          <span className="mt-2 text-[10px] font-semibold text-[#EAF3FF] sm:text-xs">
            School A
          </span>

          <span className="text-[8px] text-[#A9C0DD] sm:text-[10px]">
            Westbridge
          </span>
        </motion.div>

        {/* School B */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-[8%] left-[7%] flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md sm:h-24 sm:w-24 sm:left-[10%]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142B52] sm:h-10 sm:w-10">
            <Icon
              icon="lucide:building-2"
              className="text-lg text-[#38BDF8] sm:text-xl"
            />
          </div>

          <span className="mt-2 text-[10px] font-semibold text-[#EAF3FF] sm:text-xs">
            School B
          </span>

          <span className="text-[8px] text-[#A9C0DD] sm:text-[10px]">
            Northfield
          </span>
        </motion.div>

        {/* School C */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute right-[5%] top-[10%] hidden h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md sm:flex sm:h-24 sm:w-24 sm:right-[8%]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142B52] sm:h-10 sm:w-10">
            <Icon
              icon="lucide:building-2"
              className="text-lg text-[#A78BFA] sm:text-xl"
            />
          </div>

          <span className="mt-2 text-[10px] font-semibold text-[#EAF3FF] sm:text-xs">
            School C
          </span>

          <span className="text-[8px] text-[#A9C0DD] sm:text-[10px]">
            Cedar Grove
          </span>
        </motion.div>

        {/* School D */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-[8%] right-[7%] hidden h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#315783] bg-[#0D2345] shadow-md sm:flex sm:h-24 sm:w-24 sm:right-[10%]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142B52] sm:h-10 sm:w-10">
            <Icon
              icon="lucide:building-2"
              className="text-lg text-[#A78BFA] sm:text-xl"
            />
          </div>

          <span className="mt-2 text-[10px] font-semibold text-[#EAF3FF] sm:text-xs">
            School D
          </span>

          <span className="text-[8px] text-[#A9C0DD] sm:text-[10px]">
            Riverstone
          </span>
        </motion.div>
      </div>
    </section>
  );
};

// ======================================================
// LOGIN FORM
// ======================================================

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  errorMessage,
  isSubmitting,
  onSubmit,
  onForgotPassword,
}) => {
  return (
    <section
      className="
        relative
        z-20
        w-full
        max-w-[460px]
        self-center
        rounded-2xl
        border
        border-[#315783]
        bg-[#0D2345]
        p-5
        shadow-md
        sm:p-7
        lg:mr-2
        lg:p-8
      "
      aria-labelledby="login-title"
    >
      <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#0D2345] to-[#A78BFA] opacity-30 blur-md" />

      <div className="mb-5 flex items-start justify-between sm:mb-7">
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#38BDF8] sm:text-[10px]">
            Super Admin Portal
          </p>

          <h1
            id="login-title"
            className="text-xl font-bold tracking-tight text-[#EAF3FF] sm:text-2xl"
          >
            Welcome Back
          </h1>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#A9C0DD] sm:text-sm sm:leading-6">
            Sign in to manage your entire School ERP platform.
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#142B52] text-[#38BDF8] sm:h-10 sm:w-10">
          <Icon icon="lucide:shield-check" className="text-lg sm:text-xl" />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 sm:space-y-5"
        aria-label="Super Admin sign in form"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold text-[#EAF3FF] sm:text-sm"
          >
            Email Address
          </label>

          <div className="group flex min-h-11 items-center gap-3 rounded-xl border border-[#244A77] bg-[#07152F] px-4 transition duration-300 focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#38BDF8] focus-within:ring-offset-2 focus-within:ring-offset-[#0D2345] sm:min-h-12">
            <Icon
              icon="lucide:mail"
              className="text-base text-[#A9C0DD] transition duration-300 group-focus-within:text-[#38BDF8] sm:text-lg"
            />

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-xs text-[#EAF3FF] outline-none placeholder:text-[#A9C0DD] sm:text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#EAF3FF] sm:text-sm"
            >
              Password
            </label>

            <span className="text-[10px] text-[#A9C0DD] sm:text-xs">
              Secure access
            </span>
          </div>

          <div className="group flex min-h-11 items-center gap-3 rounded-xl border border-[#244A77] bg-[#07152F] px-4 transition duration-300 focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#38BDF8] focus-within:ring-offset-2 focus-within:ring-offset-[#0D2345] sm:min-h-12">
            <Icon
              icon="lucide:lock-keyhole"
              className="text-base text-[#A9C0DD] transition duration-300 group-focus-within:text-[#38BDF8] sm:text-lg"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-xs text-[#EAF3FF] outline-none placeholder:text-[#A9C0DD] sm:text-sm"
            />

            <button
              type="button"
              aria-label="Show password"
              onClick={() => setShowPassword(!showPassword)}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#A9C0DD] transition hover:bg-[#142B52] hover:text-[#38BDF8]"
            >
              <Icon
                icon={
                  showPassword
                    ? "lucide:eye-off"
                    : "lucide:eye"
                }
                className="text-lg"
              />
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[#A9C0DD] select-none sm:text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
              className="h-4 w-4 rounded border-[#244A77] bg-[#07152F] accent-[#38BDF8]"
            />

            Remember me
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="min-h-10 text-xs font-semibold text-[#38BDF8] transition hover:text-[#EAF3FF] sm:text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="flex items-center gap-2 rounded-xl border border-[#C47C91] bg-[#102444] px-4 py-3 text-xs text-[#A9C0DD] sm:text-sm"
              role="alert"
            >
              <Icon
                icon="lucide:circle-alert"
                className="shrink-0 text-lg text-[#C47C91]"
              />

              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#38BDF8]
            px-5
            py-3
            text-sm
            font-bold
            text-[#07152F]
            shadow-md
            transition
            duration-300
            hover:-translate-y-0.5
            hover:shadow-lg
            focus:outline-none
            focus:ring-2
            focus:ring-[#38BDF8]
            focus:ring-offset-2
            focus:ring-offset-[#0D2345]
            active:translate-y-0
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {isSubmitting ? (
            <>
              <Icon
                icon="lucide:loader-2"
                className="text-lg animate-spin"
              />

              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>

              <Icon
                icon="lucide:arrow-right"
                className="text-lg"
              />
            </>
          )}
        </button>
      </form>

      {/* Security */}
      <div className="mt-5 flex items-center gap-3 text-[10px] text-[#A9C0DD] sm:mt-6 sm:text-xs">
        <div className="h-px flex-1 bg-[#315783]" />

        <span className="flex shrink-0 items-center gap-1">
          <Icon icon="lucide:lock" className="text-sm" />
          Enterprise-grade security
        </span>

        <div className="h-px flex-1 bg-[#315783]" />
      </div>

      {/* Status */}
      <div className="mt-4 rounded-xl bg-[#142B52] p-3 sm:mt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1B3E6D] text-[#38BDF8]">
            <Icon
              icon="lucide:activity"
              className="text-base"
            />
          </div>

          <p className="text-[10px] leading-4 text-[#A9C0DD] sm:text-xs sm:leading-5">
            <span className="font-semibold text-[#EAF3FF]">
              Live ecosystem:
            </span>{" "}
            24 schools securely connected to your command center.
          </p>
        </div>
      </div>
    </section>
  );
};

// ======================================================
// FOOTER
// ======================================================

const Footer: React.FC = () => {
  return (
    <footer
      className="
        relative
        z-10
        flex
        h-[54px]
        shrink-0
        flex-col
        items-center
        justify-center
        gap-1
        px-5
        text-center
        text-[10px]
        text-[#A9C0DD]
        sm:h-[58px]
        sm:flex-row
        sm:justify-between
        sm:px-6
        sm:text-xs
        lg:px-10
      "
    >
      <span>
        © 2025 School ERP. Built for connected education.
      </span>

      <div className="flex justify-center gap-4">
        <a
          href="#"
          className="transition hover:text-[#38BDF8]"
        >
          Privacy
        </a>

        <a
          href="#"
          className="transition hover:text-[#38BDF8]"
        >
          Security
        </a>

        <a
          href="#"
          className="transition hover:text-[#38BDF8]"
        >
          Support
        </a>
      </div>
    </footer>
  );
};

// ======================================================
// MAIN LOGIN PAGE
// ======================================================

const SuperAdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await dispatch(
      login({
        email,
        password,
      })
    );

    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;

      if (role === UserRole.SUPER_ADMIN) {
        navigate("/super-admin/dashboard");
      } else if (
        role === UserRole.SCHOOL_ADMIN
      ) {
        navigate("/school-admin/dashboard");
      }

      setEmail("");
      setPassword("");
      setErrorMessage(null);
    } else {
      setErrorMessage(
        error ||
          "Invalid email or password. Please try again."
      );
    }

    setIsSubmitting(false);
  };

  const handleForgotPassword = () => {
    if (!email) {
      setErrorMessage(
        "Please enter your email address first to recover your password."
      );
      return;
    }

    setErrorMessage(null);

    alert(
      `Password recovery link has been sent to: ${email}`
    );
  };

  return (
    <div
      className="
        relative
        flex
        h-[100dvh]
        w-full
        flex-col
        overflow-hidden
        bg-[#07152F]
        text-[#EAF3FF]
      "
    >
      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-[#38BDF8] opacity-10 blur-3xl animate-pulse" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#A78BFA] opacity-10 blur-3xl animate-pulse" />

        <div className="absolute right-1/3 top-20 h-72 w-72 rounded-full bg-[#1B3E6D] opacity-60 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#07152F] via-[#07152F] to-[#142B52] opacity-20" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#315783_1px,transparent_0)] bg-[size:28px_28px] opacity-30" />

        {/* Particles */}
        <span className="absolute left-[12%] top-[14%] h-2 w-2 rounded-full bg-[#38BDF8] animate-ping" />

        <span className="absolute bottom-[18%] left-[28%] h-1.5 w-1.5 rounded-full bg-[#A78BFA] animate-pulse" />

        <span className="absolute left-[52%] top-[22%] h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />

        <span className="absolute bottom-[20%] left-[66%] h-1.5 w-1.5 rounded-full bg-[#A78BFA] animate-ping" />
      </div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <Header />

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="
          relative
          z-10
          flex
          min-h-0
          flex-1
          flex-col
          overflow-hidden
          px-4
          pb-2
          sm:px-5
          lg:flex-row
          lg:items-center
          lg:gap-6
          lg:px-8
          xl:gap-8
          xl:px-12
          2xl:px-16
        "
      >
        {/* Left */}
        <EcosystemVisual />

        {/* Right */}
        <div className="flex min-h-0 w-full shrink-0 items-center justify-center lg:w-[430px] xl:w-[460px]">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />
    </div>
  );
};

export default SuperAdminLogin;