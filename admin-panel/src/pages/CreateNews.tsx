

import React, { useState, useEffect } from "react";
import Editor from "../components/Editor";


type Section = {
  type: string;
  content?: string;
  content2?: string;
  image?: string;
  image2?: string;

  image_public_id?: string;
  image2_public_id?: string;
};


const layouts = [
  { type: "text", label: "Full Text" },
  { type: "subtitle", label: "Subtitle" },
  { type: "image-left", label: "Image Left - Text Right" },
  { type: "image-right", label: "Text Left - Image Right" },
  { type: "two-text", label: "Text Left - Text Right" },
  { type: "two-image", label: "Image Left - Image Right" },
  { type: "full-image", label: "Full Image" },
];

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [mounted, setMounted] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();


    formData.append("file", file);
    formData.append("upload_preset", "candid_upload");

    const res = await fetch(
      // "https://api.cloudinary.com/v1_1/dsxlj3waa/image/upload",
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

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    setMounted(true);
  }, []);

  const addSection = (type: string) => {
    setSections([
      ...sections,
      { type, content: "", content2: "", image: "", image2: "" },
    ]);
  };

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    setSections(updated);
  };

  // const updateSection = (
  //   index: number,
  //   field: keyof Section,
  //   value: string
  // ) => {
  //   const updated = [...sections];
  //   updated[index][field] = value;
  //   setSections(updated);
  // };


  const updateSection = (
    index: number,
    field: keyof Section,
    value: string
  ) => {
    const updated = [...sections];

    if (!updated[index]) return;

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSections(updated);
  };



  //   const convertDriveUrl = (url: string): string => {
  //   if (!url) return "";

  //   if (url.includes("drive.google.com")) {
  //     const match = url.match(/\/d\/(.*?)\//);
  //     if (match && match[1]) {
  //       // ✅ BEST WORKING FORMAT
  //       return `https://lh3.googleusercontent.com/d/${match[1]}`;
  //     }
  //   }

  //   return url;
  // };


  const handleSubmit = async () => {



    // VALIDATION
    if (!title.trim()) {
      alert("⚠ Please enter a title before publishing!");
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/add-news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, sections }),
    });

    alert("News Created ✅");
    setTitle("");
    setSections([]);
  };

  return (
    // <Layout>
    <div className="w-full flex justify-center text-gray-800 overflow-hidden relative rounded-[2.5rem] border border-white/10 shadow-2xl">

      {/* 🌑 TOP DARK → BOTTOM LIGHT GRADIENT */}
      <div className="absolute inset-0 
    bg-gradient-to-b 
    from-[#020617] via-[#0f172a] via-40% to-[#e2e8f0]" />

      {/* ✨ BOTTOM LIGHT GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-[50%] 
    bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-[80px]" />

      {/* 🔵 GRID (optional, keep your existing one) */}





      {/* 🔥 Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

        <div
          className={`absolute inset-0 opacity-[0.1] transition-all duration-[2500ms] ${mounted ? "translate-y-0" : "translate-y-32"
            }`}
          style={{
            backgroundImage:
              "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(1000px) rotateX(60deg)",
            transformOrigin: "top",
          }}
        />
      </div>

      {/* 🔥 MAIN */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-10">

        {/* HEADER */}
        <div
          className={`text-center mb-10 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h1 className="text-5xl font-black text-white">
            Create <span className="text-indigo-400">News</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Build rich and dynamic news articles with advanced layout blocks
          </p>
        </div>

        {/* TITLE */}
        <div className="mb-8">
          <input
            className="w-full bg-slate-900/70 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder:text-slate-500"
            placeholder="Enter News Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* ADD SECTION BUTTONS */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
            {layouts.map((l, i) => (
              <button
                key={i}
                onClick={() => addSection(l.type)}
                className="group relative px-5 py-2.5 rounded-2xl 
                              bg-gradient-to-br from-indigo-600 to-purple-600 
                              text-white text-sm font-semibold tracking-wide
                              shadow-lg hover:shadow-indigo-500/30
                              transition-all duration-300 
                              hover:scale-105 active:scale-95"
              >
                {/* Glow Effect */}
                <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />

                <span className="relative z-10">
                  + {l.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-8">
          {sections.map((sec, i) => (
            <div
              key={i}
              className="relative group transition-all duration-500"
            >
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 blur opacity-20 group-hover:opacity-40 rounded-2xl transition" />

              <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl">


                {/* ❌ REMOVE BUTTON */}
                <button
                  onClick={() => removeSection(i)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center 
                              rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white 
                              transition-all duration-300 text-lg font-bold"
                >
                  ✕
                </button>

                <h3 className="font-bold text-indigo-400 mb-4 capitalize">
                  {sec.type.replace("-", " ")}
                </h3>

                {/* IMAGE */}
                {/* SINGLE IMAGE */}

                {sec.type.includes("image") && sec.type !== "two-image" && (
                  <input
                    type="file"
                    className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg mb-3 text-white"
                   onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const data = await uploadToCloudinary(file);

                          const updated = [...sections];

                          updated[i] = {
                            ...updated[i],
                            image: data.url,
                            image_public_id: data.public_id,
                          };

                          setSections(updated);
                        }}
                   
                  />
                )}

                {/* SECOND IMAGE */}
                {/* TWO IMAGE ONLY */}
                {sec.type === "two-image" && (
                  <>
                    <input
                      type="file"
                      className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg mb-3 text-white"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const data = await uploadToCloudinary(file);

                        const updated = [...sections];

                        updated[i] = {
                          ...updated[i],
                          image: data.url,
                          image_public_id: data.public_id,
                        };

                        setSections(updated);
                      }}
                    />

                    <input
                      type="file"
                      className="w-full bg-slate-800 border border-white/10 p-3 rounded-lg mb-3 text-white"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const data = await uploadToCloudinary(file);

                        const updated = [...sections];

                        updated[i] = {
                          ...updated[i],
                          image2: data.url,
                          image2_public_id: data.public_id,
                        };

                        setSections(updated);
                      }}
                    />
                  </>
                )}

                {/* TEXT 1 */}
                {/* {sec.type !== "full-image" && ( */}
                {sec.type !== "full-image" && sec.type !== "two-image" && (
                  <div className="mt-3">
                    <Editor
                      value={sec.content || ""}
                      onChange={(val) =>
                        updateSection(i, "content", val)
                      }
                    />
                  </div>
                )}

                {/* TEXT 2 */}
                {sec.type === "two-text" && (
                  <div className="mt-4">
                    <Editor
                      value={sec.content2 || ""}
                      onChange={(val) =>
                        updateSection(i, "content2", val)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-10 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-indigo-100 transition shadow-xl active:scale-[0.98]"
          >
            Publish News
          </button>
        </div>
      </div>
    </div>
    // </Layout>
  );
}
