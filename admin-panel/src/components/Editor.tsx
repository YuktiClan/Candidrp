
// import React, { useRef, useEffect } from "react";

// type Props = {
//   value: string;
//   onChange: (val: string) => void;
// };

// export default function Editor({ value, onChange }: Props) {
//   const ref = useRef<HTMLDivElement>(null);

//   const format = (command: string, value: any = null) => {
//     document.execCommand(command, false, value);
//   };

//   // ✅ Only set initial value ONCE
//   useEffect(() => {
//     if (ref.current && ref.current.innerHTML !== value) {
//       ref.current.innerHTML = value || "";
//     }
//   }, []);

//   return (
//     <div className="border rounded bg-white shadow-sm">

//       {/* TOOLBAR */}
//       <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-100">
//         <button onClick={() => format("bold")} className="px-2 py-1 border rounded">B</button>
//         <button onClick={() => format("italic")} className="px-2 py-1 border rounded">I</button>
//         <button onClick={() => format("underline")} className="px-2 py-1 border rounded">U</button>

//         <button onClick={() => format("justifyLeft")} className="px-2 py-1 border rounded">L</button>
//         <button onClick={() => format("justifyCenter")} className="px-2 py-1 border rounded">C</button>
//         <button onClick={() => format("justifyRight")} className="px-2 py-1 border rounded">R</button>
//         <button onClick={() => format("justifyFull")} className="px-2 py-1 border rounded">J</button>

//         <input
//           type="color"
//           className="w-8 h-8 border rounded"
//           onChange={(e) => format("foreColor", e.target.value)}
//         />
//       </div>

//       {/* ✅ FIXED EDITOR */}
//       <div
//         ref={ref}
//         contentEditable
//         onInput={(e) =>
//           onChange((e.target as HTMLDivElement).innerHTML)
//         }
//         className="p-3 min-h-[150px] outline-none"
//       />
//     </div>
//   );
// }



import React, {
  useEffect,
  useRef,
  useState,
} from "react";

// ============================================================================
// TYPES
// ============================================================================

type TextFormat = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  foreColor: string;
  fontSize: string;
  fontName: string;
};

// ============================================================================
// GLOBAL FORMAT PAINTER STATE
// ============================================================================

let globalCopiedFormat: TextFormat | null = null;

const subscribers = new Set<() => void>();

const syncEditors = () => {
  subscribers.forEach((update) => update());
};

// ============================================================================
// EDITOR
// ============================================================================

