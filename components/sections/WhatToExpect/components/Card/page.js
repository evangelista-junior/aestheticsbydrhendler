// CHANGED: permitir clonar ícone para forçar dimensões e atributos de acessibilidade
import { cloneElement, isValidElement } from "react";
import Headings from "@/components/primary/Headings";

export default function Card({ cardIcon, cardTitle, cardInfo }) {
  return (
    <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-md shadow h-[1em] aspect-square leading-none">
        {cardIcon}
      </div>

      <div className="min-w-0">
        <Headings headingType="h4" className="font-medium tracking-wide">
          {cardTitle}
        </Headings>
        <p className="text-gray-600 font-light break-words">{cardInfo}</p>
      </div>
    </div>
  );
}
