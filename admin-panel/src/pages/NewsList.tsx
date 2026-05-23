
import React, { useEffect, useState } from "react";
import Editor from "../components/Editor";

import {
  FileSpreadsheet,
  Grid,
  Trash2,
  Pencil,
  ArrowLeft,
  Save,
  Plus,
} from "lucide-react";

type Section = {
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
};

const layouts = {
  left: [
    { type: "text", label: "Full Text" },
    { type: "subtitle", label: "Subtitle" },
    { type: "two-text", label: "Left Text - Right Text" },
  ],

  center: [
    { type: "image-left", label: "Left Image - Right Text" },
    { type: "image-right", label: "Left Text - Right Image" },
  ],

  right: [
    { type: "full-image", label: "Full Image" },
    { type: "two-image", label: "Left Image - Right Image" },
  ],
};

export default function NewsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editSections, setEditSections] = useState<Section[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/news`);
      const data = await res.json();

      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openEditor = (post: Post) => {
    setSelectedPost(post);
    setEditTitle(post.title || "");
    setEditSections(post.sections || []);
  };

  const closeEditor = () => {
    setSelectedPost(null);
    setEditTitle("");
    setEditSections([]);
  };

  const removeSection = (index: number) => {
    setEditSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSection = (
    index: number,
    field: keyof Section,
    value: string
  ) => {
    const updated = [...editSections];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setEditSections(updated);
  };

  const addSection = (type: string) => {
    setEditSections((prev) => [
      ...prev,
      {
        type,
        content: "",
        content2: "",
        image: "",
        image2: "",
      },
    ]);
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "candid_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dsxlj3waa/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this article?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;

    setIsSaving(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/update/${selectedPost.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle,
            sections: editSections,
          }),
        }
      );

      if (res.ok) {
        alert("Article Updated ✅");

        fetchPosts();

        closeEditor();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const imageClass =
    "w-full h-auto object-contain rounded-2xl border border-slate-200 bg-white";

  const uploadInputClass =
    "w-full border border-slate-200 bg-white rounded-2xl px-4 py-4 text-slate-700 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-xl file:bg-[#1f7a45] file:text-white file:font-semibold";

  /*
  ==========================================================
  EDITOR MODE
  ==========================================================
  */

  if (selectedPost) {
    return (
      <div className="w-full flex justify-center relative overflow-hidden rounded-[2rem] border border-black min-h-screen bg-[#edf4ef]">

        <div className="w-full max-w-[1600px] p-6 md:p-10">

          {/* TOP */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-10">

            <div>
              <button
                onClick={closeEditor}
                className="flex items-center gap-2 text-slate-600 hover:text-black transition-all mb-5"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
              </button>

              <h1 className="text-5xl font-black text-[#0f172a]">
                Edit Article
              </h1>
            </div>

            <button
              onClick={handleUpdate}
              className="
                flex items-center gap-3
                px-8 py-4
                rounded-2xl
                bg-[#1f7a45]
                hover:bg-[#17663a]
                text-white
                font-bold
                shadow-xl
                transition-all
              "
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Article"}
            </button>
          </div>

          {/* TITLE */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-lg mb-10">

            <label className="block text-sm font-bold text-slate-700 mb-4">
              Article Title
            </label>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="
                w-full
                border border-slate-200
                bg-[#f8fafc]
                rounded-2xl
                px-6 py-5
                text-lg
                text-slate-800
                focus:outline-none
              "
            />
          </div>

          {/* ADD SECTION */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">

            {[...layouts.left, ...layouts.center, ...layouts.right].map(
              (l, i) => (
                <button
                  key={i}
                  onClick={() => addSection(l.type)}
                  className="
                    flex items-center justify-center gap-3
                    w-full
                    px-5 py-4
                    rounded-2xl
                    bg-[#1f7a45]
                    text-white
                    font-semibold
                    hover:bg-[#17663a]
                    transition-all
                  "
                >
                  <Plus className="w-5 h-5" />
                  {l.label}
                </button>
              )
            )}
          </div>

          {/* SECTIONS */}
          <div className="space-y-10">

            {editSections.map((sec, i) => (
              <div
                key={i}
                className="
                  relative
                  bg-white
                  rounded-[2rem]
                  border border-slate-200
                  p-8
                  shadow-lg
                "
              >

                {/* DELETE */}
                <button
                  onClick={() => removeSection(i)}
                  className="
                    absolute top-5 right-5
                    w-11 h-11 rounded-full
                    bg-red-50
                    text-red-500
                    hover:bg-red-500 hover:text-white
                    transition-all
                    flex items-center justify-center
                  "
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* TYPE */}
                <div className="mb-8">
                  <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold capitalize">
                    {sec.type.replace(/-/g, " ")}
                  </span>
                </div>

                {/* TEXT */}
                {(sec.type === "text" || sec.type === "subtitle") && (
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
                    <Editor
                      value={sec.content || ""}
                      onChange={(val) =>
                        updateSection(i, "content", val)
                      }
                    />
                  </div>
                )}

                {/* TWO TEXT */}
                {sec.type === "two-text" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
                      <Editor
                        value={sec.content || ""}
                        onChange={(val) =>
                          updateSection(i, "content", val)
                        }
                      />
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
                      <Editor
                        value={sec.content2 || ""}
                        onChange={(val) =>
                          updateSection(i, "content2", val)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* FULL IMAGE */}
                {sec.type === "full-image" && (
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

                    <input
                      type="file"
                      className={uploadInputClass}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const data = await uploadToCloudinary(file);

                        updateSection(i, "image", data.url);
                      }}
                    />

                    {sec.image && (
                      <div className="mt-5">
                        <img
                          src={sec.image}
                          alt=""
                          className={imageClass}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* IMAGE LEFT */}
                {sec.type === "image-left" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

                      <input
                        type="file"
                        className={uploadInputClass}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const data = await uploadToCloudinary(file);

                          updateSection(i, "image", data.url);
                        }}
                      />

                      {sec.image && (
                        <div className="mt-5">
                          <img
                            src={sec.image}
                            alt=""
                            className={imageClass}
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6">
                      <Editor
                        value={sec.content || ""}
                        onChange={(val) =>
                          updateSection(i, "content", val)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* TWO IMAGE */}
{sec.type === "two-image" && (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

    {/* LEFT IMAGE */}
    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

      <input
        type="file"
        className={uploadInputClass}
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          const data = await uploadToCloudinary(file);

          updateSection(i, "image", data.url);
        }}
      />

      {sec.image && (
        <div className="mt-5">
          <img
            src={sec.image}
            alt=""
            className={imageClass}
          />
        </div>
      )}
    </div>

    {/* RIGHT IMAGE */}
    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

      <input
        type="file"
        className={uploadInputClass}
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          const data = await uploadToCloudinary(file);

          updateSection(i, "image2", data.url);
        }}
      />

      {sec.image2 && (
        <div className="mt-5">
          <img
            src={sec.image2}
            alt=""
            className={imageClass}
          />
        </div>
      )}
    </div>

  </div>
)}

                {/* IMAGE RIGHT */}
                {sec.type === "image-right" && (


                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 order-2 xl:order-1">
                      <Editor
                        value={sec.content || ""}
                        onChange={(val) =>
                          updateSection(i, "content", val)
                        }
                      />
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5 order-1 xl:order-2">

                      <input
                        type="file"
                        className={uploadInputClass}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const data = await uploadToCloudinary(file);

                          updateSection(i, "image", data.url);
                        }}
                      />

                      {sec.image && (
                        <div className="mt-5">
                          <img
                            src={sec.image}
                            alt=""
                            className={imageClass}
                          />
                        </div>
                      )}
                      
                    </div>
                    
                  </div>
                  
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /*
  ==========================================================
  LIST MODE
  ==========================================================
  */

  return (
    <div className="w-full flex justify-center text-gray-800 overflow-hidden relative rounded-[2rem] border border-black min-h-[50vh] bg-[#edf4ef]">

      <div className="w-full p-5 md:p-8">

        {/* HEADER */}
        <div className="bg-[#1f7a45] rounded-t-2xl flex items-center px-5 py-4 text-white justify-between">

          <div className="flex items-center gap-3">
            <FileSpreadsheet size={18} />

            <span className="font-semibold text-sm">
              Candid Articles Manager
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Grid size={16} />
            Connected to MongoDB
          </div>
        </div>

        {/* BODY */}
        <div className="bg-white rounded-b-2xl p-8">

          {loading ? (
            <div className="text-center py-20 text-slate-500">
              Loading Articles...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No Articles Found
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {posts.map((post) => (
                <div
                  key={post.id}
                  className="
                    bg-[#f8fafc]
                    rounded-[2rem]
                    border border-slate-200
                    overflow-hidden
                    shadow-lg
                    hover:shadow-2xl
                    transition-all
                  "
                >

                  {/* IMAGE */}
                  <div className="h-[220px] bg-slate-100 overflow-hidden">

                    {post.sections?.find((s) => s.image)?.image ? (
                      <img
                        src={
                          post.sections.find((s) => s.image)?.image
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">

                    <h2 className="text-2xl font-black text-[#0f172a] line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-sm text-slate-500 mt-3">
                      {new Date(post.date).toLocaleDateString()}
                    </p>

                    <div className="mt-6 flex gap-3">

                      <button
                        onClick={() => openEditor(post)}
                        className="
                          flex-1
                          flex items-center justify-center gap-2
                          px-4 py-3
                          rounded-2xl
                          bg-[#1f7a45]
                          hover:bg-[#17663a]
                          text-white
                          font-semibold
                          transition-all
                        "
                      >
                        <Pencil className="w-4 h-4" />
                        Open Editor
                      </button>

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="
                          w-14
                          rounded-2xl
                          bg-red-50
                          hover:bg-red-500
                          text-red-500
                          hover:text-white
                          transition-all
                          flex items-center justify-center
                        "
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
