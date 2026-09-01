


// import React, { useEffect, useState, useRef } from "react";
// import Editor from "../components/Editor";

// import {
//   FileSpreadsheet,
//   Grid,
//   Trash2,
//   Pencil,
//   ArrowLeft,
//   Plus,
//   CheckCircle2,
// } from "lucide-react";

// type Section = {
//   type: string;
//   content?: string;
//   content2?: string;
//   image?: string;
//   image2?: string;
//   image_public_id?: string;
//   image2_public_id?: string;
// };

// type Post = {
//   id: string;
//   title: string;
//   date: string;
//   sections: Section[];
// };

// const layouts = {
//   left: [
//     { type: "text", label: "Full Text" },
//     { type: "subtitle", label: "Subtitle" },
//     { type: "two-text", label: "Left Text - Right Text" },
//   ],

//   center: [
//     { type: "image-left", label: "Left Image - Right Text" },
//     { type: "image-right", label: "Left Text - Right Image" },
//   ],

//   right: [
//     { type: "full-image", label: "Full Image" },
//     { type: "two-image", label: "Left Image - Right Image" },
//   ],
// };

// export default function NewsList() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   const [editTitle, setEditTitle] = useState("");
//   const [editSections, setEditSections] = useState<Section[]>([]);

//   const [autoSaving, setAutoSaving] = useState(false);

//   const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

//   const fetchPosts = async () => {
//     setLoading(true);

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/news`);
//       const data = await res.json();

//       setPosts(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // OPEN EDITOR
//   const openEditor = (post: Post) => {
//     setSelectedPost(post);
//     setEditTitle(post.title || "");
//     setEditSections(post.sections || []);
//   };

//   // CLOSE EDITOR
//   const closeEditor = () => {
//     setSelectedPost(null);
//     setEditTitle("");
//     setEditSections([]);
//   };

//   // DELETE IMAGE FROM CLOUDINARY
//   const deleteCloudinaryImage = async (public_id?: string) => {
//     if (!public_id) return;

//     try {
//       await fetch(`${import.meta.env.VITE_API_URL}/delete-image`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           public_id,
//         }),
//       });
//     } catch (err) {
//       console.log("Delete failed", err);
//     }
//   };

//   // AUTO SAVE
//   const autoSaveArticle = async (
//     titleData: string,
//     sectionsData: Section[]
//   ) => {
//     if (!selectedPost) return;

//     try {
//       setAutoSaving(true);

//       await fetch(
//         `${import.meta.env.VITE_API_URL}/update/${selectedPost.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title: titleData,
//             sections: sectionsData,
//           }),
//         }
//       );

//       fetchPosts();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setTimeout(() => {
//         setAutoSaving(false);
//       }, 500);
//     }
//   };

//   // TRIGGER AUTO SAVE
//   const triggerAutoSave = (
//     titleData: string,
//     sectionsData: Section[]
//   ) => {
//     if (autoSaveTimeout.current) {
//       clearTimeout(autoSaveTimeout.current);
//     }

//     autoSaveTimeout.current = setTimeout(() => {
//       autoSaveArticle(titleData, sectionsData);
//     }, 1200);
//   };

//   // REMOVE SECTION
//   const removeSection = async (index: number) => {
//     const sec = editSections[index];

//     // DELETE IMAGE 1
//     if (sec?.image_public_id) {
//       await deleteCloudinaryImage(sec.image_public_id);
//     }

//     // DELETE IMAGE 2
//     if (sec?.image2_public_id) {
//       await deleteCloudinaryImage(sec.image2_public_id);
//     }

//     const updated = editSections.filter((_, i) => i !== index);

//     setEditSections(updated);

//     triggerAutoSave(editTitle, updated);
//   };

//   // UPDATE SECTION
//   const updateSection = (
//     index: number,
//     field: keyof Section,
//     value: string
//   ) => {
//     const updated = [...editSections];

//     updated[index] = {
//       ...updated[index],
//       [field]: value,
//     };

//     setEditSections(updated);

//     triggerAutoSave(editTitle, updated);
//   };

//   // UPDATE TITLE
//   const handleTitleChange = (value: string) => {
//     setEditTitle(value);

//     triggerAutoSave(value, editSections);
//   };

//   // ADD SECTION
//   const addSection = (type: string) => {
//     const updated = [
//       ...editSections,
//       {
//         type,
//         content: "",
//         content2: "",
//         image: "",
//         image2: "",
//       },
//     ];

//     setEditSections(updated);

//     triggerAutoSave(editTitle, updated);
//   };

//   // UPLOAD IMAGE
//   const uploadToCloudinary = async (file: File) => {
//     const formData = new FormData();

//     formData.append("file", file);
//     formData.append("upload_preset", "candid_upload");

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/dsxlj3waa/image/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();

//     return {
//       url: data.secure_url,
//       public_id: data.public_id,
//     };
//   };

//   // DELETE ARTICLE
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Delete this article?")) return;

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/delete/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (res.ok) {
//         setPosts((prev) => prev.filter((p) => p.id !== id));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const imageClass =
//     "w-full h-auto object-contain rounded-2xl border border-slate-200 bg-white";

//   const uploadInputClass =
//     "w-full border border-slate-200 bg-white rounded-2xl px-4 py-4 text-slate-700 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-xl file:bg-[#1f7a45] file:text-white file:font-semibold";




























//   /*
//   ==========================================================
//   EDITOR MODE
//   ==========================================================
//   */

//   if (selectedPost) {
//     return (
//       <div className="w-full flex justify-center relative overflow-hidden rounded-[2rem] border border-black min-h-screen bg-[#edf4ef]">

//         <div className="w-full max-w-[1600px] p-6 md:p-10">

//           {/* TOP */}
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-10">

//             <div>
//               <button
//                 onClick={closeEditor}
//                 className="flex items-center gap-2 text-slate-600 hover:text-black transition-all mb-5"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 Back to Articles
//               </button>

//               <h1 className="text-5xl font-black text-[#0f172a]">
//                 Edit Article
//               </h1>
//             </div>

//             {/* AUTO SAVE STATUS */}
//             <div
//               className="
//                 flex items-center gap-3
//                 px-6 py-4
//                 rounded-2xl
//                 bg-white
//                 border border-slate-200
//                 shadow-lg
//               "
//             >
//               <CheckCircle2
//                 className={`w-5 h-5 ${
//                   autoSaving
//                     ? "text-orange-500 animate-pulse"
//                     : "text-green-600"
//                 }`}
//               />

//               <span className="font-semibold text-slate-700">
//                 {autoSaving ? "Auto Saving..." : "Auto Saved"}
//               </span>
//             </div>
//           </div>

//           {/* TITLE */}
//           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-lg mb-10">

//             <label className="block text-sm font-bold text-slate-700 mb-4">
//               Article Title
//             </label>

//             <input
//               value={editTitle}
//               onChange={(e) => handleTitleChange(e.target.value)}
//               className="
//                 w-full
//                 border border-slate-200
//                 bg-[#f8fafc]
//                 rounded-2xl
//                 px-6 py-5
//                 text-lg
//                 text-slate-800
//                 focus:outline-none
//               "
//             />
//           </div>

//           {/* ADD SECTION */}
//           <div className="grid lg:grid-cols-3 gap-6 mb-12">

//             {[...layouts.left, ...layouts.center, ...layouts.right].map(
//               (l, i) => (
//                 <button
//                   key={i}
//                   onClick={() => addSection(l.type)}
//                   className="
//                     flex items-center justify-center gap-3
//                     w-full
//                     px-5 py-4
//                     rounded-2xl
//                     bg-[#1f7a45]
//                     text-white
//                     font-semibold
//                     hover:bg-[#17663a]
//                     transition-all
//                   "
//                 >
//                   <Plus className="w-5 h-5" />
//                   {l.label}
//                 </button>
//               )
//             )}
//           </div>

//           {/* SECTIONS */}
//           <div className="space-y-10">

//             {editSections.map((sec, i) => (
//               <div
//                 key={i}
//                 className="
//                   relative
//                   bg-white
//                   rounded-[2rem]
//                   border border-slate-200
//                   p-8
//                   shadow-lg
//                 "
//               >

//                 {/* DELETE */}
//                 <button
//                   onClick={() => removeSection(i)}
//                   className="
//                     absolute top-5 right-5
//                     w-11 h-11 rounded-full
//                     bg-red-50
//                     text-red-500
//                     hover:bg-red-500 hover:text-white
//                     transition-all
//                     flex items-center justify-center
//                   "
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>

//                 {/* TYPE */}
//                 <div className="mb-8">
//                   <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold capitalize">
//                     {sec.type.replace(/-/g, " ")}
//                   </span>
//                 </div>

//                 {/* TEXT */}
//                 {(sec.type === "text" || sec.type === "subtitle") && (
//                   <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
//                     <Editor
//                       value={sec.content || ""}
//                       onChange={(val) =>
//                         updateSection(i, "content", val)
//                       }
//                     />
//                   </div>
//                 )}

//                 {/* TWO TEXT */}
//                 {sec.type === "two-text" && (
//                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
//                       <Editor
//                         value={sec.content || ""}
//                         onChange={(val) =>
//                           updateSection(i, "content", val)
//                         }
//                       />
//                     </div>

//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
//                       <Editor
//                         value={sec.content2 || ""}
//                         onChange={(val) =>
//                           updateSection(i, "content2", val)
//                         }
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* FULL IMAGE */}
//                 {sec.type === "full-image" && (
//                   <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

//                     <input
//                       type="file"
//                       className={uploadInputClass}
//                       onChange={async (e) => {
//                         const file = e.target.files?.[0];

//                         if (!file) return;

//                         const updated = [...editSections];

//                         // DELETE OLD IMAGE
//                         if (updated[i]?.image_public_id) {
//                           await deleteCloudinaryImage(
//                             updated[i].image_public_id
//                           );
//                         }

//                         // UPLOAD NEW IMAGE
//                         const data = await uploadToCloudinary(file);

//                         updated[i] = {
//                           ...updated[i],
//                           image: data.url,
//                           image_public_id: data.public_id,
//                         };

//                         setEditSections(updated);

//                         triggerAutoSave(editTitle, updated);
//                       }}
//                     />

//                     {sec.image && (
//                       <div className="mt-5">
//                         <img
//                           src={sec.image}
//                           alt=""
//                           className={imageClass}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* IMAGE LEFT */}
//                 {sec.type === "image-left" && (
//                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

//                       <input
//                         type="file"
//                         className={uploadInputClass}
//                         onChange={async (e) => {
//                           const file = e.target.files?.[0];

//                           if (!file) return;

//                           const updated = [...editSections];

//                           // DELETE OLD IMAGE
//                           if (updated[i]?.image_public_id) {
//                             await deleteCloudinaryImage(
//                               updated[i].image_public_id
//                             );
//                           }

//                           // UPLOAD NEW IMAGE
//                           const data = await uploadToCloudinary(file);

//                           updated[i] = {
//                             ...updated[i],
//                             image: data.url,
//                             image_public_id: data.public_id,
//                           };

//                           setEditSections(updated);

//                           triggerAutoSave(editTitle, updated);
//                         }}
//                       />

//                       {sec.image && (
//                         <div className="mt-5">
//                           <img
//                             src={sec.image}
//                             alt=""
//                             className={imageClass}
//                           />
//                         </div>
//                       )}
//                     </div>

//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
//                       <Editor
//                         value={sec.content || ""}
//                         onChange={(val) =>
//                           updateSection(i, "content", val)
//                         }
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* TWO IMAGE */}
//                 {sec.type === "two-image" && (
//                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

