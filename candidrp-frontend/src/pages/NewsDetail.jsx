


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
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then((res) => res.json())
      .then((data) => {
        setAllNews(data);
        setPost(data.find((item) => item.slug === slug));
      });
  }, [slug]);

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">

        {/* GLOW */}
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>

        <div className="absolute w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-300"></div>

        <div className="flex flex-col items-center gap-8 z-10">

          <div className="relative px-10 py-8 rounded-2xl backdrop-blur-xl bg-white/60 border border-purple-100 shadow-xl">

            {/* TOP BAR */}
            <div className="absolute top-0 left-0 w-full h-[3px] overflow-hidden rounded-t-2xl">
              <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 animate-[slide_1.5s_linear_infinite]"></div>
            </div>

            {/* LOADER */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-16 h-16">

                <div className="absolute inset-0 rounded-full border-2 border-purple-200"></div>

                <div className="absolute inset-0 rounded-full border-2 border-t-purple-600 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>

                <div className="absolute inset-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full animate-ping opacity-30"></div>

              </div>
            </div>

            <p className="text-sm tracking-[0.3em] text-gray-600 text-center flex items-center justify-center gap-1">
              LOADING
              <span className="animate-bounce [animation-delay:0ms]">.</span>
              <span className="animate-bounce [animation-delay:150ms]">.</span>
              <span className="animate-bounce [animation-delay:300ms]">.</span>
            </p>

          </div>
        </div>

        <style>
          {`
            @keyframes slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}
        </style>
      </div>
    );

  return (
    <div className="bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">

          {/* LEFT */}
          <div className="lg:col-span-2">

            <br />
            <br />
            <br />
            <br />

            {/* TITLE */}
            <div className="mb-12">

              {/* TAG */}
              <div className="mb-5">
                <span
                  className="
                    text-[10px]
                    font-bold
                    tracking-[0.25em]
                    uppercase
                    px-4 py-1
                    rounded-full
                    bg-purple-100
                    text-purple-600
                  "
                >
                  Official Press
                </span>
              </div>

              {/* HEADING */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">

                <span className="text-slate-900">
                  {post.title.split(" ")[0]}
                </span>{" "}

                <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                  {post.title.split(" ").slice(1).join(" ")}
                </span>

              </h1>

              {/* DATE */}
              <p className="mt-5 text-sm text-slate-500 flex items-center gap-2">

                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>

                {post.date
                  ? new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Recently Published"}
              </p>
            </div>

            {/* CONTENT */}
            <div
              className="
                article-content
                text-[17px]
                leading-[1.9]
                text-slate-700
              "
            >

              {post.sections?.map((sec, i) => {

                // WORD DOCUMENT
                // WORD DOCUMENT
if (sec.type === "word-document") {
  return (
    <div
      key={i}
      className="
        relative
        w-full
        overflow-hidden
        my-0
        py-0
      "
      style={{
        height: "2200px",
      }}
    >

      {/* CROPPED WORD VIEW */}
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sec.docx)}`}
        className="
          absolute
          top-0
          left-0
          w-[135%]
          border-0
          bg-white
        "
        style={{
          height: "2600px",
          border: "none",
          transform: "scale(1.12)",
          transformOrigin: "top left",
          marginLeft: "-11%",
          marginTop: "-140px",
          overflow: "hidden",
        }}
      />

      {/* TOP HIDE */}
      <div className="absolute top-0 left-0 w-full h-[120px] bg-white z-20 pointer-events-none" />

      {/* LEFT HIDE */}
      <div className="absolute top-0 left-0 w-[90px] h-full bg-white z-20 pointer-events-none" />

      {/* RIGHT HIDE */}
      <div className="absolute top-0 right-0 w-[90px] h-full bg-white z-20 pointer-events-none" />

      {/* PAGE GAP HIDER */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-transparent" />

    </div>
  );
}

                // SUBTITLE
                if (sec.type === "subtitle") {
                  return (
                    <div
                      key={i}
                      className="
                      mobile-content-fix
                        text-xl
                        md:text-2xl
                        font-semibold
                        text-slate-800
                        leading-snug
                        my-8
                        border-l-4
                        border-purple-500
                        pl-5
                      "
                      dangerouslySetInnerHTML={{
                        __html: sec.content,
                      }}
                    />
                  );
                }

                // FULL TEXT
                // if (sec.type === "text") {
                //   return (
                //     <div
                //       key={i}
                //       className="my-6"
                //       dangerouslySetInnerHTML={{
                //         __html: sec.content,
                //       }}
                //     />
                //   );
                // }
                if (sec.type === "text") {
  return (
    <div
      key={i}
      className="my-6 mobile-content-fix"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: sec.content,
        }}
      />
    </div>
  );
}

                // IMAGE LEFT
                if (sec.type === "image-left") {
                  return (
                    <div
                      key={i}
                      className="grid md:grid-cols-2 gap-8 my-10 items-start min-w-0"
                    >

                      {sec.image &&
                        sec.image.trim() !== "" && (
                          <img
                            src={sec.image}
                            className="
                              rounded-2xl
                              w-full
                              object-cover
                            "
                          />
                        )}

                      <div
                       className="mobile-content-fix min-w-0"
                        dangerouslySetInnerHTML={{
                          __html: sec.content,
                        }}
                      />
                    </div>
                  );
                }

                // IMAGE RIGHT
                if (sec.type === "image-right") {
                  return (
                    <div
                      key={i}
                      className="grid md:grid-cols-2 gap-8 my-10 items-start min-w-0"
                    >

                      <div
                       className="mobile-content-fix min-w-0"
                        dangerouslySetInnerHTML={{
                          __html: sec.content,
                        }}
                      />

                      {sec.image &&
                        sec.image.trim() !== "" && (
                          <img
                            src={sec.image}
                            className="
                              rounded-2xl
                              w-full
                              object-cover
                            "
                          />
                        )}
                    </div>
                  );
                }

                // TWO TEXT
                if (sec.type === "two-text") {
                  return (
                    <div
                      key={i}
                      className="grid md:grid-cols-2 gap-12 my-10"
                    >

                      <div
                       className="mobile-content-fix min-w-0"
                        dangerouslySetInnerHTML={{
                          __html: sec.content,
                        }}
                      />

                      <div
                       className="mobile-content-fix min-w-0"
                        dangerouslySetInnerHTML={{
                          __html: sec.content2,
                        }}
                      />

                    </div>
                  );
                }

                // TWO IMAGE
                if (sec.type === "two-image") {
                  return (
                    <div
                      key={i}
                      className="grid md:grid-cols-2 gap-8 my-10"
                    >

                      {sec.image &&
                        sec.image.trim() !== "" && (
                          <img
                            src={sec.image}
                            className="
                              rounded-2xl
                              w-full
                              object-cover
                            "
                          />
                        )}

                      {sec.image2 &&
                        sec.image2.trim() !== "" && (
                          <img
                            src={sec.image2}
                            className="
                              rounded-2xl
                              w-full
                              object-cover
                            "
                          />
                        )}

                    </div>
                  );
                }

                // FULL IMAGE
                if (sec.type === "full-image") {

                  if (!sec.image || sec.image.trim() === "")
                    return null;

                  return (
                    <img
                      key={i}
                      src={sec.image}
                      className="
                        w-full
                        my-10
                        rounded-2xl
                      "
                    />
                  );
                }

                return null;
              })}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside className="lg:col-span-1">

            <div className="sticky top-28 space-y-10">

              {/* TITLE */}
              <div>

                <h4
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    bg-gradient-to-r
                    from-purple-600
                    to-fuchsia-500
                    bg-clip-text
                    text-transparent
                    mb-4
                    text-center
                  "
                >
                  More News & Events
                </h4>

                <div className="h-[1px] bg-gradient-to-r from-purple-200 via-purple-300 to-transparent" />

              </div>

              {/* NEWS */}
              <div className="space-y-5">

                {allNews
                  .filter((item) => item.slug !== slug)
                  .map((item, idx) => {

                    const image =
                      item.sections?.find(
                        (sec) =>
                          sec.image &&
                          sec.image.trim() !== ""
                      )?.image || null;

                    return (
                      <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2 + idx * 0.08,
                        }}
                      >

                        <Link
                          to={`/news/${item.slug}`}
                          className="
                            group
                            relative
                            flex
                            items-center
                            gap-4
                            p-4
                            rounded-2xl
                            bg-white/70
                            backdrop-blur-md
                            border
                            border-purple-100
                            hover:border-purple-300
                            hover:shadow-xl
                            hover:shadow-purple-100/50
                            transition-all
                            duration-300
                            hover:-translate-y-1
                          "
                        >

                          {/* IMAGE */}
                          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">

                            {image ? (
                              <img
                                src={image}
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                  group-hover:scale-105
                                  transition
                                "
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}

                          </div>

                          {/* TEXT */}
                          <div className="flex-1">

                            <h5
                              className="
                                text-sm
                                font-semibold
                                leading-snug
                                text-slate-700
                                group-hover:text-purple-600
                                transition-colors
                              "
                            >
                              {item.title}
                            </h5>

                            <p className="text-xs text-slate-400 mt-1">
                              {item.date
                                ? new Date(item.date).toLocaleDateString()
                                : ""}
                            </p>

                          </div>

                          {/* ARROW */}
                          <span
                            className="
                              text-slate-300
                              text-lg
                              group-hover:text-purple-500
                              group-hover:translate-x-1
                              transition-all
                              duration-300
                            "
                          >
                            &gt;
                          </span>

                          {/* HOVER */}
                          <div
                            className="
                              absolute
                              inset-0
                              rounded-2xl
                              opacity-0
                              group-hover:opacity-100
                              transition
                              bg-gradient-to-r
                              from-purple-100/30
                              via-transparent
                              to-purple-100/30
                            "
                          />

                        </Link>
                      </motion.div>
                    );
                  })}
              </div>

            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
