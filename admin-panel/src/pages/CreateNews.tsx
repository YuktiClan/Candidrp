

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

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const addSection = (type: string) => {
    setSections((prev) => [
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

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("⚠ Please enter a title before publishing!");
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/add-news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        sections,
      }),
    });

    alert("News Created ✅");

    setTitle("");
    setSections([]);
  };

  const imageClass =
    "w-full h-auto object-contain rounded-2xl border border-slate-200 bg-white";

  const cardClass =
    "bg-white border border-slate-200 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)]";

  const uploadInputClass =
    "w-full border border-slate-200 bg-white rounded-2xl px-4 py-4 text-slate-700 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-xl file:bg-indigo-600 file:text-white file:font-semibold";

  return (

<div className="w-full flex justify-center overflow-hidden relative p-5 md:p-7 rounded-[2.5rem] bg-[#030b2a] border border-white/10 shadow-[0_40px_120px_rgba(2,6,23,0.65)]">

  {/* DARK BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#081028] to-[#dfe6ef]" />

  {/* WHITE FADE BOTTOM */}
  <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gradient-to-t from-white/80 via-white/30 to-transparent blur-[90px]" />

  {/* TOP GLOW */}
  <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-indigo-500/10 blur-[120px] rounded-full" />

  {/* BOTTOM GLOW */}
  <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-purple-500/10 blur-[120px] rounded-full" />

  {/* MAIN INNER CONTAINER */}
  <div className="
    relative z-10
    w-full
    rounded-[1.2rem]
    border border-white/20
    bg-white/10
    backdrop-blur-xl
    shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
    overflow-hidden
  ">

    {/* INNER LIGHT BACKGROUND */}
    <div className="absolute inset-0 bg-[#f4f7fb]" />

    {/* SOFT WHITE OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/20" />

    {/* PAGE CONTENT */}
    <div className="relative z-10">



    <div className="min-h-screen bg-[#f5f7fb] overflow-hidden relative ">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fbff] via-[#f5f7fb] to-[#eef2f7]" />

      {/* GLOW */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[120px]" />

      {/* GRID */}
      <div
        className={`absolute inset-0 opacity-[0.04] transition-all duration-[2500ms] ${
          mounted ? "translate-y-0" : "translate-y-20"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 md:px-10 py-10">

        {/* HEADER */}
        <div
          className={`text-center mb-14 transition-all duration-1000 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          

          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
            Create{" "}
<span className="bg-gradient-to-r from-[#14532d] via-[#16a34a] to-[#4ade80] bg-clip-text text-transparent">
  Article
</span>
          </h1>

          
        </div>

        {/* TITLE */}
        <div className={`${cardClass} p-6 md:p-8 mb-12`}>
          <label className="block text-sm font-bold text-slate-700 mb-4">
            Article Title
          </label>

          <input
            className="
              w-full
              border border-slate-200
              bg-[#f8fafc]
              rounded-2xl
              px-6 py-5
              text-lg
              text-slate-800
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-4
              focus:ring-indigo-100
              focus:border-indigo-400
            "
            placeholder="Enter your article headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* BUTTON AREA */}
        <div className="grid lg:grid-cols-3 gap-8 mb-14">

          {/* LEFT */}
          <div className={`${cardClass} p-6`}>
            <h3 className="text-xl font-bold text-slate-800 mb-5">
              Text Layouts
            </h3>

            <div className="flex flex-col gap-4">
              {layouts.left.map((l, i) => (
                <button
  key={i}
  onClick={() => addSection(l.type)}
  className="
    w-full
    px-5 py-3
    rounded-2xl

    bg-[#1f7a45]

    text-white
    font-semibold
    text-[17px]
    tracking-[-0.01em]

    border border-white/10

    shadow-[0_10px_30px_rgba(31,122,69,0.22)]

    hover:bg-[#17663a]
    hover:shadow-[0_18px_45px_rgba(31,122,69,0.32)]
    hover:scale-[1.015]
    hover:-translate-y-1

    active:scale-[0.99]

    transition-all duration-300
  "
>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* CENTER */}
          <div className="flex items-center justify-center">

            <div className="text-center">

              
              <h3 className="mt-6 text-2xl font-bold text-slate-800">
                Mixed Layouts
              </h3>

              <p className="mt-3 text-slate-500 max-w-xs mx-auto leading-relaxed">
                Create dynamic article sections using combined image and text
                layouts.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {layouts.center.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => addSection(l.type)}
                    className="
                      px-5 py-4
                      rounded-2xl
                      bg-white
                      border border-slate-200
                      text-slate-700
                      font-semibold
                      hover:border-indigo-300
                      hover:-translate-y-1
                      shadow-sm
                      transition-all
                    "
                  >
                    {l.label}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className={`${cardClass} p-6`}>
            <h3 className="text-xl font-bold text-slate-800 mb-5">
              Image Layouts
            </h3>

            <div className="flex flex-col gap-4">
              {layouts.right.map((l, i) => (
                <button
                  key={i}
                  onClick={() => addSection(l.type)}
                  className="
                    w-full
                    px-5 py-3
                    rounded-2xl
                    bg-white
                    border border-slate-200
                    text-slate-700
                    font-semibold
                    shadow-sm
                    hover:border-indigo-300
                    hover:-translate-y-1
                    transition-all
                  "
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-10">

          {sections.map((sec, i) => (
            <div key={i} className={`${cardClass} p-6 md:p-8 relative`}>

              {/* REMOVE */}
              <button
                onClick={() => removeSection(i)}
                className="
                  absolute top-5 right-5
                  w-10 h-10 rounded-full
                  bg-red-50 border border-red-100
                  text-red-500 font-bold
                  hover:bg-red-500 hover:text-white
                  transition-all
                "
              >
                ✕
              </button>

              {/* TYPE */}
              <div className="mb-7">
                <span className="inline-flex px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold capitalize">
                  {sec.type.replace(/-/g, " ")}
                </span>
              </div>

              {/* FULL TEXT */}
              {(sec.type === "text" || sec.type === "subtitle") && (
                <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 min-h-[220px]">
                  <Editor
                    value={sec.content || ""}
                    onChange={(val) => updateSection(i, "content", val)}
                  />
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

                        const updated = [...sections];

                        updated[i] = {
                          ...updated[i],
                          image: data.url,
                          image_public_id: data.public_id,
                        };

                        setSections(updated);
                      }}
                    />

                    {sec.image && (
                      <div className="mt-5">
                        <img
                          src={sec.image}
                          alt="preview"
                          className={imageClass}
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 min-h-[320px]">
                    <Editor
                      value={sec.content || ""}
                      onChange={(val) => updateSection(i, "content", val)}
                    />
                  </div>
                </div>
              )}

              {/* IMAGE RIGHT */}
              {sec.type === "image-right" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 min-h-[320px] order-2 xl:order-1">
                    <Editor
                      value={sec.content || ""}
                      onChange={(val) => updateSection(i, "content", val)}
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

                        const updated = [...sections];

                        updated[i] = {
                          ...updated[i],
                          image: data.url,
                          image_public_id: data.public_id,
                        };

                        setSections(updated);
                      }}
                    />

                    {sec.image && (
                      <div className="mt-5">
                        <img
                          src={sec.image}
                          alt="preview"
                          className={imageClass}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TWO TEXT */}
              {sec.type === "two-text" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 min-h-[320px]">
                    <Editor
                      value={sec.content || ""}
                      onChange={(val) => updateSection(i, "content", val)}
                    />
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 min-h-[320px]">
                    <Editor
                      value={sec.content2 || ""}
                      onChange={(val) => updateSection(i, "content2", val)}
                    />
                  </div>
                </div>
              )}

              {/* TWO IMAGE */}
              {sec.type === "two-image" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

                    <input
                      type="file"
                      className={uploadInputClass}
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

                    {sec.image && (
                      <div className="mt-5">
                        <img
                          src={sec.image}
                          alt="preview"
                          className={imageClass}
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5">

                    <input
                      type="file"
                      className={uploadInputClass}
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

                    {sec.image2 && (
                      <div className="mt-5">
                        <img
                          src={sec.image2}
                          alt="preview"
                          className={imageClass}
                        />
                      </div>
                    )}
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

                      const updated = [...sections];

                      updated[i] = {
                        ...updated[i],
                        image: data.url,
                        image_public_id: data.public_id,
                      };

                      setSections(updated);
                    }}
                  />

                  {sec.image && (
                    <div className="mt-5">
                      <img
                        src={sec.image}
                        alt="preview"
                        className={imageClass}
                      />
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <div className="mt-16 flex justify-center">

          <button
  onClick={handleSubmit}
  className="
    group
    relative
    px-16
    py-5
    rounded-[2rem]
    overflow-hidden
    bg-[linear-gradient(135deg,#0f3d25_0%,#166534_35%,#16a34a_65%,#4ade80_100%)]
    text-white
    font-bold
    text-lg
    tracking-[-0.02em]

    border
    border-white/10

    shadow-[0_12px_25px_rgba(0,0,0,0.15),0_30px_60px_rgba(22,101,52,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)]

    hover:shadow-[0_20px_40px_rgba(0,0,0,0.2),0_40px_80px_rgba(22,101,52,0.45),inset_0_1px_1px_rgba(255,255,255,0.2)]

    hover:-translate-y-[4px]
    active:translate-y-[2px]

    transition-all
    duration-300
  "
>

  {/* TOP LIGHT */}
  <div className="
    absolute
    inset-x-4
    top-[2px]
    h-[45%]
    rounded-full
    bg-white/15
    blur-xl
  " />

  {/* SHINE EFFECT */}
  <div className="
    absolute
    inset-0
    opacity-0
    group-hover:opacity-100
    transition-opacity
    duration-500
    bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.18)_50%,transparent_80%)]
  " />

  {/* BUTTON TEXT */}
  <span className="relative z-10 flex items-center gap-3">

    <span className="
      w-3 h-3 rounded-full
      bg-white
      shadow-[0_0_15px_rgba(255,255,255,0.9)]
    " />

    Publish Article

  </span>
</button>

        </div>
      </div>
    </div>

</div>
    </div>
     </div>
    
  );
}
