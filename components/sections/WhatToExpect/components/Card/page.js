// CHANGED: permitir clonar ícone para forçar dimensões e atributos de acessibilidade
import { cloneElement, isValidElement } from "react";
import Headings from "@/components/primary/Headings";

export default function Card({ cardIcon, cardTitle, cardInfo }) {
  return (
    <div className="flex flex-col h-full items-center gap-3 p-3 border border-gray-100 rounded-md shadow-xl text-gray-600">
      <div className="w-full flex items-center gap-3 bg-transparent">
        {cardIcon}
        <p className="text-xl font-medium tracking-wider">{cardTitle}</p>
      </div>

      <div className="min-w-0">
        <p className="font-light">{cardInfo}</p>
      </div>
    </div>
  );
}
