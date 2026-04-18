
import React, { useRef, useEffect } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function Editor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const format = (command: string, value: any = null) => {
    document.execCommand(command, false, value);
  };

  // ✅ Only set initial value ONCE
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, []);

  return (
    <div className="border rounded bg-white shadow-sm">

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-100">
        <button onClick={() => format("bold")} className="px-2 py-1 border rounded">B</button>
        <button onClick={() => format("italic")} className="px-2 py-1 border rounded">I</button>
        <button onClick={() => format("underline")} className="px-2 py-1 border rounded">U</button>

        <button onClick={() => format("justifyLeft")} className="px-2 py-1 border rounded">L</button>
        <button onClick={() => format("justifyCenter")} className="px-2 py-1 border rounded">C</button>
        <button onClick={() => format("justifyRight")} className="px-2 py-1 border rounded">R</button>
        <button onClick={() => format("justifyFull")} className="px-2 py-1 border rounded">J</button>

        <input
          type="color"
          className="w-8 h-8 border rounded"
          onChange={(e) => format("foreColor", e.target.value)}
        />
      </div>

      {/* ✅ FIXED EDITOR */}
      <div
        ref={ref}
        contentEditable
        onInput={(e) =>
          onChange((e.target as HTMLDivElement).innerHTML)
        }
        className="p-3 min-h-[150px] outline-none"
      />
    </div>
  );
}