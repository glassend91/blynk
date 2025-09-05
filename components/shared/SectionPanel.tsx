"use client";
export default function SectionPanel({children}:{children:React.ReactNode}){
  return(
    <div className="panel mt-2">
      {children}
    </div>
  );
}
