import { useState } from "react";
import {
  FileDown,
  ChevronDown,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

function ExportMenu({
  onPDF,
  onExcel,
}) {

  const [open,setOpen]=useState(false);

  return(

    <div className="relative">

      <button
        onClick={()=>setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800"
      >

        <FileDown size={18}/>

        Export

        <ChevronDown size={18}/>

      </button>

      {open && (

        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border overflow-hidden z-50">

          <button
            onClick={()=>{
              setOpen(false);
              onPDF();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-50"
          >

            <FileDown size={18}/>

            Executive PDF

          </button>

          <button
            onClick={()=>{
              setOpen(false);
              onExcel();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-50"
          >

            <FileSpreadsheet size={18}/>

            Excel Report

          </button>

          <button
            onClick={()=>{
              setOpen(false);
              window.print();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-50"
          >

            <Printer size={18}/>

            Print Report

          </button>

        </div>

      )}

    </div>

  );

}

export default ExportMenu;