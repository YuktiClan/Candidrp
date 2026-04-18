import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    Download,
    ChevronLeft,
    ChevronRight,
    Save,
    Trash2,
    Mail,
    Phone,
    Grid,

    Building2,
    FileSpreadsheet,
    Undo2,
    Redo2,
    ChevronDown,
    HelpCircle,
    X
} from 'lucide-react';

import { FileText } from 'lucide-react';


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


// ✅ TYPE FOR CONTACT
type Contact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    message: string;
    date: string;
};





const App = () => {
    // States
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    // const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [viewingMessage, setViewingMessage] = useState<string | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [copied, setCopied] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        company: '',
        contact: '',
        date: '',
        type: ''

    });


    // ✅ RESTORED FETCH CONTACTS SECTION
    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                // Implementation for the requested endpoint
                const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setContacts(data);
            } catch (err) {
                console.error("Fetch error:", err);
                // Fallback mock data for development/demo if backend is unreachable
                const mockData: Contact[] = [
                    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'Tech Corp', message: 'Hello, I am interested in your services. Can we schedule a call for next Tuesday?', date: new Date().toISOString() },
                    { id: '2', name: 'Jane Smith', email: 'jane@design.io', phone: '987-654-3210', company: 'Creative Solutions', message: 'I saw your portfolio and would love to collaborate on an upcoming project for our New York branch.', date: new Date().toISOString() }
                ];
                setContacts(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);


const deleteSelected = async () => {
  if (selectedRows.length === 0) {
    alert("No contacts selected");
    return;
  }

  if (!window.confirm("Delete selected contacts?")) return;

  await fetch(`${import.meta.env.VITE_API_URL}/delete-contacts`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selectedRows)
  });

  setContacts(prev => prev.filter(c => !selectedRows.includes(c.id)));
  setSelectedRows([]);
};


const deleteByMonth = async () => {
  const month = prompt("Enter month (1-12)");
  const year = prompt("Enter year (e.g. 2026)");

  if (!month || !year) return;

  await fetch(
  `${import.meta.env.VITE_API_URL}/delete-contacts-by-month?month=${month}&year=${year}`, {
    method: "DELETE"
  });

  window.location.reload(); // simple refresh
};


const deleteAll = async () => {
  if (!window.confirm("⚠️ Delete ALL contacts?")) return;

  await fetch(`${import.meta.env.VITE_API_URL}/delete-all-contacts`, {
    method: "DELETE"
  });

  setContacts([]);
};