//                     {/* LEFT IMAGE */}
//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

//                       <input
//                         type="file"
//                         className={uploadInputClass}
//                         onChange={async (e) => {
//                           const file = e.target.files?.[0];

//                           if (!file) return;

//                           const updated = [...editSections];

//                           // DELETE OLD IMAGE
//                           if (updated[i]?.image_public_id) {
//                             await deleteCloudinaryImage(
//                               updated[i].image_public_id
//                             );
//                           }

//                           // UPLOAD NEW IMAGE
//                           const data = await uploadToCloudinary(file);

//                           updated[i] = {
//                             ...updated[i],
//                             image: data.url,
//                             image_public_id: data.public_id,
//                           };

//                           setEditSections(updated);

//                           triggerAutoSave(editTitle, updated);
//                         }}
//                       />

//                       {sec.image && (
//                         <div className="mt-5">
//                           <img
//                             src={sec.image}
//                             alt=""
//                             className={imageClass}
//                           />
//                         </div>
//                       )}
//                     </div>

//                     {/* RIGHT IMAGE */}




















//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

//                       <input
//                         type="file"
//                         className={uploadInputClass}
//                         onChange={async (e) => {
//                           const file = e.target.files?.[0];

//                           if (!file) return;

//                           const updated = [...editSections];

//                           // DELETE OLD IMAGE
//                           if (updated[i]?.image2_public_id) {
//                             await deleteCloudinaryImage(
//                               updated[i].image2_public_id
//                             );
//                           }

//                           // UPLOAD NEW IMAGE
//                           const data = await uploadToCloudinary(file);

//                           updated[i] = {
//                             ...updated[i],
//                             image2: data.url,
//                             image2_public_id: data.public_id,
//                           };

//                           setEditSections(updated);

//                           triggerAutoSave(editTitle, updated);
//                         }}
//                       />

//                       {sec.image2 && (
//                         <div className="mt-5">
//                           <img
//                             src={sec.image2}
//                             alt=""
//                             className={imageClass}
//                           />
//                         </div>
//                       )}
//                     </div>

//                   </div>
//                 )}

//                 {/* IMAGE RIGHT */}
//                 {sec.type === "image-right" && (
//                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 order-2 xl:order-1">
//                       <Editor
//                         value={sec.content || ""}
//                         onChange={(val) =>
//                           updateSection(i, "content", val)
//                         }
//                       />
//                     </div>

//                     <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5 order-1 xl:order-2">

//                       <input
//                         type="file"
//                         className={uploadInputClass}
//                         onChange={async (e) => {
//                           const file = e.target.files?.[0];

//                           if (!file) return;

//                           const updated = [...editSections];

//                           // DELETE OLD IMAGE
//                           if (updated[i]?.image_public_id) {
//                             await deleteCloudinaryImage(
//                               updated[i].image_public_id
//                             );
//                           }

//                           // UPLOAD NEW IMAGE
//                           const data = await uploadToCloudinary(file);

