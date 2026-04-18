import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";






export default function NewsDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allNews, setAllNews] = useState([]);

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then((res) => res.json())
      // .then((data) => {
      //   setPost(data.find((item) => item.slug === slug));
      // });
      .then((data) => {
        setAllNews(data);
        setPost(data.find((item) => item.slug === slug));
      });
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />

      {/* <div className="max-w-6xl mx-auto p-6"> */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* <h1 className="text-4xl font-bold mb-6">{post.title}</h1> */}


          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            <br /><br /><br /><br />

            {/* Title */}
            <div className="mb-10">

              {/* SMALL TAG */}
              <div className="mb-4">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase px-4 py-1 rounded-full 
                      bg-purple-100 text-purple-600">
                  Official Press
                </span>
              </div>

              {/* BIG TITLE */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">

                {/* FIRST WORD */}
                <span className="text-slate-900">
                  {post.title.split(" ")[0]}
                </span>{" "}

                {/* REST WITH GRADIENT */}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                  {post.title.split(" ").slice(1).join(" ")}
                </span>

              </h1>

              {/* Publish Date */}
              <p className="mt-4 text-sm text-slate-500 flex items-center gap-2">

                {/* DOT */}
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>

                {/* DATE */}
                {post.date
                  ? new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "Recently Published"}

              </p>

            </div>

            {post.sections?.map((sec, i) => {

              // ✅ 1. SUBTITLE (ADD HERE)
              if (sec.type === "subtitle") {
                return (
                  <div
                    key={i}
                    className="
                    text-xl md:text-2xl font-semibold 
                    text-slate-800 leading-snug 
                    my-6 border-l-4 border-purple-500 pl-4
                  "
                    dangerouslySetInnerHTML={{ __html: sec.content }}
                  />
                );
              }



              // FULL TEXT
              if (sec.type === "text") {
                return (
                  <div key={i} dangerouslySetInnerHTML={{ __html: sec.content }} />
                );
              }

              // IMAGE LEFT
              if (sec.type === "image-left") {
                return (
                  <div key={i} className="grid md:grid-cols-2 gap-6 my-6">

                    {sec.image && sec.image.trim() !== "" && (
                      <img src={sec.image} className="rounded" />
                    )}

                    <div dangerouslySetInnerHTML={{ __html: sec.content }} />
                  </div>
                );
              }

              // IMAGE RIGHT
              if (sec.type === "image-right") {
                return (
                  <div key={i} className="grid md:grid-cols-2 gap-6 my-6">
                    <div dangerouslySetInnerHTML={{ __html: sec.content }} />
                    {sec.image && sec.image.trim() !== "" && (
                      <img src={sec.image} className="rounded" />
                    )}
                  </div>
                );
              }

              // TWO TEXT
              if (sec.type === "two-text") {
                return (
                  <div key={i} className="grid md:grid-cols-2 gap-12 my-6">
                    <div dangerouslySetInnerHTML={{ __html: sec.content }} />

                    <div dangerouslySetInnerHTML={{ __html: sec.content2 }} />
                  </div>
                );
              }

              // TWO IMAGE
              if (sec.type === "two-image") {
                return (
                  <div key={i} className="grid md:grid-cols-2 gap-6 my-6">
                    <div
                      style={{
                        padding: sec.imageSettings?.padding || 0,
                        background: "#fff",
                      }}
                    >
                      {sec.image && sec.image.trim() !== "" && (
                        <img
                          src={sec.image}
                          style={{
                            width: "100%",
                            objectFit: sec.imageSettings?.objectFit || "cover",
                            borderRadius: sec.imageSettings?.borderRadius || 0,
                            aspectRatio: sec.imageSettings?.aspectRatio || "auto",
                          }}
                        />
                      )}
                    </div>
                    {sec.image2 && sec.image2.trim() !== "" && (
                      <img src={sec.image2} />
                    )}
                  </div>
                );
              }

              // FULL IMAGE
              if (sec.type === "full-image") {
                if (!sec.image || sec.image.trim() === "") return null;

                return (
                  <img
                    key={i}
                    src={sec.image}
                    className="w-full my-6 rounded"
                  />
                );
              }

              return null;
            })}
          </div>
          {/* RIGHT SIDE - MORE NEWS */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-10">


              {/* ================= TITLE ================= */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] 
                      bg-gradient-to-r from-purple-600 to-fuchsia-500 
                      bg-clip-text text-transparent mb-4 text-center">
                  More News & Events
                </h4>

                <div className="h-[1px] bg-gradient-to-r from-purple-200 via-purple-300 to-transparent" />
              </div>

              {/* ================= NEWS LIST ================= */}
              <div className="space-y-5">
                {allNews
                  .filter((item) => item.slug !== slug)
                  .map((item, idx) => {

                    const image =
                      item.sections?.find(sec => sec.image && sec.image.trim() !== "")?.image || null;

                    return (
                      <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.08 }}
                      >
                        <Link
                          to={`/news/${item.slug}`}
                          className="
                              group relative flex items-center gap-4 p-4
                              rounded-2xl 
                              bg-white/70 backdrop-blur-md
                              border border-purple-100
                              hover:border-purple-300
                              hover:shadow-xl hover:shadow-purple-100/50
                              transition-all duration-300
                              hover:-translate-y-1
                            "
                        >

                          {/* 🖼 IMAGE */}
                          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {image ? (
                              <img
                                src={image}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>

                          {/* TEXT CONTENT */}
                          <div className="flex-1">

                            <h5 className="
                                text-sm font-semibold leading-snug
                                text-slate-700
                                group-hover:text-purple-600
                                transition-colors
                              ">
                              {item.title}
                            </h5>

                            <p className="text-xs text-slate-400 mt-1">
                              {item.date
                                ? new Date(item.date).toLocaleDateString()
                                : ""}
                            </p>

                          </div>

                          {/* ARROW */}
                          <span className="
                              text-slate-300 text-lg
                              group-hover:text-purple-500
                              group-hover:translate-x-1
                              transition-all duration-300
                            ">
                            &gt;
                          </span>

                          {/* HOVER GLOW */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition 
                              bg-gradient-to-r from-purple-100/30 via-transparent to-purple-100/30" />

                        </Link>
                      </motion.div>
                    );
                  })}
              </div>

              {/* ================= CTA ================= */}
              <motion.div
                whileHover={{ y: -4 }}
                className="
                      relative p-8 rounded-3xl
                      bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900
                      text-white overflow-hidden
                      shadow-2xl
                    "
              >
                {/* Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-800/30 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h4 className="text-xl font-semibold mb-3">
                    Let’s Build Your Team
                  </h4>

                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    Connect with us and discover how we can help you scale faster.
                  </p>

                  <Link
                    to="/contact"
                    className="
                          block text-center w-full py-3 rounded-xl
                          bg-white text-slate-900 font-medium
                          hover:bg-purple-50
                          transition-all
                        "
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.div>

            </div>
          </aside>
        </div>
      </div>


      <Footer />
    </div>
  );
}