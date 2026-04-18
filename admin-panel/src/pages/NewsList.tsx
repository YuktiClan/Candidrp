import React, { useEffect, useState } from "react";

import {FileSpreadsheet} from 'lucide-react';
import {
    Grid
} from 'lucide-react';

// ✅ Type definition (FIXES ALL ERRORS)
type Post = {
  id: string;
  title: string;
  date: string;
};

export default function NewsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; date: string }>({
    title: "",
    date: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch Logic ---
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/news`);
      const data = await res.json();

      // ✅ Safe data handling
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    fetchPosts();
  }, []);

  // --- Delete Logic ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // --- Edit Logic ---
  const startEditing = (post: Post) => {
    setEditingId(post.id);

    setEditForm({
      title: post.title || "",
      date: post.date ? post.date.split("T")[0] : "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: "", date: "" });
  };

  // --- Update Logic ---
  const handleUpdate = async (id: string) => {
    setIsSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        title: editForm.title,
        date: editForm.date,
      }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  title: editForm.title,
                  date: editForm.date,
                }
              : p
          )
        );

        setEditingId(null);
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

//   return (
//     <Layout>
//     <div className="flex flex-col h-[380px] bg-[#f3f3f3] text-sm font-sans select-none overflow-hidden">
//           {/* Top Excel Bar */}
//           <div className="bg-[#217346] h-8 flex items-center px-3 gap-4 text-white justify-between shrink-0">
//             <div className="flex items-center gap-4">
//               <FileSpreadsheet size={16} />
//               <span className="font-semibold text-xs tracking-tight">Candid_News&Events_Manager.xlsx</span>
              
//             </div>
//             <div className="flex items-center gap-3">
//               <h2>Powered by yuktic.com</h2>
//               {/* <Search size={14} className="opacity-70" />
//               <div className="w-6 h-6 bg-[#0067b8] rounded-full flex items-center justify-center text-[10px] font-bold">JD</div> */}
//             </div>
//           </div>
    

//       {/* Navigation Tabs */}
//        <div className="bg-white border-b border-gray-300 flex gap-6 px-4 pt-2 text-[11px] font-medium text-gray-600">
//   <span className="text-[#217346] border-b-2 border-[#217346] cursor-pointer pb-1 font-bold">
//     Job List
//   </span>

//   <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
//         <div className="flex items-center gap-2 text-xs text-gray-400 italic">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
//           Connected to MongoDB
//         </div>
// </div>

      

//       {/* Formula Bar */}
//       <div className="bg-white border-b flex text-xs">
//         <div className="w-12 border-r p-1 text-center bg-gray-50 font-medium">A1</div>
//         <div className="px-2 py-1 text-gray-400 font-serif italic border-r">fx</div>
//         <div className="flex-1 px-3 py-1 outline-none text-gray-600">
//           {editingId ? `Editing Post ID: ${editingId}` : "Select a cell to view content"}
//         </div>
//       </div>

//       {/* Spreadsheet Content */}
//       <div className="flex-1 overflow-auto bg-gray-100">
//         <table className="w-full border-collapse bg-white">
//           <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm text-[11px] text-gray-500 font-medium uppercase tracking-wider">
//             <tr>
//               <th className="w-12 border border-gray-300 p-1 bg-gray-200"></th>
//               <th className="border border-gray-300 px-4 py-2 italic text-gray-400">PROPERTY (A)</th>
//               {posts.map((post, i) => (
//                 <th key={post.id} className="border border-gray-300 px-4 py-2 bg-white min-w-[250px]">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2 text-gray-700 normal-case">
//                       <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
//                       Post {i + 1}
//                       <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
//                     </div>
//                     <div className="flex gap-1">
//                       <button onClick={() => startEditing(post)} className="px-2 py-0.5 border rounded bg-white hover:bg-gray-50 text-[10px] text-gray-600">Edit</button>
//                       <button onClick={() => handleDelete(post.id)} className="p-1 border rounded bg-white hover:bg-red-50 text-red-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
//                     </div>
//                   </div>
//                 </th>
//               ))}
//               <th className="border border-gray-300 bg-gray-50 w-full"></th>
//             </tr>
//             <tr className="bg-gray-100 text-center">
//               <td className="border border-gray-300"></td>
//               <td className="border border-gray-300 text-[10px] py-0.5">A</td>
//               {posts.map((_, i) => (
//                 <td key={i} className="border border-gray-300 text-[10px] py-0.5">{String.fromCharCode(66 + i)}</td>
//               ))}
//               <td className="border border-gray-300 text-[10px] py-0.5">...</td>
//             </tr>
//           </thead>
//           <tbody className="text-sm">
//             {/* Row 1: Job Title */}
//             <tr>
//               <td className="border border-gray-300 p-1 text-center bg-gray-100 text-[10px] text-gray-500">1</td>
//               <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 bg-gray-50">Article Title</td>
//               {posts.map((post) => (
//                 <td key={post.id} className={`border border-gray-300 px-4 py-2 ${editingId === post.id ? 'bg-blue-50 ring-1 ring-inset ring-blue-500' : ''}`}>
//                   {editingId === post.id ? (
//                     <input 
//                       className="w-full bg-transparent outline-none" 
//                       value={editForm.title} 
//                       onChange={e => setEditForm({...editForm, title: e.target.value})}
//                     />
//                   ) : (
//                     <span className="italic text-gray-400">{post.title}</span>
//                   )}
//                 </td>
//               ))}
//               <td className="border border-gray-300 bg-gray-50"></td>
//             </tr>
//             {/* Row 2: Date */}
//             <tr>
//               <td className="border border-gray-300 p-1 text-center bg-gray-100 text-[10px] text-gray-500">2</td>
//               <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700 bg-gray-50">Publish Date</td>
//               {posts.map((post) => (
//                 <td key={post.id} className={`border border-gray-300 px-4 py-2 ${editingId === post.id ? 'bg-blue-50 ring-1 ring-inset ring-blue-500' : ''}`}>
//                   {editingId === post.id ? (
//                     <input 
//                       type="date"
//                       className="w-full bg-transparent outline-none" 
//                       value={editForm.date?.split('T')[0] || ""} 
//                       onChange={e => setEditForm({...editForm, date: e.target.value})}
//                     />
//                   ) : (
//                     <span className="italic text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
//                   )}
//                 </td>
//               ))}
//               <td className="border border-gray-300 bg-gray-50"></td>
//             </tr>
//             {/* Save Row (Visible only during Edit) */}
//             {editingId && (
//               <tr className="bg-green-50">
//                 <td className="border border-gray-300 p-1 text-center bg-gray-200 text-[10px]">3</td>
//                 <td className="border border-gray-300 px-4 py-2 font-bold text-green-700">Action Required</td>
//                 {posts.map((post) => (
//                   <td key={post.id} className="border border-gray-300 px-4 py-2">
//                     {editingId === post.id && (
//                       <div className="flex gap-2">
//                         <button onClick={() => handleUpdate(post.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">{isSaving ? "Saving..." : "Commit"}</button>
//                         <button onClick={cancelEditing} className="bg-gray-400 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">Discard</button>
//                       </div>
//                     )}
//                   </td>
//                 ))}
//                 <td className="border border-gray-300 bg-gray-50"></td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer Status Bar */}
//       <footer className="bg-[#1e7145] text-white px-4 py-1 flex items-center gap-6 text-[11px] font-medium uppercase tracking-tight">
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//           Ready
//         </div>
//         <div className="border-l border-white/20 pl-4">MODE: SYNC</div>
//         <div className="ml-auto border-l border-white/20 pl-4 flex items-center gap-2">
//           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 116 0v2H7V7z"/></svg>
//           Edit mode enabled via column header
//         </div>
//         <div className="border-l border-white/20 pl-4 font-bold">{posts.length} RECORDS</div>
//       </footer>
//     </div>
//     </Layout>
//   );

return (
  // <Layout>
<div className="w-full flex justify-center text-gray-800 overflow-hidden relative rounded-[2.5rem] border border-white/10 shadow-2xl min-h-[40vh]">
      {/* 🌑 BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] via-40% to-[#e2e8f0]" />

      {/* ✨ LIGHT GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-[80px]" />

      {/* 🔥 BACKGROUND BLOBS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full p-4 md:p-6 flex flex-col h-auto">
        <div className="backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/40 flex flex-col h-full">
        

        {/* HEADER */}
        <div className="bg-[#217346] flex items-center px-3 py-2 text-white justify-between flex-wrap">
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={18} />
            <span className="font-semibold text-sm">
              Candid_Article&Events_Manager.xlsx
            </span>
          </div>
          <h2 className="text-xs opacity-80">Powered by yuktic.com</h2>
        </div>

        {/* GLASS CARD */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-b-xl shadow-xl overflow-hidden flex flex-col min-h-[40vh]">
          {/* NAV */}
          {/* Navigation Tabs */}
<div className="bg-white border-b border-gray-300 flex gap-6 px-4 pt-2 text-[11px] font-medium text-gray-600">
  <span className="text-[#217346] border-b-2 border-[#217346] cursor-pointer pb-1 font-bold">
    Job List
  </span>

    <div className="px-3 flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-400">
            <Grid size={16} />
            <span className="text-[10px]">Connected to MongoDB</span>
          </div>
    </div>
    </div>
    

          {/* FORMULA BAR */}
          <div className="flex text-xs border-b bg-white">
            <div className="w-14 border-r p-2 text-center bg-gray-50 font-medium">
              A1
            </div>
            <div className="px-3 py-2 text-gray-400 border-r">fx</div>
            <div className="flex-1 px-3 py-2 text-gray-600">
              {editingId
                ? `Editing: ${
                    posts.find((p) => p.id === editingId)?.title || "Untitled"
                  }`
                : "Select a cell to view content"}
            </div>
            
          </div>

          {/* TABLE */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse bg-white text-sm">

              <thead className="sticky top-0 bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="w-12 border p-2 bg-gray-200"></th>
                  <th className="border px-4 py-2">PROPERTY</th>

                  {posts.map((post, i) => (
                    <th key={post.id} className="border px-4 py-2 min-w-[220px]">

                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          Post {i + 1}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(post)}
                            className="px-2 py-1 rounded bg-indigo-500 text-white text-xs hover:bg-indigo-600 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

                {/* TITLE */}
                <tr>
                  <td className="border text-center bg-gray-100">1</td>
                  <td className="border px-4 py-2 font-medium bg-gray-50">
                    Article Title
                  </td>

                  {posts.map((post) => (
                    <td key={post.id} className={`border px-4 py-2 ${editingId === post.id ? "bg-blue-50" : ""}`}>
                      {editingId === post.id ? (
                        <input
                          className="w-full outline-none"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      ) : (
                        <span className="text-gray-600">
                          {post.title}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* DATE */}
                <tr>
                  <td className="border text-center bg-gray-100">2</td>
                  <td className="border px-4 py-2 font-medium bg-gray-50">
                    Publish Date
                  </td>

                  {posts.map((post) => (
                    <td key={post.id} className={`border px-4 py-2 ${editingId === post.id ? "bg-blue-50" : ""}`}>
                      {editingId === post.id ? (
                        <input
                          type="date"
                          className="w-full outline-none"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                        />
                      ) : (
                        new Date(post.date).toLocaleDateString()
                      )}
                    </td>
                  ))}
                </tr>

                {/* ACTION */}
                {editingId && (
                  <tr className="bg-green-50">
                    <td className="border text-center">3</td>
                    <td className="border px-4 py-2 font-bold text-green-700">
                      Action
                    </td>

                    {posts.map((post) => (
                      <td key={post.id} className="border px-4 py-2">
                        {editingId === post.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(post.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>

                            <button
                              onClick={cancelEditing}
                              className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="bg-[#1e7145] text-white px-4 py-2 flex justify-between text-xs">
            <span>Ready</span>
            <span>{posts.length} RECORDS</span>
          </div>

        </div>
      </div>
    </div>
    </div>
  // </Layout>
);
}