useEffect(() => {
  const handleClickOutside = (e: any) => {
    console.log("API:", import.meta.env.VITE_API_URL);
    if (!e.target.closest(".delete-menu")) {
      setShowDeleteMenu(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);



    const handleExport = () => {
    if (filteredRecords.length === 0) {
        alert("No data to export");
        return;
    }

    const data = filteredRecords.map((c) => ({
        Name: c.name,
        Email: c.email,
        Phone: c.phone,
        Company: c.company || "N/A",
        Message: c.message,
        Date: new Date(c.date).toLocaleString()
    }));

    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // ✅ Set column widths (VERY IMPORTANT)
    ws["!cols"] = [
        { wch: 15 }, // Name
        { wch: 30 }, // Email
        { wch: 18 }, // Phone
        { wch: 25 }, // Company
        { wch: 50 }, // Message (big)
        { wch: 22 }  // Date
    ];

    // ✅ Apply styling manually (headers bold)
    const range = XLSX.utils.decode_range(ws["!ref"] || "");

    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center" }
        };
    }

    // ✅ Wrap text for Message column (column index 4)
    for (let row = 1; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 });

        if (ws[cellAddress]) {
            ws[cellAddress].s = {
                alignment: { wrapText: true, vertical: "top" }
            };
        }
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");

    // Export
    const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true // ✅ REQUIRED
    });

    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, `Contacts_${new Date().toISOString().split("T")[0]}.xlsx`);
};






    const filteredRecords = useMemo(() => {
    return contacts.filter((c: Contact) => {

        const isCandidate = c.message?.startsWith("Applying for");

        const matchesType =
            filters.type === '' ||
            (filters.type === 'candidate' && isCandidate) ||
            (filters.type === 'client' && !isCandidate);

        const matchesSearch =
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.company?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesName =
            c.name?.toLowerCase().includes(filters.name.toLowerCase());

        const matchesCompany =
            c.company?.toLowerCase().includes(filters.company.toLowerCase());

        const matchesContact =
            c.email?.toLowerCase().includes(filters.contact.toLowerCase()) ||
            c.phone?.toLowerCase().includes(filters.contact.toLowerCase());

        const matchesDate =
            filters.date === '' ||
            new Date(c.date).toISOString().split('T')[0] === filters.date;

        return (
            matchesSearch &&
            matchesName &&
            matchesCompany &&
            matchesContact &&
            matchesDate &&
            matchesType   // ✅ NOW VALID
        );
    });
}, [contacts, searchQuery, filters]);
            

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    

   

    return (
        // <Layout>
        
          
  <div className="w-full h-full flex flex-col">
            
            
            {/* <div className="flex flex-col h-full min-h-0 bg-[#f3f3f3] text-sm font-sans select-none overflow-hidden"> */}

            <div className="w-full flex justify-center relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl min-h-[85vh]">

                {/* 🌑 DARK BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#e2e8f0]" />

                {/* ✨ LIGHT GLOW */}
                <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-[80px]" />

                {/* 🔥 BLOBS */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
                </div>

                {/* MAIN CONTAINER */}
                    <div className="relative z-10 w-full p-4 md:p-6 flex flex-col h-auto">
                {/* EXCEL BOX START */}
                <div className="backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/40 flex flex-col h-full">


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
            

                

                {/* 2. Ribbon Tabs */}
                {/* <div className="bg-white border-b border-gray-200 flex flex-col shrink-0 py-3">
                    <div className="flex gap-6 px-4 text-[11px] font-medium text-gray-600">
    <span className="text-[#217346] border-b-[3px] border-[#217346] cursor-pointer pb-1 font-bold">
      Contact Request List
    </span>
  </div> */}
  <div className="bg-white border-b border-gray-200 flex flex-col shrink-0 py-0.5">
        <div className="flex gap-6 px-4 pt-2 text-[11px] font-medium text-gray-600">
          <span className="text-[#217346] border-b-[3px] border-[#217346] cursor-pointer pb-1.5 font-bold">Contacts Request List</span>
          
        </div>



                    {/* 3. Ribbon Command Bar */}


                    <div className="flex items-center gap-2 p-1 bg-[#f9f9f9] border-t border-gray-200">

                        {/* LEFT GROUP */}
                        <div className="flex items-center px-3 border-r border-gray-300 gap-4">

                            {/* FILTER */}
                            <div className="relative">
                                <div
                                    onClick={() => setShowFilter(prev => !prev)}
                                    className="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-1 rounded w-14"
                                >
                                    <FileText size={20} className="text-[#217346]" />
                                    <span className="text-[9px] text-gray-500 mt-1">Filter</span>
                                </div>

                                {/* FILTER DROPDOWN
                                {showFilter && (
                                    <div className="absolute top-14 left-0 bg-white border shadow-md p-3 z-50 w-56 rounded-sm">

                                        <input
                                            placeholder="Name"
                                            className="w-full mb-2 px-2 py-1 border text-xs"
                                            value={filters.name}
                                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                        />

                                        <input
                                            placeholder="Company"
                                            className="w-full mb-2 px-2 py-1 border text-xs"
                                            value={filters.company}
                                            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                                        />

                                        <input
                                            placeholder="Contact"
                                            className="w-full mb-2 px-2 py-1 border text-xs"
                                            value={filters.contact}
                                            onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                                        />

                                        <input
                                            type="date"
                                            className="w-full mb-2 px-2 py-1 border text-xs"
                                            value={filters.date}
                                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                        />

                                        <div className="flex justify-between mt-2">
                                            <button
                                                onClick={() => setFilters({ name: '', company: '', contact: '', date: '' })}
                                                className="text-[10px] text-red-500"
                                            >
                                                Clear
                                            </button>

                                            <button
                                                onClick={() => setShowFilter(false)}
                                                className="text-[10px] text-green-600 font-bold"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div> */}
                                
                            </div>

                            {/* EXPORT */}
                            <div
                                onClick={handleExport}
                                className="flex flex-col items-center cursor-pointer hover:bg-blue-50 p-1 rounded w-14 group"
                            >
                                <Download size={20} className="text-blue-600 group-hover:scale-110 transition" />
                                <span className="text-[9px] text-gray-500 mt-1 group-hover:text-blue-600">
                                    Export
                                </span>
                            </div>


                    {/* DELETE DROPDOWN */}
                    <div className="relative delete-menu">
  
                        {/* BUTTON */}
                        <div
                            onClick={() => setShowDeleteMenu(prev => !prev)}
                            className="flex flex-col items-center cursor-pointer hover:bg-red-50 p-1 rounded w-14"
                        >
                            <Trash2 size={20} className="text-red-600" />
                            <span className="text-[9px] text-gray-500 mt-1">Delete</span>
                        </div>

                        {/* DROPDOWN */}
                        {showDeleteMenu && (
                            <div className="absolute bg-white shadow-md border text-xs mt-1 w-40 z-50">

                            <div
                                onClick={() => {
                                deleteSelected();
                                setShowDeleteMenu(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Delete Selected
                            </div>

                            <div
                                onClick={() => {
                                deleteByMonth();
                                setShowDeleteMenu(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Delete by Month
                            </div>

                            <div
                                onClick={() => {
                                deleteAll();
                                setShowDeleteMenu(false);
                                }}
                                className="px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                            >
                                Delete All
                            </div>

                            </div>
                        )}
                        </div>
                        </div>

                        {/* RIGHT GROUP (IMPORTANT) */}
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





                




                {/* 4. Formula Bar */}
                <div className="bg-white border-b border-[#d1d1d1] flex items-center h-7 px-1 gap-1 shrink-0">

                    

                {/* LEFT SIDE */}
                <div className="w-10 text-center text-[11px] text-slate-500">A1</div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="px-2 italic text-slate-500 font-serif text-[12px]">fx</div>
                <div className="h-4 w-px bg-slate-200 mr-2" />

                {/* CENTER TEXT */}
                <div className="text-[11px] text-slate-700 font-medium">
                    {searchQuery ? `SEARCH("${searchQuery}", DATA_RANGE)` : "READY"}
                </div>

                

                {/* ✅ RIGHT SIDE FILTER */}
                {showFilter && (
                    <div className="hidden md:flex items-center gap-2 ml-auto">

                    <input
                        type="text"
                        placeholder="Name"
                        className="border px-2 py-1 text-xs w-32"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Company"
                        className="border px-2 py-1 text-xs w-32"
                        value={filters.company}
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Contact"
                        className="border px-2 py-1 text-xs w-32"
                        value={filters.contact}
                        onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                    />

                    <input
                        type="date"
                        className="border px-2 py-1 text-xs"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                    <select
                        className="border px-2 py-1 text-xs"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="candidate">Candidate</option>
                        <option value="client">Client</option>
                    </select>

                    <button
                        onClick={() =>
                        setFilters({ name: '', company: '', contact: '', date: '', type: '' })
                        }
                        className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                        Clear
                    </button>

                    

                    </div>
                    
                )}
                
                

                </div>

                {/* ✅ ADD HERE (THIS EXACT PLACE) */}
{/* ✅ MOBILE FILTER PANEL */}
{showFilter && (
  <div className="md:hidden bg-white border-b border-gray-300 p-3 space-y-2">

    <input
      type="text"
      placeholder="Name"
      className="w-full border px-3 py-2 text-xs rounded"
      value={filters.name}
      onChange={(e) => setFilters({ ...filters, name: e.target.value })}
    />

    <input
      type="text"
      placeholder="Company"
      className="w-full border px-3 py-2 text-xs rounded"
      value={filters.company}
      onChange={(e) => setFilters({ ...filters, company: e.target.value })}
    />

    <input
      type="text"
      placeholder="Contact"
      className="w-full border px-3 py-2 text-xs rounded"
      value={filters.contact}
      onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
    />

    <input
      type="date"
      className="w-full border px-3 py-2 text-xs rounded"
      value={filters.date}
      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
    />

    <select
      className="w-full border px-3 py-2 text-xs rounded"
      value={filters.type}
      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
    >
      <option value="">All</option>
      <option value="candidate">Candidate</option>
      <option value="client">Client</option>
    </select>

    <button
      className="w-full bg-red-500 text-white py-2 text-xs rounded"
      onClick={() =>
        setFilters({
          name: '',
          company: '',
          contact: '',
          date: '',
          type: ''
        })
      }
    >
      Clear Filters
    </button>
  </div>
)}
                
                

                {/* 5. Spreadsheet Grid */}
                <div className="flex-1 overflow-auto bg-[#e1e1e1] relative custom-scrollbar">
                    <table className="border-collapse bg-white min-w-full table-fixed">
                        <thead className="sticky top-0 z-20">
                            <tr>
                                <th className="w-10 bg-[#e6e6e6] border border-[#d1d1d1]"></th>
                                {alphabet.slice(0, 5).map((letter) => (
                                    <th key={letter} className="bg-[#e6e6e6] border border-[#d1d1d1] text-[10px] font-normal text-slate-600 h-5">
                                        {letter}
                                    </th>
                                ))}
                            </tr>
                            
                        </thead>
                        <tbody>
                            
                            <tr className="sticky top-5 z-10">
                                
                                <td className="bg-[#e6e6e6] border border-[#d1d1d1] text-[10px] text-center font-medium text-slate-500">1</td>
                                <td className="border border-[#d1d1d1] bg-[#f9f9f9] px-2 py-0.5 font-bold text-[#217346] text-[11px] uppercase">Name</td>
                                <td className="border border-[#d1d1d1] bg-[#f9f9f9] px-2 py-0.5 font-bold text-[#217346] text-[11px] uppercase">Contact info</td>
                                <td className="border border-[#d1d1d1] bg-[#f9f9f9] px-2 py-0.5 font-bold text-[#217346] text-[11px] uppercase">Company</td>
                                <td className="border border-[#d1d1d1] bg-[#f9f9f9] px-2 py-0.5 font-bold text-[#217346] text-[11px] uppercase">Message (Dbl-Click)</td>
                                <td className="border border-[#d1d1d1] bg-[#f9f9f9] px-2 py-0.5 font-bold text-[#217346] text-[11px] uppercase">Date</td>
                            </tr>

                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center bg-white border border-[#d1d1d1]">
                                        <div className="inline-block w-5 h-5 border-2 border-[#217346] border-t-transparent rounded-full animate-spin" />
                                        <p className="mt-2 text-xs text-slate-500 font-medium">Connecting to contacts database...</p>
                                    </td>
                                </tr>
                            ) : filteredRecords.map((c, idx) => (
                                <tr
                                    key={c.id}>
                                        {/* ✅ CHECKBOX */}
                                            {/* <td className="border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(c.id)}
                                                onChange={() => {
                                                if (selectedRows.includes(c.id)) {
                                                    setSelectedRows(prev => prev.filter(id => id !== c.id));
                                                } else {
                                                    setSelectedRows(prev => [...prev, c.id]);
                                                }
                                                }}
                                            />
                                            </td> */}

                                    
                                    <td 
                                        onClick={() => {
                                            if (selectedRows.includes(c.id)) {
                                            setSelectedRows(prev => prev.filter(id => id !== c.id));
                                            } else {
                                            setSelectedRows(prev => [...prev, c.id]);
                                            }
                                        }}
                                        
                                        className={`bg-[#e6e6e6] border border-[#d1d1d1] text-[10px] text-center font-medium text-slate-500 select-none
                                            ${selectedRows.includes(c.id) ? "text-green-600 font-bold" : "text-slate-500"}
                                        `}
                                        >
                                        {selectedRows.includes(c.id) ? "✔" : idx + 2}
                                        </td>


                                    <td className="border border-[#d1d1d1] px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis hover:outline hover:outline-1 hover:outline-[#217346] bg-white text-[12px] font-medium">
                                        {c.name}
                                    </td>
                                    <td className="border border-[#d1d1d1] px-2 py-1 bg-white">
                                        <div className="flex flex-col text-[10px]">
                                            <span className="text-blue-600 underline flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{c.email}</span>
                                            <span className="text-slate-400 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{c.phone}</span>
                                        </div>
                                    </td>
                                    <td className="border border-[#d1d1d1] px-2 py-1 bg-white text-[12px]">
                                        <div className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" /> {c.company || "N/A"}</div>
                                    </td>
                                    <td
                                        className="border border-[#d1d1d1] px-2 py-1 bg-white text-[12px] italic text-slate-500 cursor-zoom-in hover:bg-slate-50 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]"
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            setViewingMessage(c.message);
                                        }}
                                        title="Double-click to expand full message"
                                    >
                                        {c.message}
                                    </td>
                                    <td className="border border-[#d1d1d1] px-2 py-1 bg-white text-[11px] font-mono text-slate-500">
                                        {new Date(c.date).toLocaleDateString()}
                                    </td>
                                    
                                    
                                </tr>
                            ))}

                            {/* Empty Rows Padding */}
                            {!loading && Array.from({ length: Math.max(0, 15 - filteredRecords.length) }).map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="bg-[#e6e6e6] border border-[#d1d1d1] text-[10px] text-center font-medium text-slate-400">
                                        {filteredRecords.length + i + 2}
                                    </td>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <td key={j} className="border border-[#d1d1d1] h-6 bg-white"></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 6. Excel Bottom Footer */}
                <div className="bg-[#f3f3f3] border-t border-[#d1d1d1] flex items-center px-3 py-1 text-[10px]">

                {/* ✅ LEFT SECTION */}
                <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                    <ChevronRight className="w-4 h-4 text-slate-400" />

                    <div className="px-3 py-1 flex items-center bg-white border border-[#d1d1d1] text-[#217346] font-bold text-[10px] relative rounded">
                    Contacts
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#217346]" />
                    </div>
                </div>

                {/* ✅ RIGHT SECTION */}
                <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-500">

                    <div className="flex items-center gap-1 uppercase font-bold text-emerald-600">
                    <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-orange-500' : 'bg-emerald-500'} animate-pulse`} />
                    {loading ? 'Syncing...' : 'Connected'}
                    </div>

                    <div className="h-3 w-px bg-slate-300" />

                    <div>Count: {filteredRecords.length}</div>
                </div>

                </div>

                {/* Message Modal (Double Click View) */}
                {viewingMessage && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => setViewingMessage(null)}
                    >
                        <div
                        className="bg-white w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl rounded-md border border-[#217346] animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                        >

      {/* HEADER */}
      <div className="bg-[#217346] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-4 h-4" />
          Full Message
        </div>
        <button
          onClick={() => setViewingMessage(null)}
          className="hover:bg-white/20 p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CONTENT (scrollable) */}
      <div className="p-4 overflow-y-auto flex-1">
        <div className="bg-slate-50 p-4 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap rounded">
          {viewingMessage}
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-end gap-2">
        <button
  onClick={() => {
    if (viewingMessage) {
      navigator.clipboard.writeText(viewingMessage);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }}
  className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
>
  Copy
</button>


        {/* <button
          onClick={() => setViewingMessage(null)}
          className="bg-[#217346] hover:bg-[#1a5a37] text-white px-5 py-1 text-xs font-semibold rounded"
        >
          Close
        </button> */}
      </div>

    </div>
  </div>
)}
            

                <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 14px; height: 14px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border: 1px solid #d1d1d1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border: 3px solid #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
      `}</style>
            </div>
            </div>
            </div>
      
    
            
        {/* </Layout> */}
        </div>
    );
};

export default App;