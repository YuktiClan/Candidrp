import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Save,
  Undo,
  Redo,
  Search,
  Plus,
  ChevronDown,
  Grid,
  FileText,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Trash2
} from 'lucide-react';


// -------------------------
// TYPES
// -------------------------
type Job = {
  id?: string;
  _id?: string;
  title: string;
  location: string;
  experience_from: string;
  experience_to: string;
  vacancy: string;
  industry: string;
  department: string;
  education: string;
  ctc: string;
  type: string;
  description: string;
  isSaved?: boolean;
  isEditing?: boolean;


  // // ✅ NEW FIELD
  // apply_link?: string;
};

type Field = {
  label: string;
  key: keyof Job;
  placeholder?: string;
  type?: "select";
  options?: string[];
  isTextarea?: boolean;
};

type ActiveCell = {
  rowIdx: number;
  colIdx: number;
} | null;

const App = () => {

  // -------------------------
  // EMPTY TEMPLATE
  // -------------------------
  const emptyJob: Job = {
    title: "",
    location: "",
    experience_from: "",
    experience_to: "",
    vacancy: "",
    industry: "",
    department: "",
    education: "",
    ctc: "",
    type: "",
    description: "",
    isSaved: false,
    isEditing: false,

    // apply_link: ""
  };

  // -------------------------
  // STATE
  // -------------------------
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeCell, setActiveCell] = useState<ActiveCell>(null);
  const [status, setStatus] = useState("Loading...");

  const [showFilter, setShowFilter] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);


  const [filters, setFilters] = useState({
    title: "",
    location: "",
    education: "",
    type: ""
  });

  // -------------------------
  // FIELDS
  // -------------------------
  const fields: Field[] = [
    { label: "Job Title", key: "title", placeholder: "e.g. Full Stack Developer" },
    { label: "Location", key: "location", placeholder: "e.g. Noida, Delhi, Remote" },
    { label: "Experience From", key: "experience_from", placeholder: "0" },
    { label: "Experience To", key: "experience_to", placeholder: "5" },
    { label: "Vacancy", key: "vacancy", placeholder: "1" },
    { label: "Industry", key: "industry", placeholder: "Tech" },
    { label: "Department", key: "department", placeholder: "Product" },
    { label: "Education", key: "education", placeholder: "Bachelors" },
    { label: "CTC ( Salary per Annum )", key: "ctc", placeholder: "10-15 LPA" },

    {
      label: "Type",
      key: "type",
      type: "select",
      options: ["Full-Time", "Part-Time", "Internship"]
    },
    // {
    //   label: "Apply Link (External URL)",
    //   key: "apply_link",
    //   placeholder: "https://your-apply-link.com"
    // },
    {
      label: "Description About Job Role, Requirements,etc.",
      key: "description",
      isTextarea: true,
      placeholder: "e.g. Job details, requirements, responsibilities"
    }
  ];

  // -------------------------
  // FETCH JOBS
  // -------------------------
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data: unknown = await response.json();

      const jobsArray: Job[] = Array.isArray(data) ? data : [];

      const savedJobs: Job[] = jobsArray.map((job) => ({
        ...job,
        isSaved: true,
        isEditing: false
      }));

      setJobs(savedJobs.length > 0 ? savedJobs : [{ ...emptyJob }]);
      setStatus("Ready");

    } catch (err) {
      console.error("Fetch Error:", err);
      setJobs([{ ...emptyJob }]);
      setStatus("Server Offline");
    }
  };

  useEffect(() => {
    console.log("API:", import.meta.env.VITE_API_URL);
    fetchJobs();
  }, []);

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  const handleChange = (jobIndex: number, key: keyof Job, value: string) => {
    setJobs(prev => {
      const updated = [...prev];

      if (updated[jobIndex]?.isSaved && !updated[jobIndex]?.isEditing) {
        return prev;
      }

      updated[jobIndex] = {
        ...updated[jobIndex],
        [key]: value
      };

      return updated;
    });
  };

  // -------------------------
  // ADD COLUMN
  // -------------------------
  const addNewJob = () => {
    setJobs(prev => [...prev, { ...emptyJob }]);
    setStatus("Added new job column");
  };

  // -------------------------
  // TOGGLE EDIT
  // -------------------------
  const toggleEdit = (index: number) => {
    setJobs(prev => {
      const updated = [...prev];
      const newEditState = !updated[index]?.isEditing;

      updated[index] = {
        ...updated[index],
        isEditing: newEditState
      };

      setStatus(newEditState ? "Unlocked for editing" : "Locked column");

      return updated;
    });
  };

  // -------------------------
  // DELETE JOB
  // -------------------------
  const deleteJob = async (index: number) => {
    const job = jobs[index];
    const jobId = job?._id || job?.id;

    if (!jobId) {
      setJobs(prev => prev.filter((_, i) => i !== index));
      setStatus("Removed column");
      return;
    }

    setStatus("Deleting...");

    try {
      const response = await fetch(
      `${import.meta.env.VITE_API_URL}/delete-job/${jobId}`,
      {
        method: "DELETE"
      });

      if (response.ok) {
        setJobs(prev => prev.filter((_, i) => i !== index));
        setStatus("Deleted from Database ✅");
      } else {
        setStatus("Delete failed: Record not found");
      }

    } catch {
      setStatus("Delete failed: Server error");
    }
  };




  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async () => {
    setStatus("Processing...");
    let hasError = false;

    const currentJobs = [...jobs];
    const results: Job[] = [];

    try {
      for (let i = 0; i < currentJobs.length; i++) {
        const job = currentJobs[i];

        if (job.isSaved && !job.isEditing) {
          results.push(job);
          continue;
        }

        if (!job.title || !job.location || !job.type) {
          setStatus(`Error: Job ${i + 1} incomplete`);
          hasError = true;
          break;
        }

        const jobId = job._id || job.id;
        const isUpdate = !!jobId;

        const url = isUpdate
  ? `${import.meta.env.VITE_API_URL}/update-job/${jobId}`
  : `${import.meta.env.VITE_API_URL}/add-job`;

        const method = isUpdate ? "PUT" : "POST";

        const { isSaved, isEditing, ...jobData } = job;

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData)
        });

        if (!response.ok) {
          console.warn(`Job ${i + 1} failed`);
          hasError = true;
          continue; // skip instead of crash
        }

        let savedJob: any = {};

        try {
          savedJob = await response.json();
        } catch {
          savedJob = {};
        }

        results.push({
          ...job, // fallback safe
          ...savedJob,
          _id: savedJob._id || job._id || savedJob.id,
          isSaved: true,
          isEditing: false
        });
      }

      if (!hasError) {
        setJobs(results);
        setStatus("All changes synchronized ✅");
      }

    } catch (err) {
      console.error("Submit Error:", err);
      setStatus("Sync Failed: Check server logs");
    }
  };

  // -------------------------
  // FORMULA BAR
  // -------------------------
  const getFormulaValue = (): string => {
    if (!activeCell) return "";

    const { rowIdx, colIdx } = activeCell;
    const fieldKey = fields[rowIdx]?.key;

    return (jobs[colIdx]?.[fieldKey] ?? "") as string;
  };

  const filteredJobs = jobs.filter(job => {
    return (
      (job.title || "").toLowerCase().includes(filters.title.toLowerCase()) &&
      (job.location || "").toLowerCase().includes(filters.location.toLowerCase()) &&
      (job.education || "").toLowerCase().includes(filters.education.toLowerCase()) &&
      (filters.type === "" || job.type === filters.type)
    );
  });



  return (
    // <Layout>
    <div className="w-full h-full flex flex-col">
      {/* <div className="flex flex-col h-full min-h-0 bg-[#f3f3f3] text-sm font-sans select-none overflow-hidden"> */}
<div className="w-full flex justify-center relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl h-auto">

  {/* 🌑 BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#e2e8f0]" />

  {/* ✨ LIGHT */}
  <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-[80px]" />

  {/* 🔥 BLOBS */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
  </div>

  {/* ✅ THIS WAS MISSING */}
  <div className="relative z-10 w-full p-4 md:p-6 flex flex-col h-auto">
    

    {/* ✅ OPTIONAL (GLASS BOX FOR EXCEL) */}
    <div className="mt-0 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/40 flex flex-col h-auto">
      {/* 👉 YOUR FULL EXISTING CODE (NO CHANGE) */}

        {/* Top Excel Bar */}
        <div className="bg-[#217346] flex items-center px-3 py-2 text-white justify-between flex-wrap">
            <div className="flex items-center gap-3">
                <FileSpreadsheet size={18} />
                <span className="font-semibold text-sm">
                Candid_Contacts_Manager.xlsx
                </span>
            </div>
            <h2 className="text-xs opacity-80">Powered by yuktic.com</h2>
        </div>

        {/* Ribbon Menu */}
        <div className="bg-white border-b border-gray-200 flex flex-col shrink-0">
          <div className="flex gap-6 px-4 pt-2 text-[11px] font-medium text-gray-600">
            <span className="text-[#217346] border-b-[3px] border-[#217346] cursor-pointer pb-1 font-bold">Job List</span>

          </div>

          <div className="flex items-center gap-2 p-1 bg-[#f9f9f9] border-t border-gray-200">
            <div className="grid grid-cols-3 gap-2 px-2 border-r border-gray-300 w-full md:w-auto">
              <div
                className="flex flex-col items-center justify-center h-[55px] w-full cursor-pointer hover:bg-gray-200 rounded text-center"
                onClick={() => setShowFilter(prev => !prev)}
              >
                <FileText size={20} className="text-[#217346]" />
                <span className="text-[9px] text-gray-500 mt-1">Filter</span>
              </div>
              <div
                className="flex flex-col items-center justify-center h-[55px] w-full cursor-pointer hover:bg-gray-200 rounded text-center"
                onClick={addNewJob}
              >
                <Plus size={18} className="text-[#217346]" />
                <span className="text-[9px] text-gray-500 leading-tight mt-1">
                  Add Job
                </span>
              </div>

              <div
                className="flex flex-col items-center justify-center h-[55px] w-full cursor-pointer hover:bg-gray-200 rounded text-center"
                onClick={handleSubmit}
              >
                <Save size={18} className="text-[#217346]" />
                <span className="text-[9px] text-gray-500 leading-tight mt-1">
                  Commit All
                </span>
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center md:justify-start mt-1 md:mt-0">
              <div className="flex items-center gap-1 text-gray-400 text-center md:text-left">
                <Grid size={14} />
                <span className="text-[10px] leading-tight">
                  Connected to MongoDB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center bg-white border-b border-gray-300 px-1 py-0.5 gap-1 shrink-0">
          <div className="w-16 text-center text-gray-700 font-sans text-xs bg-gray-50 border border-gray-200 py-0.5">
            {activeCell ? `${String.fromCharCode(66 + activeCell.colIdx)}${activeCell.rowIdx + 1}` : 'A1'}
          </div>
          <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
          <div className="text-gray-400 italic px-2 font-serif font-bold text-sm">fx</div>
          <input
            className="flex-1 outline-none text-[12px] py-1 px-2 bg-transparent"
            value={getFormulaValue()}
            readOnly
          />


          {showFilter && (
                    <div className="hidden md:flex items-center gap-2 ml-auto">

              <input
                type="text"
                placeholder="Job Title"
                className="border px-1 py-1 text-xs"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />

              <input
                type="text"
                placeholder="Location"
                className="border px-2 py-1 text-xs"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />

              <input
                type="text"
                placeholder="Education"
                className="border px-2 py-1 text-xs"
                value={filters.education}
                onChange={(e) => setFilters({ ...filters, education: e.target.value })}
              />

              <select
                className="border px-2 py-1 text-[10px]"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
              </select>

              <button
                className="bg-red-500 text-white px-3 py-1 text-xs rounded"
                onClick={() =>
                  setFilters({
                    title: "",
                    location: "",
                    education: "",
                    type: ""
                  })
                }
              >
                Clear
              </button>

            </div>
          )}
        </div>

        {/* Grid Canvas */}
        {/* ✅ MOBILE FILTER PANEL */}
        {showFilter && (
          <div className="md:hidden bg-white border-b border-gray-300 p-3 space-y-2">

            <input
              type="text"
              placeholder="Job Title"
              className="w-full border px-3 py-2 text-xs rounded"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />

            <input
              type="text"
              placeholder="Location"
              className="w-full border px-3 py-2 text-xs rounded"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />

            <input
              type="text"
              placeholder="Education"
              className="w-full border px-3 py-2 text-xs rounded"
              value={filters.education}
              onChange={(e) => setFilters({ ...filters, education: e.target.value })}
            />

            <select
              className="w-full border px-3 py-2 text-xs rounded"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </select>

            <button
              className="w-full bg-red-500 text-white py-2 text-xs rounded"
              onClick={() =>
                setFilters({
                  title: "",
                  location: "",
                  education: "",
                  type: ""
                })
              }
            >
              Clear Filters
            </button>
          </div>
        )}


        
        <div className="overflow-auto bg-[#f3f3f3]">
          <table className="border-separate border-spacing-0  w-max min-w-full">
            <thead className="sticky top-0 z-20">
              <tr className="h-6">

                {/* Empty corner (top-left like Excel) */}
              <th className="w-10 bg-[#e6e6e6] border-r border-b border-gray-300 sticky left-0 z-40"></th>


                {/* Column A (Property column) */}
              <th className="w-[300px] bg-[#e6e6e6] border-r border-b border-gray-300 text-center text-[11px] font-medium text-gray-600 sticky left-[40px] z-40">                  A
                </th>


                {/* Dynamic columns → B, C, D... */}
                {filteredJobs.map((_, i) => (
                  <th
                    key={`col-${i}`}
                    className="w-[280px] bg-[#e6e6e6] border-r border-b border-gray-300 text-center text-[11px] font-medium text-gray-600"
                  >
                    {String.fromCharCode(66 + i)} {/* B, C, D... */}
                  </th>
                ))}
              </tr>


              <tr className="h-5">
                <th className="w-10 bg-[#e6e6e6] border-r border-b border-gray-300 sticky left-0 z-40"></th>

              <th className="w-[300px] bg-[#e6e6e6] border-r border-b border-gray-300 text-[11px] font-normal text-gray-600 uppercase italic md:sticky md:left-[40px] z-30">                  Property (A)
                </th>

                {filteredJobs.map((job, i) => {
                  const actualIndex =
                    job._id || job.id
                      ? jobs.findIndex(j => (j._id || j.id) === (job._id || job.id))
                      : i;

                  return (
                    <th
                      key={`head-${i}`}
                      className={`w-[280px] border-r border-b border-gray-300 text-[11px] font-normal transition-colors relative group ${job.isSaved && !job.isEditing
                        ? "bg-gray-200 text-gray-500"
                        : "bg-[#e6e6e6] text-[#217346] font-bold"
                        }`}
                    >
                      <div className="flex items-center justify-between px-2 py-1">

                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-2">
                          {job.isSaved && !job.isEditing ? (
                            <Lock size={15} />
                          ) : (
                            <Unlock size={15} />
                          )}
                          <span>Job {i + 1}</span>

                          {job.isSaved && !job.isEditing && (
                            <CheckCircle2 size={12} className="text-[#217346]" />
                          )}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-2">

                          {job.isSaved && (
                            <button
                              onClick={() => toggleEdit(actualIndex)}
                              className={`text-[10px] px-4 py-1 rounded border transition-colors ${job.isEditing
                                ? "bg-[#217346] text-white border-[#217346]"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                              {job.isEditing ? "Editing..." : "Edit"}
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteIndex(actualIndex)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-50"
                            title="Delete Job"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody>
              {fields.map((field, rowIdx) => (
              <tr key={field.key}>                  
                                <td className="bg-[#e6e6e6] border-r border-b border-gray-300 text-center text-[10px] text-gray-500 font-medium sticky left-0 z-30">
                                  {rowIdx + 1}
                                </td>
              <td className="w-[300px] border-r border-b border-gray-200 bg-[#f9f9f9] px-4 text-[12px] text-gray-700 font-medium whitespace-nowrap md:sticky md:left-[40px] z-20 text-left">                    {field.label}
                  </td>

                  {filteredJobs.map((job, colIdx) => {
                    const actualIndex =
                      job._id || job.id
                        ? jobs.findIndex(j => (j._id || j.id) === (job._id || job.id))
                        : colIdx;

                    const isLocked = job.isSaved && !job.isEditing;

                    const isActive =
                      activeCell?.rowIdx === rowIdx &&
                      activeCell?.colIdx === actualIndex;


                    return (
                      <td
                        key={`${rowIdx}-${colIdx}`}
                        className={`border-r border-b border-gray-200 relative p-0 transition-all ${isLocked ? 'bg-gray-50' : 'bg-white'} ${isActive ? 'ring-2 ring-inset ring-[#217346] z-10' : ''}`}
                        onClick={() => setActiveCell({ rowIdx, colIdx: actualIndex })}
                      >
                        {field.type === 'select' ? (
                          <div className="flex items-center w-full">
                            <select
                              className={`w-full px-3 py-2 text-xs bg-transparent appearance-none ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                              value={(job[field.key] ?? "") as string}
                              disabled={isLocked}
                              onChange={(e) => handleChange(actualIndex, field.key, e.target.value)}
                            >
                              <option value="">Select</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>

                            {!isLocked && (
                              <ChevronDown
                                size={10}
                                className="absolute right-2 text-gray-400 pointer-events-none"
                              />
                            )}
                          </div>

                        ) : field.isTextarea ? (
                          <textarea
                            className={`w-full h-[34px] p-2 outline-none resize-none text-xs leading-tight bg-transparent ${isLocked ? 'cursor-not-allowed text-gray-400 italic' : ''}`}
                            placeholder={isLocked ? "" : field.placeholder}
                            value={(job[field.key] ?? "") as string}
                            disabled={isLocked}
                            onFocus={() => setActiveCell({ rowIdx, colIdx: actualIndex })}
                            onChange={(e) => handleChange(actualIndex, field.key, e.target.value)}
                          />

                        ) : (
                          <input
                            type="text"
                            className={`w-full px-3 py-2 text-xs bg-transparent outline-none ${isLocked ? 'cursor-not-allowed text-gray-400 italic' : ''}`}
                            placeholder={isLocked ? "" : field.placeholder}
                            value={(job[field.key] ?? "") as string}
                            disabled={isLocked}
                            onFocus={() => setActiveCell({ rowIdx, colIdx: actualIndex })}
                            onChange={(e) => handleChange(actualIndex, field.key, e.target.value)}
                          />
                        )}
                      </td>
                    );
                  })}
                  {/* <td className="border-b border-gray-200 bg-white"></td> */}
                </tr>
              ))}

              {/* Filler rows */}
              {/* {[...Array(10)].map((_, i) => (
              <tr key={`filler-${i}`} className="h-8">
                <td className="bg-[#e6e6e6] border-r border-b border-gray-300 text-center text-[10px] text-gray-500 sticky left-0 z-10">{fields.length + i + 1}</td>
                <td className="border-r border-b border-gray-200 bg-[#f9f9f9]"></td>
                {jobs.map((_, j) => <td key={`filler-cell-${j}`} className="border-r border-b border-gray-200 bg-white"></td>)}
                <td className="border-b border-gray-200 bg-white"></td>
              </tr>
            ))} */}
            </tbody>
          </table>
        </div>

        {/* Footer / Status Bar */}
        <div className={`text-white px-3 py-1 flex items-center justify-between text-[11px] shrink-0 transition-colors ${status.includes('Error') || status.includes('Failed') || status.includes('Offline') ? 'bg-red-600' : 'bg-[#217346]'}`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === "Ready" || status.includes('✅') ? "bg-white" : "bg-yellow-400 animate-pulse"}`}></div>
              {status}
            </span>
            <div className="w-[1px] h-3 bg-white/30"></div>
            <span className="opacity-80 uppercase tracking-tighter font-bold">Mode: Sync</span>
          </div>
          <div className="flex items-center gap-5">
            
            <div className="flex items-center gap-2 font-mono">
              <Unlock size={10} className="opacity-80" />
              <span>{jobs.length} RECORDS</span>
            </div>
          </div>

        </div>

      </div>
          </div> 
  </div>  
     

      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg shadow-xl p-5 w-[320px]">

            <h2 className="text-sm font-semibold text-red-600 mb-2">
              ⚠ Delete Job
            </h2>

            <p className="text-xs text-gray-700 mb-3">
              This action will permanently remove this job from the <b>CandidRP website</b>.
            </p>

            {/* Job Details */}
            <div className="text-xs bg-gray-50 border rounded p-2 mb-4">
              <p><b>Title:</b> {jobs[deleteIndex]?.title || "N/A"}</p>
              <p><b>Location:</b> {jobs[deleteIndex]?.location || "N/A"}</p>
              <p><b>Type:</b> {jobs[deleteIndex]?.type || "N/A"}</p>
            </div>

            <p className="text-xs text-red-500 mb-4 font-medium">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 text-xs border rounded hover:bg-gray-100"
                onClick={() => setDeleteIndex(null)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  deleteJob(deleteIndex);
                  setDeleteIndex(null);
                }}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
        
        
      )}
      

    {/* // </Layout> */}
    </div>



  );
};




export default App;