export default function Editor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // ==========================================================================
  // SELECTION
  // ==========================================================================

  const savedRange = useRef<Range | null>(null);

  // ==========================================================================
  // LAST HTML SENT BY THIS EDITOR
  //
  // Prevents React state updates from replacing innerHTML on every keystroke.
  // This prevents cursor jumping and selection loss.
  // ==========================================================================

  const lastEditorHtml = useRef("");

  // ==========================================================================
  // FORMAT PAINTER
  // ==========================================================================

  const [isPainting, setIsPainting] = useState(false);

  // ==========================================================================
  // FORMAT PAINTER GLOBAL SYNC
  // ==========================================================================

  useEffect(() => {
    const handleUpdate = () => {
      setIsPainting(
        globalCopiedFormat !== null
      );
    };

    subscribers.add(handleUpdate);

    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  // ==========================================================================
  // LOAD / UPDATE VALUE
  // ==========================================================================

  useEffect(() => {
    const editor = ref.current;

    if (!editor) return;

    const incomingValue = value || "";

    // ------------------------------------------------------------------------
    // FIRST RENDER
    // ------------------------------------------------------------------------

    if (
      lastEditorHtml.current === "" &&
      editor.innerHTML === ""
    ) {
      editor.innerHTML = incomingValue;

      lastEditorHtml.current =
        incomingValue;

      return;
    }

    // ------------------------------------------------------------------------
    // VALUE WAS GENERATED BY THIS EDITOR
    //
    // Do not replace the DOM.
    // ------------------------------------------------------------------------

    if (
      incomingValue ===
      lastEditorHtml.current
    ) {
      return;
    }

    // ------------------------------------------------------------------------
    // EXTERNAL VALUE CHANGE
    //
    // Example:
    //
    // Opening an existing article from MongoDB.
    //
    // Or loading AI-generated article HTML.
    // ------------------------------------------------------------------------

    if (
      editor.innerHTML !==
      incomingValue
    ) {
      editor.innerHTML =
        incomingValue;
    }

    lastEditorHtml.current =
      incomingValue;
  }, [value]);

  // ==========================================================================
  // SAVE CURRENT SELECTION
  // ==========================================================================

  const saveSelection = () => {
    const editor = ref.current;

    if (!editor) return;

    const selection =
      window.getSelection();

    if (
      !selection ||
      selection.rangeCount === 0
    ) {
      return;
    }

    const range =
      selection.getRangeAt(0);

    // Only save selections belonging to
    // this editor.

    if (
      editor.contains(
        range.commonAncestorContainer
      )
    ) {
      savedRange.current =
        range.cloneRange();
    }
  };

  // ==========================================================================
  // RESTORE LAST SELECTION
  // ==========================================================================

  const restoreSelection = () => {
    const editor = ref.current;

    const range =
      savedRange.current;

    if (!editor || !range) {
      return false;
    }

    try {
      const selection =
        window.getSelection();

      if (!selection) {
        return false;
      }

      selection.removeAllRanges();

      selection.addRange(range);

      editor.focus();

      return true;
    } catch {
      return false;
    }
  };

  // ==========================================================================
  // EXECUTE FORMAT COMMAND
  // ==========================================================================

  const format = (
    command: string,
    val?: string
  ) => {
    const editor = ref.current;

    if (!editor) return;

    // Restore previous text selection.
    restoreSelection();

    try {
      document.execCommand(
        command,
        false,
        val
      );
    } catch (error) {
      console.error(
        `Formatting command failed: ${command}`,
        error
      );
    }

    // Save updated HTML.
    const html =
      editor.innerHTML;

    lastEditorHtml.current =
      html;

    onChange(html);

    // Save resulting selection.
    saveSelection();
  };

  // ==========================================================================
  // FORMAT PAINTER - COPY
  // ==========================================================================

  const handleCopyFormat = () => {
    const editor = ref.current;

    if (!editor) return;

    // ------------------------------------------------------------------------
    // If painter is already active, turn it off.
    // ------------------------------------------------------------------------

    if (globalCopiedFormat) {
      globalCopiedFormat = null;

      syncEditors();

      return;
    }

    // Restore current selection.
    restoreSelection();

    // ------------------------------------------------------------------------
    // Copy current formatting.
    // ------------------------------------------------------------------------

    globalCopiedFormat = {
      bold:
        document.queryCommandState(
          "bold"
        ),

      italic:
        document.queryCommandState(
          "italic"
        ),

      underline:
        document.queryCommandState(
          "underline"
        ),

      foreColor:
        document.queryCommandValue(
          "foreColor"
        ) || "",

      fontSize:
        document.queryCommandValue(
          "fontSize"
        ) || "3",

      fontName:
        document.queryCommandValue(
          "fontName"
        ) || "Arial",
    };

    syncEditors();
  };

  // ==========================================================================
  // FORMAT PAINTER - APPLY
  // ==========================================================================

  const handleApplyFormatOnMouseUp =
    () => {
      if (!globalCopiedFormat) {
        return;
      }

      const editor = ref.current;

      if (!editor) return;

      // Save target selection.
      saveSelection();

      // Restore target selection.
      restoreSelection();

      // ----------------------------------------------------------------------
      // BOLD
      // ----------------------------------------------------------------------

      const currentBold =
        document.queryCommandState(
          "bold"
        );

      if (
        globalCopiedFormat.bold !==
        currentBold
      ) {
        document.execCommand(
          "bold",
          false
        );
      }

      // ----------------------------------------------------------------------
      // ITALIC
      // ----------------------------------------------------------------------

      const currentItalic =
        document.queryCommandState(
          "italic"
        );

      if (
        globalCopiedFormat.italic !==
        currentItalic
      ) {
        document.execCommand(
          "italic",
          false
        );
      }

      // ----------------------------------------------------------------------
      // UNDERLINE
      // ----------------------------------------------------------------------

      const currentUnderline =
        document.queryCommandState(
          "underline"
        );

      if (
        globalCopiedFormat.underline !==
        currentUnderline
      ) {
        document.execCommand(
          "underline",
          false
        );
      }

      // ----------------------------------------------------------------------
      // TEXT COLOR
      // ----------------------------------------------------------------------

      if (
        globalCopiedFormat.foreColor
      ) {
        document.execCommand(
          "foreColor",
          false,
          globalCopiedFormat.foreColor
        );
      }

      // ----------------------------------------------------------------------
      // FONT SIZE
      // ----------------------------------------------------------------------

      if (
        globalCopiedFormat.fontSize
      ) {
        document.execCommand(
          "fontSize",
          false,
          globalCopiedFormat.fontSize
        );
      }

      // ----------------------------------------------------------------------
      // FONT FAMILY
      // ----------------------------------------------------------------------

      if (
        globalCopiedFormat.fontName
      ) {
        document.execCommand(
          "fontName",
          false,
          globalCopiedFormat.fontName
        );
      }

      // ----------------------------------------------------------------------
      // SAVE HTML
      // ----------------------------------------------------------------------

      const html =
        editor.innerHTML;

      lastEditorHtml.current =
        html;

      onChange(html);

      // Save selection.
      saveSelection();

      // Turn painter off.
      globalCopiedFormat = null;

      syncEditors();
    };

  // ==========================================================================
  // HANDLE INPUT
  // ==========================================================================

  const handleInput = (
    e: React.FormEvent<HTMLDivElement>
  ) => {
    const editor =
      e.currentTarget;

    const html =
      editor.innerHTML;

    // Remember exactly what this editor
    // sent to the parent.

    lastEditorHtml.current =
      html;

    onChange(html);

    saveSelection();
  };

  // ==========================================================================
  // HANDLE SELECTION CHANGE
  // ==========================================================================

  const handleSelectionChange =
    () => {
      saveSelection();
    };

  // ==========================================================================
  // PREVENT TOOLBAR FROM STEALING SELECTION
  // ==========================================================================

  const handleToolbarMouseDown =
    (
      e: React.MouseEvent
    ) => {
      e.preventDefault();

      saveSelection();
    };

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return (
    <div
      className="
        w-full
        border
        rounded-xl
        bg-white
        shadow-sm
        overflow-hidden
      "
    >

      {/* ================================================================== */}
      {/* TOOLBAR */}
      {/* ================================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          p-3
          border-b
          bg-gray-50
        "
      >

        {/* ================================================================ */}
        {/* FONT FAMILY */}
        {/* ================================================================ */}

        <select
          defaultValue="Arial"
          onMouseDown={() =>
            saveSelection()
          }
          onChange={(e) =>
            format(
              "fontName",
              e.target.value
            )
          }
          className="
            px-2
            py-1
            border
            rounded
            bg-white
            text-sm
            w-32
          "
          title="Font Family"
        >
          <option value="Arial">
            Arial
          </option>

          <option value="Georgia">
            Georgia
          </option>

          <option value="Impact">
            Impact
          </option>

          <option value="Tahoma">
            Tahoma
          </option>

          <option value="Times New Roman">
            Times
          </option>

          <option value="Verdana">
            Verdana
          </option>
        </select>

        {/* ================================================================ */}
        {/* FONT SIZE */}
        {/* ================================================================ */}

        <select
          defaultValue="3"
          onMouseDown={() =>
            saveSelection()
          }
          onChange={(e) =>
            format(
              "fontSize",
              e.target.value
            )
          }
          className="
            px-2
            py-1
            border
            rounded
            bg-white
            text-sm
          "
          title="Font Size"
        >
          <option value="1">
            Small
          </option>

          <option value="2">
            Normal
          </option>

          <option value="3">
            Default
          </option>

          <option value="4">
            Large
          </option>

          <option value="5">
            X-Large
          </option>

          <option value="6">
            XX-Large
          </option>

          <option value="7">
            Huge
          </option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* ================================================================ */}
        {/* BOLD */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("bold")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
            font-bold
          "
          title="Bold"
        >
          B
        </button>

        {/* ================================================================ */}
        {/* ITALIC */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("italic")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
            italic
          "
          title="Italic"
        >
          I
        </button>

        {/* ================================================================ */}
        {/* UNDERLINE */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("underline")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
            underline
          "
          title="Underline"
        >
          U
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* ================================================================ */}
        {/* ALIGN LEFT */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("justifyLeft")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
          "
          title="Align Left"
        >
          L
        </button>

        {/* ================================================================ */}
        {/* ALIGN CENTER */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("justifyCenter")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
          "
          title="Align Center"
        >
          C
        </button>

        {/* ================================================================ */}
        {/* ALIGN RIGHT */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("justifyRight")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
          "
          title="Align Right"
        >
          R
        </button>

        {/* ================================================================ */}
        {/* JUSTIFY */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format("justifyFull")
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
          "
          title="Justify"
        >
          J
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* ================================================================ */}
        {/* BULLET LIST */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format(
              "insertUnorderedList"
            )
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
          "
          title="Bullet List"
        >
          • List
        </button>

        {/* ================================================================ */}
        {/* NUMBERED LIST */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={() =>
            format(
              "insertOrderedList"
            )
          }
          className="
            px-3
            py-1
            border
            rounded
            bg-white
            hover:bg-gray-100
          "
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* ================================================================ */}
        {/* TEXT COLOR */}
        {/* ================================================================ */}

        <input
          type="color"
          className="
            w-8
            h-8
            border
            rounded
            cursor-pointer
            bg-white
          "
          onMouseDown={() =>
            saveSelection()
          }
          onChange={(e) =>
            format(
              "foreColor",
              e.target.value
            )
          }
          title="Text Color"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* ================================================================ */}
        {/* FORMAT PAINTER */}
        {/* ================================================================ */}

        <button
          type="button"
          onMouseDown={
            handleToolbarMouseDown
          }
          onClick={
            handleCopyFormat
          }
          title="Format Painter"
          className={`
            px-3
            py-1
            border
            rounded
            transition-colors
            ${
              isPainting
                ? "bg-blue-200 border-blue-400 shadow-inner"
                : "bg-white hover:bg-gray-100"
            }
          `}
        >
          🖌️
        </button>
      </div>

      {/* ================================================================== */}
      {/* EDITOR */}
      {/* ================================================================== */}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={() => {
          saveSelection();

          handleApplyFormatOnMouseUp();
        }}
        onKeyUp={
          handleSelectionChange
        }
        onSelect={
          handleSelectionChange
        }
        onBlur={() => {
          saveSelection();

          if (ref.current) {
            const html =
              ref.current.innerHTML;

            lastEditorHtml.current =
              html;

            onChange(html);
          }
        }}
        className="
          p-4
          min-h-[180px]
          outline-none
          text-slate-800
          leading-relaxed

          [&_ul]:list-disc
          [&_ul]:list-outside
          [&_ul]:pl-7
          [&_ul]:my-3

          [&_ol]:list-decimal
          [&_ol]:list-outside
          [&_ol]:pl-7
          [&_ol]:my-3

          [&_li]:list-item
          [&_li]:pl-1
          [&_li]:mb-1

          [&_ul_ul]:list-[circle]
          [&_ol_ol]:list-[lower-alpha]

          [&_ul_ul]:pl-7
          [&_ol_ol]:pl-7
        "
        style={{
          fontFamily: "Arial",
        }}
      />
    </div>
  );
}
