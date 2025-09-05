"use client";
export default function BarActions(
  {onBack,onNext,complete,label="Next",disabled=false}:
  {onBack:()=>void;onNext?:()=>void;complete?:()=>void;label?:string;disabled?:boolean;}
){
  return(
    <div className="mt-10 flex items-center justify-between">
      <button onClick={onBack} className="btn-secondary">
        ← Back
      </button>
      {complete?
        <button onClick={complete} disabled={disabled} className="btn-primary disabled:opacity-60">
          Complete Order →
        </button>:
        <button onClick={onNext} className="btn-primary">{label} →</button>}
    </div>
  );
}
