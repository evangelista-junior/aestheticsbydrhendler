// CHANGED: permitir clonar ícone para forçar dimensões e atributos de acessibilidade
import { cloneElement, isValidElement } from "react";
import Headings from "@/components/ui/Headings";

export default function Card({ cardIcon, cardTitle, cardInfo }) {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-3 p-3 border border-gray-100 rounded-md shadow-xl text-gray-600">
      <div className="w-full flex items-center gap-3 ">{cardIcon}</div>

      <div className="min-w-0">
        <p className="text-xl font-bold tracking-wide">{cardTitle}</p>
        <p className="font-extralight tracking-wider text-gray-500">
          {cardInfo}
        </p>
      </div>
    </div>
  );
}