//                           updated[i] = {
//                             ...updated[i],
//                             image: data.url,
//                             image_public_id: data.public_id,
//                           };

//                           setEditSections(updated);

//                           triggerAutoSave(editTitle, updated);
//                         }}
//                       />

//                       {sec.image && (
//                         <div className="mt-5">
//                           <img
//                             src={sec.image}
//                             alt=""
//                             className={imageClass}
//                           />
//                         </div>
//                       )}

//                     </div>

//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /*
//   ==========================================================
//   LIST MODE
//   ==========================================================
//   */

//   return (
//     <div className="w-full flex justify-center text-gray-800 overflow-hidden relative rounded-[2rem] border border-black min-h-[50vh] bg-[#edf4ef]">

//       <div className="w-full p-5 md:p-8">

//         {/* HEADER */}
//         <div className="bg-[#1f7a45] rounded-t-2xl flex items-center px-5 py-4 text-white justify-between">

//           <div className="flex items-center gap-3">
//             <FileSpreadsheet size={18} />

//             <span className="font-semibold text-sm">
//               Candid Articles Manager
//             </span>
//           </div>

//           <div className="flex items-center gap-2 text-sm">
//             <Grid size={16} />
//             Connected to MongoDB
//           </div>
//         </div>

//         {/* BODY */}
//         <div className="bg-white rounded-b-2xl p-8">

//           {loading ? (
//             <div className="text-center py-20 text-slate-500">
//               Loading Articles...
//             </div>
//           ) : posts.length === 0 ? (
//             <div className="text-center py-20 text-slate-500">
//               No Articles Found
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

//               {posts.map((post) => (
//                 <div
//                   key={post.id}
//                   className="
//                     bg-[#f8fafc]
//                     rounded-[2rem]
//                     border border-slate-200
//                     overflow-hidden
//                     shadow-lg
//                     hover:shadow-2xl
//                     transition-all
//                   "
//                 >

//                   {/* IMAGE */}
//                   <div className="h-[220px] bg-slate-100 overflow-hidden">

//                     {post.sections?.find((s) => s.image)?.image ? (
//                       <img
//                         src={
//                           post.sections.find((s) => s.image)?.image
//                         }
//                         alt=""
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-slate-400">
//                         No Image
//                       </div>
//                     )}
//                   </div>

//                   {/* CONTENT */}
//                   <div className="p-6">

//                     <h2 className="text-2xl font-black text-[#0f172a] line-clamp-2">
//                       {post.title}
//                     </h2>

//                     <p className="text-sm text-slate-500 mt-3">
//                       {new Date(post.date).toLocaleDateString()}
//                     </p>

//                     <div className="mt-6 flex gap-3">

//                       <button
//                         onClick={() => openEditor(post)}
//                         className="
//                           flex-1
//                           flex items-center justify-center gap-2
//                           px-4 py-3
//                           rounded-2xl
//                           bg-[#1f7a45]
//                           hover:bg-[#17663a]
//                           text-white
//                           font-semibold
//                           transition-all
//                         "
//                       >
//                         <Pencil className="w-4 h-4" />
//                         Open Editor
//                       </button>

//                       <button
//                         onClick={() => handleDelete(post.id)}
//                         className="
//                           w-14
//                           rounded-2xl
//                           bg-red-50
//                           hover:bg-red-500
//                           text-red-500
//                           hover:text-white
//                           transition-all
//                           flex items-center justify-center
//                         "
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>

//                     </div>
//                   </div>
//                 </div>
//               ))}

//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Editor from "../components/Editor";

import {
  FileSpreadsheet,
  Grid,
  Trash2,
  Pencil,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Upload,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Send,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ContentStatus =
  | "draft"
  | "published";

type ContentFilter =
  | "all"
  | "articles"
  | "draft"
  | "published";

type Section = {
  id?: string;

  type: string;

  content?: string;
  content2?: string;

  image?: string;
  image2?: string;

  image_public_id?: string;
  image2_public_id?: string;
};

type Post = {
  id: string;

  title: string;

  date: string;

  sections: Section[];

  /*
   * Old articles may not have status.
   * Those are treated as published.
   */
  status?: ContentStatus;
};

/* =========================================================
   LAYOUTS
========================================================= */

const layouts = {
  left: [
    {
      type: "text",
      label: "Full Text",
    },
    {
      type: "subtitle",
      label: "Subtitle",
    },
    {
      type: "two-text",
      label: "Left Text - Right Text",
    },
  ],

  center: [
    {
      type: "image-left",
      label: "Left Image - Right Text",
    },
    {
      type: "image-right",
      label: "Left Text - Right Image",
    },
  ],

  right: [
    {
      type: "full-image",
      label: "Full Image",
    },
    {
      type: "two-image",
      label: "Left Image - Right Image",
    },
  ],
};

/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL;

/* =========================================================
   HELPERS
========================================================= */

const getStatus = (
  post: Post
): ContentStatus => {
  /*
   * Old articles created before the
   * draft feature do not have status.
   *
   * Treat them as published.
   */
  return post.status === "draft"
    ? "draft"
    : "published";
};

/* =========================================================
   COMPONENT
========================================================= */

export default function NewsList() {

  /* =======================================================
     LIST STATE
  ======================================================= */

  const [
    posts,
    setPosts,
  ] = useState<Post[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    contentFilter,
    setContentFilter,
  ] = useState<ContentFilter>("all");

  /* =======================================================
     EDITOR STATE
  ======================================================= */

  const [
    selectedPost,
    setSelectedPost,
  ] = useState<Post | null>(null);

  const [
    editTitle,
    setEditTitle,
  ] = useState("");

  const [
    editSections,
    setEditSections,
  ] = useState<Section[]>([]);

  /* =======================================================
     SAVE / PUBLISH STATE
  ======================================================= */

  const [
    autoSaving,
    setAutoSaving,
  ] = useState(false);

  const [
    publishingPost,
    setPublishingPost,
  ] = useState(false);

  /* =======================================================
     DELETE STATE
  ======================================================= */

  const [
    deletingPost,
    setDeletingPost,
  ] = useState(false);

  /* =======================================================
     AUTOSAVE REF
  ======================================================= */

  const autoSaveTimeout =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  /* =========================================================
     FETCH ARTICLES
  ========================================================= */

  const fetchPosts = async () => {

    setLoading(true);

    try {

      const res = await fetch(
        `${API_URL}/news`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch articles."
        );
      }

      const data =
        await res.json();

      setPosts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "FETCH ARTICLES ERROR:",
        err
      );

      setPosts([]);

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    fetchPosts();

    return () => {

      if (
        autoSaveTimeout.current
      ) {

        clearTimeout(
          autoSaveTimeout.current
        );

      }

    };

  }, []);

  /* =========================================================
     FILTERED ARTICLES
  ========================================================= */

  const filteredPosts =
    posts.filter((post) => {

      if (
        contentFilter === "all"
      ) {
        return true;
      }

      if (
        contentFilter === "articles"
      ) {
        return true;
      }

      if (
        contentFilter === "draft"
      ) {
        return (
          getStatus(post) ===
          "draft"
        );
      }

      if (
        contentFilter === "published"
      ) {
        return (
          getStatus(post) ===
          "published"
        );
      }

      return true;
    });

  /* =========================================================
     COUNTS
  ========================================================= */

  const articleCount =
    posts.length;

  const draftCount =
    posts.filter(
      (post) =>
        getStatus(post) ===
        "draft"
    ).length;

  const publishedCount =
    posts.filter(
      (post) =>
        getStatus(post) ===
        "published"
    ).length;

  /* =========================================================
     OPEN EDITOR
  ========================================================= */

  const openEditor = (
    post: Post
  ) => {

    /*
     * Cancel previous autosave.
     */

    if (
      autoSaveTimeout.current
    ) {

      clearTimeout(
        autoSaveTimeout.current
      );

      autoSaveTimeout.current =
        null;
    }

    setSelectedPost(post);

    setEditTitle(
      post.title || ""
    );

    setEditSections(
      (post.sections || []).map(
        (section) => ({
          ...section,

          id:
            section.id ||
            crypto.randomUUID(),
        })
      )
    );

    setAutoSaving(false);
  };

  /* =========================================================
     CLOSE EDITOR
  ========================================================= */

  const closeEditor = () => {

    if (
      autoSaveTimeout.current
    ) {

      clearTimeout(
        autoSaveTimeout.current
      );

      autoSaveTimeout.current =
        null;
    }

    setSelectedPost(null);

    setEditTitle("");

    setEditSections([]);

    setAutoSaving(false);

    setPublishingPost(false);
  };

  /* =========================================================
     DELETE CLOUDINARY IMAGE
  ========================================================= */

  const deleteCloudinaryImage =
    async (
      public_id?: string
    ) => {

      if (!public_id) {
        return;
      }

      try {

        await fetch(
          `${API_URL}/delete-image`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              public_id,
            }),
          }
        );

      } catch (err) {

        console.error(
          "CLOUDINARY DELETE ERROR:",
          err
        );

      }
    };

  /* =========================================================
     SAVE ARTICLE NOW
  ========================================================= */

  const saveContentNow =
    async (
      titleData: string,
      sectionsData: Section[],
      postOverride?: Post
    ) => {

      const post =
        postOverride ||
        selectedPost;

      if (!post) {
        return false;
      }

      try {

        setAutoSaving(true);

        const response =
          await fetch(
            `${API_URL}/update/${post.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                title:
                  titleData,

                sections:
                  sectionsData,
              }),
            }
          );

        if (!response.ok) {

          let data: any = null;

          try {
            data =
              await response.json();
          } catch {
            data = null;
          }

          throw new Error(
            data?.detail ||
              data?.error ||
              "Failed to save article."
          );
        }

        /*
         * Keep editor/list data in sync locally.
         *
         * IMPORTANT:
         * Do not modify status here.
         * Saving content and changing status
         * are two separate operations.
         */

        setPosts((prev) =>
          prev.map((item) =>
            item.id === post.id
              ? {
                  ...item,
                  title:
                    titleData,
                  sections:
                    sectionsData,
                }
              : item
          )
        );

        return true;

      } catch (err) {

        console.error(
          "SAVE ARTICLE ERROR:",
          err
        );

        return false;

      } finally {

        setTimeout(() => {
          setAutoSaving(false);
        }, 500);

      }
    };

  /* =========================================================
     AUTO SAVE
  ========================================================= */

  const autoSaveArticle =
    async (
      titleData: string,
      sectionsData: Section[]
    ) => {

      if (!selectedPost) {
        return;
      }

      await saveContentNow(
        titleData,
        sectionsData,
        selectedPost
      );
    };

  /* =========================================================
     TRIGGER AUTO SAVE
  ========================================================= */

  const triggerAutoSave = (
    titleData: string,
    sectionsData: Section[]
  ) => {

    if (
      autoSaveTimeout.current
    ) {

      clearTimeout(
        autoSaveTimeout.current
      );
    }

    autoSaveTimeout.current =
      setTimeout(() => {

        autoSaveArticle(
          titleData,
          sectionsData
        );

      }, 1200);
  };

  /* =========================================================
     UPDATE SECTION
  ========================================================= */

  const updateSection = (
    index: number,
    field: keyof Section,
    value: string
  ) => {

    const updated = [
      ...editSections,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setEditSections(updated);

    triggerAutoSave(
      editTitle,
      updated
    );
  };

  /* =========================================================
     UPDATE TITLE
  ========================================================= */

  const handleTitleChange = (
    value: string
  ) => {

    setEditTitle(value);

    triggerAutoSave(
      value,
      editSections
    );
  };

  /* =========================================================
     ADD SECTION
  ========================================================= */

  const addSection = (
    type: string
  ) => {

    const newSection: Section = {

      id:
        crypto.randomUUID(),

      type,

      content: "",

      content2: "",

      image: "",

      image2: "",

      image_public_id: "",

      image2_public_id: "",
    };

    const updated = [
      ...editSections,
      newSection,
    ];

    setEditSections(updated);

    triggerAutoSave(
      editTitle,
      updated
    );
  };

  /* =========================================================
     MOVE SECTION
  ========================================================= */

  const moveSection = (
    index: number,
    direction:
      | "up"
      | "down"
  ) => {

    const updated = [
      ...editSections,
    ];

    if (
      direction === "up" &&
      index > 0
    ) {

      [
        updated[index],
        updated[index - 1],
      ] = [
        updated[index - 1],
        updated[index],
      ];
    }

    if (
      direction === "down" &&
      index <
        updated.length - 1
    ) {

      [
        updated[index],
        updated[index + 1],
      ] = [
        updated[index + 1],
        updated[index],
      ];
    }

    setEditSections(updated);

    triggerAutoSave(
      editTitle,
      updated
    );
  };

  /* =========================================================
     REMOVE SECTION
  ========================================================= */

  const removeSection =
    async (
      index: number
    ) => {

      const section =
        editSections[index];

      if (
        section?.image_public_id
      ) {

        await deleteCloudinaryImage(
          section.image_public_id
        );
      }

      if (
        section?.image2_public_id
      ) {

        await deleteCloudinaryImage(
          section.image2_public_id
        );
      }

      const updated =
        editSections.filter(
          (_, i) =>
            i !== index
        );

      setEditSections(updated);

      triggerAutoSave(
        editTitle,
        updated
      );
    };

  /* =========================================================
     UPLOAD TO CLOUDINARY
  ========================================================= */

  const uploadToCloudinary =
    async (
      file: File
    ) => {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        "candid_upload"
      );

      const res =
        await fetch(
          "https://api.cloudinary.com/v1_1/dsxlj3waa/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      if (!res.ok) {

        throw new Error(
          "Cloudinary upload failed."
        );
      }

      const data =
        await res.json();

      return {
        url:
          data.secure_url,

        public_id:
          data.public_id,
      };
    };

  /* =========================================================
     HANDLE IMAGE UPLOAD
  ========================================================= */

  const handleImageUpload =
    async (
      index: number,
      file: File,
      imageNumber: 1 | 2
    ) => {

      try {

        const updated = [
          ...editSections,
        ];

        const oldSection =
          updated[index];

        /*
         * Delete old image.
         */

        if (
          imageNumber === 1 &&
          oldSection?.image_public_id
        ) {

          await deleteCloudinaryImage(
            oldSection.image_public_id
          );
        }

        if (
          imageNumber === 2 &&
          oldSection?.image2_public_id
        ) {

          await deleteCloudinaryImage(
            oldSection.image2_public_id
          );
        }

        /*
         * Upload new image.
         */

        const data =
          await uploadToCloudinary(
            file
          );

        if (
          imageNumber === 1
        ) {

          updated[index] = {
            ...updated[index],

            image:
              data.url,

            image_public_id:
              data.public_id,
          };

        } else {

          updated[index] = {
            ...updated[index],

            image2:
              data.url,

            image2_public_id:
              data.public_id,
          };
        }

        setEditSections(updated);

        triggerAutoSave(
          editTitle,
          updated
        );

      } catch (err) {

        console.error(
          "IMAGE UPLOAD ERROR:",
          err
        );

        alert(
          "Failed to upload image."
        );
      }
    };

  /* =========================================================
     DELETE ARTICLE
  ========================================================= */

  const handleDelete =
    async (
      id: string
    ) => {

      if (deletingPost) {
        return;
      }

      if (
        !window.confirm(
          "Delete this article? This action cannot be undone."
        )
      ) {
        return;
      }

      try {

        setDeletingPost(true);

        const res =
          await fetch(
            `${API_URL}/delete/${id}`,
            {
              method: "DELETE",
            }
          );

        let data: any = null;

        try {

          data =
            await res.json();

        } catch {

          data = null;

        }

        if (!res.ok) {

          throw new Error(
            data?.detail ||
              data?.error ||
              "Delete failed."
          );
        }

        setPosts((prev) =>
          prev.filter(
            (post) =>
              post.id !== id
          )
        );

        if (
          selectedPost?.id === id
        ) {

          closeEditor();

        }

      } catch (err: any) {

        console.error(
          "DELETE ARTICLE ERROR:",
          err
        );

        alert(
          err?.message ||
            "Failed to delete article."
        );

      } finally {

        setDeletingPost(false);

      }
    };

  /* =========================================================
     MOVE PUBLISHED ARTICLE TO DRAFT
  ========================================================= */

  const moveCurrentPostToDraft =
    async () => {

      if (!selectedPost) {
        return;
      }

      /*
       * Already draft.
       */

      if (
        getStatus(selectedPost) ===
        "draft"
      ) {

        return;

      }

      if (
        !window.confirm(
          "Move this article back to draft?"
        )
      ) {

        return;

      }

      try {

        setPublishingPost(true);

        /*
         * Cancel pending autosave.
         */

        if (
          autoSaveTimeout.current
        ) {

          clearTimeout(
            autoSaveTimeout.current
          );

          autoSaveTimeout.current =
            null;

        }

        /*
         * STEP 1
         *
         * Save latest editor changes.
         */

        const saved =
          await saveContentNow(
            editTitle,
            editSections,
            selectedPost
          );

        if (!saved) {

          throw new Error(
            "Could not save the latest changes."
          );

        }

        /*
         * STEP 2
         *
         * Change status.
         *
         * CandiDRP is ARTICLE only.
         */

        const response =
          await fetch(
            `${API_URL}/draft/article/${selectedPost.id}`,
            {
              method: "PUT",
            }
          );

        let data: any = null;

        try {

          data =
            await response.json();

        } catch {

          data = null;

        }

        if (!response.ok) {

          throw new Error(
            data?.detail ||
              data?.error ||
              "Failed to move article to draft."
          );

        }

        /*
         * STEP 3
         *
         * Update editor state.
         */

        const draftPost: Post = {

          ...selectedPost,

          title:
            editTitle,

          sections:
            editSections,

          status:
            "draft",
        };

        setSelectedPost(
          draftPost
        );

        /*
         * STEP 4
         *
         * Update list locally.
         */

        setPosts((prev) =>
          prev.map((post) =>
            post.id ===
            selectedPost.id
              ? {
                  ...post,

                  title:
                    editTitle,

                  sections:
                    editSections,

                  status:
                    "draft",
                }
              : post
          )
        );

        /*
         * STEP 5
         *
         * Refresh from MongoDB.
         */

        await fetchPosts();

        alert(
          "Article moved to draft successfully."
        );

      } catch (err: any) {

        console.error(
          "MOVE TO DRAFT ERROR:",
          err
        );

        alert(
          err?.message ||
            "Failed to move article to draft."
        );

      } finally {

        setPublishingPost(
          false
        );
      }
    };

  /* =========================================================
     PUBLISH CURRENT DRAFT
  ========================================================= */

  const publishCurrentPost =
    async () => {

      if (!selectedPost) {
        return;
      }

      /*
       * Already published.
       */

      if (
        getStatus(selectedPost) ===
        "published"
      ) {

        return;

      }

      /*
       * Validate title.
       */

      if (
        !editTitle.trim()
      ) {

        alert(
          "Please enter a title before publishing."
        );

        return;

      }

      /*
       * Validate sections.
       */

      if (
        editSections.length === 0
      ) {

        alert(
          "Please add at least one section before publishing."
        );

        return;

      }

      if (
        !window.confirm(
          "Publish this article?"
        )
      ) {

        return;

      }

      try {

        setPublishingPost(
          true
        );

        /*
         * Cancel pending autosave.
         */

        if (
          autoSaveTimeout.current
        ) {

          clearTimeout(
            autoSaveTimeout.current
          );

          autoSaveTimeout.current =
            null;

        }

        /*
         * STEP 1
         *
         * Save latest editor changes.
         */

        const saved =
          await saveContentNow(
            editTitle,
            editSections,
            selectedPost
          );

        if (!saved) {

          throw new Error(
            "Could not save latest changes."
          );

        }

        /*
         * STEP 2
         *
         * Publish article.
         */

        const response =
          await fetch(
            `${API_URL}/publish/article/${selectedPost.id}`,
            {
              method: "PUT",
            }
          );

        let data: any = null;

        try {

          data =
            await response.json();

        } catch {

          data = null;

        }

        if (!response.ok) {

          throw new Error(
            data?.detail ||
              data?.error ||
              "Publishing failed."
          );

        }

        /*
         * STEP 3
         *
         * Update editor state.
         */

        const publishedPost: Post = {

          ...selectedPost,

          title:
            editTitle,

          sections:
            editSections,

          status:
            "published",
        };

        setSelectedPost(
          publishedPost
        );

        /*
         * STEP 4
         *
         * Update list locally.
         */

        setPosts((prev) =>
          prev.map((post) =>
            post.id ===
            selectedPost.id
              ? {
                  ...post,

                  title:
                    editTitle,

                  sections:
                    editSections,

                  status:
                    "published",
                }
              : post
          )
        );

        /*
         * STEP 5
         *
         * Refresh from MongoDB.
         */

        await fetchPosts();

        /*
         * Close editor.
         */

        closeEditor();

        alert(
          "Article published successfully."
        );

      } catch (err: any) {

        console.error(
          "PUBLISH ARTICLE ERROR:",
          err
        );

        alert(
          err?.message ||
            "Publishing failed."
        );

      } finally {

        setPublishingPost(
          false
        );
      }
    };

  /* =========================================================
     IMAGE CLASSES
  ========================================================= */

  const imageClass =
    "w-full h-auto object-contain rounded-2xl border border-slate-200 bg-white";

  const uploadInputClass =
    "w-full border border-slate-200 bg-white rounded-2xl px-4 py-4 text-slate-700 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-xl file:bg-[#1f7a45] file:text-white file:font-semibold";

  /* =========================================================
     EDITOR MODE
  ========================================================= */

  if (selectedPost) {

    const currentStatus =
      getStatus(selectedPost);

    return (

      <div
        className="
          w-full
          flex
          justify-center
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-black
          min-h-screen
          bg-[#edf4ef]
        "
      >

        <div
          className="
            w-full
            max-w-[1600px]
            p-6
            md:p-10
          "
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              flex
              flex-col
              lg:flex-row
              items-start
              lg:items-center
              justify-between
              gap-6
              mb-10
            "
          >

            <div>

              <button
                type="button"
                onClick={
                  closeEditor
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-slate-600
                  hover:text-black
                  transition-all
                  mb-5
                "
              >

                <ArrowLeft
                  className="w-5 h-5"
                />

                Back to Articles

              </button>

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <h1
                  className="
                    text-4xl
                    md:text-5xl
                    font-bold
                    text-[#0f172a]
                  "
                >
                  Edit Article
                </h1>

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    font-medium
                    tracking-wide
                    bg-blue-100
                    text-blue-700
                  "
                >
                  ARTICLE
                </span>

                <span
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-xs
                    font-medium
                    tracking-wide
                    ${
                      currentStatus ===
                      "draft"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >

                  {currentStatus ===
                  "draft"
                    ? "DRAFT"
                    : "PUBLISHED"}

                </span>

              </div>

            </div>

            {/* =================================================
                HEADER ACTIONS
            ================================================= */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >

              {/* AUTO SAVE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  rounded-2xl
                  bg-white
                  border
                  border-slate-200
                  shadow-lg
                "
              >

                <CheckCircle2
                  className={`
                    w-5
                    h-5
                    ${
                      autoSaving
                        ? "text-orange-500 animate-pulse"
                        : "text-green-600"
                    }
                  `}
                />

                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >

                  {autoSaving
                    ? "Auto Saving..."
                    : "Auto Saved"}

                </span>

              </div>

              {/* =============================================
                  DRAFT -> PUBLISH
              ============================================= */}

              {currentStatus ===
              "draft" ? (

                <button
                  type="button"
                  onClick={
                    publishCurrentPost
                  }
                  disabled={
                    publishingPost ||
                    autoSaving
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-6
                    py-4
                    rounded-2xl
                    bg-[#1f7a45]
                    hover:bg-[#17663a]
                    text-white
                    font-bold
                    shadow-lg
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >

                  {publishingPost ? (

                    <>

                      <RefreshCw
                        className="
                          w-5
                          h-5
                          animate-spin
                        "
                      />

                      Publishing...

                    </>

                  ) : (

                    <>

                      <Send
                        className="w-5 h-5"
                      />

                      Publish

                    </>

                  )}

                </button>

              ) : (

                /* =========================================
                   PUBLISHED -> DRAFT
                ========================================= */

                <button
                  type="button"
                  onClick={
                    moveCurrentPostToDraft
                  }
                  disabled={
                    publishingPost ||
                    autoSaving
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-6
                    py-4
                    rounded-2xl
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    font-bold
                    shadow-lg
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >

                  {publishingPost ? (

                    <>

                      <RefreshCw
                        className="
                          w-5
                          h-5
                          animate-spin
                        "
                      />

                      Moving...

                    </>

                  ) : (

                    <>

                      <RefreshCw
                        className="
                          w-5
                          h-5
                        "
                      />

                      Move to Draft

                    </>

                  )}

                </button>

              )}

            </div>

          </div>

          {/* =================================================
              ARTICLE INFORMATION
          ================================================= */}

          <div
            className="
              bg-white
              rounded-[2rem]
              border
              border-slate-200
              p-8
              shadow-lg
              mb-10
            "
          >

            <label
              className="
                block
                text-sm
                font-bold
                text-slate-700
                mb-4
              "
            >
              Article Title
            </label>

            <input
              value={
                editTitle
              }
              onChange={(e) =>
                handleTitleChange(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-slate-200
                bg-[#f8fafc]
                rounded-2xl
                px-6
                py-5
                text-lg
                text-slate-800
                focus:outline-none
                focus:ring-4
                focus:ring-emerald-100
              "
            />

          </div>

          {/* =================================================
              ADD SECTION
          ================================================= */}

          <div className="mb-12">

            <div className="mb-5">

              <h2
                className="
                  text-2xl
                  font-black
                  text-[#0f172a]
                "
              >
                Add Section
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                Choose a layout to add to this
                article.
              </p>

            </div>

            <div
              className="
                grid
                lg:grid-cols-3
                gap-6
              "
            >

              {[
                ...layouts.left,
                ...layouts.center,
                ...layouts.right,
              ].map(
                (layout) => (

                  <button
                    key={
                      layout.type
                    }
                    type="button"
                    onClick={() =>
                      addSection(
                        layout.type
                      )
                    }
                    disabled={
                      publishingPost
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-3
                      w-full
                      px-5
                      py-4
                      rounded-2xl
                      bg-[#1f7a45]
                      text-white
                      font-semibold
                      hover:bg-[#17663a]
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      transition-all
                    "
                  >

                    <Plus
                      className="w-5 h-5"
                    />

                    {layout.label}

                  </button>

                )
              )}

            </div>

          </div>

          {/* =================================================
              SECTIONS
          ================================================= */}

          {editSections.length ===
          0 ? (

            <div
              className="
                bg-white
                rounded-[2rem]
                border
                border-dashed
                border-slate-300
                p-16
                text-center
              "
            >

              <Plus
                className="
                  w-10
                  h-10
                  mx-auto
                  text-slate-300
                  mb-4
                "
              />

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-700
                "
              >
                No sections yet
              </h3>

              <p
                className="
                  text-slate-400
                  mt-2
                "
              >
                Add a section using the
                buttons above.
              </p>

            </div>

          ) : (

            <div className="space-y-10">

              {editSections.map(
                (sec, i) => (

                  <div
                    key={
                      sec.id || i
                    }
                    className="
                      relative
                      bg-white
                      rounded-[2rem]
                      border
                      border-slate-200
                      p-8
                      shadow-lg
                    "
                  >

                    {/* SECTION HEADER */}

                    <div
                      className="
                        flex
                        items-center
                        mb-8
                        pr-32
                      "
                    >

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-4
                          py-2
                          rounded-full
                          bg-emerald-100
                          text-emerald-700
                          font-semibold
                          capitalize
                        "
                      >

                        Section {i + 1}

                        <span
                          className="
                            text-emerald-400
                          "
                        >
                          •
                        </span>

                        {sec.type.replace(
                          /-/g,
                          " "
                        )}

                      </span>

                    </div>

                    {/* SECTION ACTIONS */}

                    <div
                      className="
                        absolute
                        top-5
                        right-5
                        flex
                        items-center
                        gap-2
                      "
                    >

                      {/* UP */}

                      <button
                        type="button"
                        onClick={() =>
                          moveSection(
                            i,
                            "up"
                          )
                        }
                        disabled={
                          i === 0 ||
                          publishingPost
                        }
                        title="Move section up"
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-blue-50
                          border
                          border-blue-200
                          text-blue-600
                          hover:bg-blue-500
                          hover:text-white
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <ArrowUp
                          className="w-4 h-4"
                        />

                      </button>

                      {/* DOWN */}

                      <button
                        type="button"
                        onClick={() =>
                          moveSection(
                            i,
                            "down"
                          )
                        }
                        disabled={
                          i ===
                            editSections.length -
                              1 ||
                          publishingPost
                        }
                        title="Move section down"
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-green-50
                          border
                          border-green-200
                          text-green-600
                          hover:bg-green-500
                          hover:text-white
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <ArrowDown
                          className="w-4 h-4"
                        />

                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeSection(
                            i
                          )
                        }
                        disabled={
                          publishingPost
                        }
                        title="Delete section"
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-red-50
                          border
                          border-red-200
                          text-red-500
                          hover:bg-red-500
                          hover:text-white
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Trash2
                          className="w-4 h-4"
                        />

                      </button>

                    </div>

                    {/* FULL TEXT */}

                    {sec.type ===
                      "text" && (

                      <div
                        className="
                          bg-[#f8fafc]
                          border
                          border-slate-200
                          rounded-3xl
                          p-6
                        "
                      >

                        <Editor
                          value={
                            sec.content ||
                            ""
                          }
                          onChange={(
                            val
                          ) =>
                            updateSection(
                              i,
                              "content",
                              val
                            )
                          }
                        />

                      </div>

                    )}

                    {/* SUBTITLE */}

                    {sec.type ===
                      "subtitle" && (

                      <div
                        className="
                          bg-[#f8fafc]
                          border
                          border-slate-200
                          rounded-3xl
                          p-6
                        "
                      >

                        <Editor
                          value={
                            sec.content ||
                            ""
                          }
                          onChange={(
                            val
                          ) =>
                            updateSection(
                              i,
                              "content",
                              val
                            )
                          }
                        />

                      </div>

                    )}

                    {/* TWO TEXT */}

                    {sec.type ===
                      "two-text" && (

                      <div
                        className="
                          grid
                          grid-cols-1
                          xl:grid-cols-2
                          gap-8
                        "
                      >

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-6
                          "
                        >

                          <Editor
                            value={
                              sec.content ||
                              ""
                            }
                            onChange={(
                              val
                            ) =>
                              updateSection(
                                i,
                                "content",
                                val
                              )
                            }
                          />

                        </div>

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-6
                          "
                        >

                          <Editor
                            value={
                              sec.content2 ||
                              ""
                            }
                            onChange={(
                              val
                            ) =>
                              updateSection(
                                i,
                                "content2",
                                val
                              )
                            }
                          />

                        </div>

                      </div>

                    )}

                    {/* FULL IMAGE */}

                    {sec.type ===
                      "full-image" && (

                      <div
                        className="
                          bg-[#f8fafc]
                          border
                          border-slate-200
                          rounded-3xl
                          p-5
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            mb-4
                            text-sm
                            font-bold
                            text-slate-700
                          "
                        >

                          <Upload
                            className="w-4 h-4"
                          />

                          Upload Image

                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          className={
                            uploadInputClass
                          }
                          disabled={
                            publishingPost
                          }
                          onChange={async (
                            e
                          ) => {

                            const file =
                              e.target
                                .files?.[0];

                            if (!file) {
                              return;
                            }

                            await handleImageUpload(
                              i,
                              file,
                              1
                            );

                            e.target.value =
                              "";

                          }}
                        />

                        {sec.image && (

                          <div
                            className="mt-5"
                          >

                            <img
                              src={
                                sec.image
                              }
                              alt=""
                              className={
                                imageClass
                              }
                            />

                          </div>

                        )}

                      </div>

                    )}

                    {/* IMAGE LEFT */}

                    {sec.type ===
                      "image-left" && (

                      <div
                        className="
                          grid
                          grid-cols-1
                          xl:grid-cols-2
                          gap-8
                        "
                      >

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-4
                              text-sm
                              font-bold
                              text-slate-700
                            "
                          >

                            <Upload
                              className="w-4 h-4"
                            />

                            Left Image

                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className={
                              uploadInputClass
                            }
                            disabled={
                              publishingPost
                            }
                            onChange={async (
                              e
                            ) => {

                              const file =
                                e.target
                                  .files?.[0];

                              if (!file) {
                                return;
                              }

                              await handleImageUpload(
                                i,
                                file,
                                1
                              );

                              e.target.value =
                                "";

                            }}
                          />

                          {sec.image && (

                            <div
                              className="mt-5"
                            >

                              <img
                                src={
                                  sec.image
                                }
                                alt=""
                                className={
                                  imageClass
                                }
                              />

                            </div>

                          )}

                        </div>

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-6
                          "
                        >

                          <Editor
                            value={
                              sec.content ||
                              ""
                            }
                            onChange={(
                              val
                            ) =>
                              updateSection(
                                i,
                                "content",
                                val
                              )
                            }
                          />

                        </div>

                      </div>

                    )}

                    {/* IMAGE RIGHT */}

                    {sec.type ===
                      "image-right" && (

                      <div
                        className="
                          grid
                          grid-cols-1
                          xl:grid-cols-2
                          gap-8
                        "
                      >

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-6
                            order-2
                            xl:order-1
                          "
                        >

                          <Editor
                            value={
                              sec.content ||
                              ""
                            }
                            onChange={(
                              val
                            ) =>
                              updateSection(
                                i,
                                "content",
                                val
                              )
                            }
                          />

                        </div>

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-5
                            order-1
                            xl:order-2
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-4
                              text-sm
                              font-bold
                              text-slate-700
                            "
                          >

                            <Upload
                              className="w-4 h-4"
                            />

                            Right Image

                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className={
                              uploadInputClass
                            }
                            disabled={
                              publishingPost
                            }
                            onChange={async (
                              e
                            ) => {

                              const file =
                                e.target
                                  .files?.[0];

                              if (!file) {
                                return;
                              }

                              await handleImageUpload(
                                i,
                                file,
                                1
                              );

                              e.target.value =
                                "";

                            }}
                          />

                          {sec.image && (

                            <div
                              className="mt-5"
                            >

                              <img
                                src={
                                  sec.image
                                }
                                alt=""
                                className={
                                  imageClass
                                }
                              />

                            </div>

                          )}

                        </div>

                      </div>

                    )}

                    {/* TWO IMAGE */}

                    {sec.type ===
                      "two-image" && (

                      <div
                        className="
                          grid
                          grid-cols-1
                          xl:grid-cols-2
                          gap-8
                        "
                      >

                        {/* LEFT IMAGE */}

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-4
                              text-sm
                              font-bold
                              text-slate-700
                            "
                          >

                            <Upload
                              className="w-4 h-4"
                            />

                            Left Image

                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className={
                              uploadInputClass
                            }
                            disabled={
                              publishingPost
                            }
                            onChange={async (
                              e
                            ) => {

                              const file =
                                e.target
                                  .files?.[0];

                              if (!file) {
                                return;
                              }

                              await handleImageUpload(
                                i,
                                file,
                                1
                              );

                              e.target.value =
                                "";

                            }}
                          />

                          {sec.image && (

                            <div
                              className="mt-5"
                            >

                              <img
                                src={
                                  sec.image
                                }
                                alt=""
                                className={
                                  imageClass
                                }
                              />

                            </div>

                          )}

                        </div>

                        {/* RIGHT IMAGE */}

                        <div
                          className="
                            bg-[#f8fafc]
                            border
                            border-slate-200
                            rounded-3xl
                            p-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-4
                              text-sm
                              font-bold
                              text-slate-700
                            "
                          >

                            <Upload
                              className="w-4 h-4"
                            />

                            Right Image

                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className={
                              uploadInputClass
                            }
                            disabled={
                              publishingPost
                            }
                            onChange={async (
                              e
                            ) => {

                              const file =
                                e.target
                                  .files?.[0];

                              if (!file) {
                                return;
                              }

                              await handleImageUpload(
                                i,
                                file,
                                2
                              );

                              e.target.value =
                                "";

                            }}
                          />

                          {sec.image2 && (

                            <div
                              className="mt-5"
                            >

                              <img
                                src={
                                  sec.image2
                                }
                                alt=""
                                className={
                                  imageClass
                                }
                              />

                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    );
  }

  /* =========================================================
     LIST MODE
  ========================================================= */

  return (

    <div
      className="
        w-full
        flex
        justify-center
        text-gray-800
        overflow-hidden
        relative
        rounded-[2rem]
        border
        border-black
        min-h-[50vh]
        bg-[#edf4ef]
      "
    >

      <div
        className="
          w-full
          p-5
          md:p-8
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            bg-[#1f7a45]
            rounded-t-2xl
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            px-5
            py-5
            text-white
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <FileSpreadsheet
              size={20}
            />

            <div>

              <span
                className="
                  font-semibold
                  text-sm
                  block
                "
              >
                Candid Articles Manager
              </span>

              <span
                className="
                  text-xs
                  text-white/70
                "
              >
                Articles
              </span>

            </div>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
            "
          >

            <Grid size={16} />

            Connected to MongoDB

          </div>

        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div
          className="
            bg-white
            rounded-b-2xl
            p-5
            md:p-8
          "
        >

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-8">

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >

              {/* ALL */}

              <button
                type="button"
                onClick={() =>
                  setContentFilter(
                    "all"
                  )
                }
                className={`
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  ${
                    contentFilter ===
                    "all"
                      ? "bg-[#1f7a45] text-white shadow-lg"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-[#1f7a45]"
                  }
                `}
              >
                All ({posts.length})
              </button>

          

             

              {/* DRAFTS */}

              <button
                type="button"
                onClick={() =>
                  setContentFilter(
                    "draft"
                  )
                }
                className={`
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  ${
                    contentFilter ===
                    "draft"
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
                  }
                `}
              >
                Drafts ({draftCount})
              </button>

              {/* PUBLISHED */}

              <button
                type="button"
                onClick={() =>
                  setContentFilter(
                    "published"
                  )
                }
                className={`
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  transition-all
                  ${
                    contentFilter ===
                    "published"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-green-300"
                  }
                `}
              >
                Published ({publishedCount})
              </button>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div
              className="
                text-center
                py-20
                text-slate-500
              "
            >

              <RefreshCw
                className="
                  w-8
                  h-8
                  mx-auto
                  mb-4
                  animate-spin
                "
              />

              Loading Articles...

            </div>

          ) : posts.length ===
            0 ? (

            <div
              className="
                text-center
                py-20
                text-slate-500
              "
            >

              <FileSpreadsheet
                className="
                  w-10
                  h-10
                  mx-auto
                  mb-4
                  text-slate-300
                "
              />

              <p
                className="
                  text-lg
                  font-semibold
                "
              >
                No Articles Found
              </p>

            </div>

          ) : filteredPosts.length ===
            0 ? (

            <div
              className="
                text-center
                py-20
                text-slate-500
              "
            >

              <Grid
                className="
                  w-10
                  h-10
                  mx-auto
                  mb-4
                  text-slate-300
                "
              />

              <p
                className="
                  text-lg
                  font-semibold
                "
              >
                No Articles Match This Filter
              </p>

              <button
                type="button"
                onClick={() =>
                  setContentFilter(
                    "all"
                  )
                }
                className="
                  mt-5
                  px-5
                  py-3
                  rounded-xl
                  bg-[#1f7a45]
                  text-white
                  font-semibold
                "
              >
                Show All
              </button>

            </div>

          ) : (

            /* =================================================
               ARTICLE GRID
            ================================================= */

            <div
              className="
                grid
                md:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >

              {filteredPosts.map(
                (post) => {

                  const status =
                    getStatus(post);

                  /*
                   * First image.
                   */

                  const image =
                    post.sections?.find(
                      (section) =>
                        Boolean(
                          section.image
                        )
                    )?.image;

                  return (

                    <div
                      key={
                        post.id
                      }
                      className="
                        bg-[#f8fafc]
                        rounded-[2rem]
                        border
                        border-slate-200
                        overflow-hidden
                        shadow-lg
                        hover:shadow-2xl
                        transition-all
                      "
                    >

                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div
                        className="
                          h-[220px]
                          bg-slate-100
                          overflow-hidden
                        "
                      >

                        {image ? (

                          <img
                            src={image}
                            alt=""
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />

                        ) : (

                          <div
                            className="
                              w-full
                              h-full
                              flex
                              flex-col
                              items-center
                              justify-center
                              text-slate-400
                            "
                          >

                            <FileSpreadsheet
                              className="
                                w-8
                                h-8
                                mb-2
                              "
                            />

                            No Image

                          </div>

                        )}

                      </div>

                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <div className="p-6">

                        {/* TYPE + STATUS */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            mb-4
                          "
                        >

                          <span
                            className="
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              font-black
                              bg-blue-100
                              text-blue-700
                            "
                          >
                            ARTICLE
                          </span>

                          <span
                            className={`
                              px-3
                              py-1.5
                              rounded-full
                              text-xs
                              font-black
                              ${
                                status ===
                                "draft"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }
                            `}
                          >

                            {status ===
                            "draft"
                              ? "DRAFT"
                              : "PUBLISHED"}

                          </span>

                        </div>

                        {/* TITLE */}

                        <h2
                          className="
                            text-2xl
                            font-black
                            text-[#0f172a]
                            line-clamp-2
                            min-h-[64px]
                          "
                        >
                          {post.title}
                        </h2>

                        {/* DATE */}

                        <p
                          className="
                            text-sm
                            text-slate-500
                            mt-3
                          "
                        >
                          {post.date
                            ? new Date(
                                post.date
                              ).toLocaleDateString()
                            : "No date"}
                        </p>

                        {/* ACTIONS */}

                        <div
                          className="
                            mt-6
                            flex
                            gap-3
                          "
                        >

                          {/* OPEN EDITOR */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditor(
                                post
                              )
                            }
                            className="
                              flex-1
                              flex
                              items-center
                              justify-center
                              gap-2
                              px-4
                              py-3
                              rounded-2xl
                              bg-[#1f7a45]
                              hover:bg-[#17663a]
                              text-white
                              font-semibold
                              transition-all
                            "
                          >

                            <Pencil
                              className="
                                w-4
                                h-4
                              "
                            />

                            Open Editor

                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                post.id
                              )
                            }
                            disabled={
                              deletingPost
                            }
                            className="
                              w-14
                              rounded-2xl
                              bg-red-50
                              hover:bg-red-500
                              text-red-500
                              hover:text-white
                              disabled:opacity-40
                              disabled:cursor-not-allowed
                              transition-all
                              flex
                              items-center
                              justify-center
                            "
                            title="Delete"
                          >

                            <Trash2
                              className="
                                w-5
                                h-5
                              "
                            />

                          </button>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}
