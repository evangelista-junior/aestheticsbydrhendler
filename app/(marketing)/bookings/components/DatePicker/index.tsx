import ErrorLabel from "@/components/ErrorLabel";
import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface PropsInterface {
  labelTitle: string;
  error?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export default function DatePicker({
  labelTitle,
  error,
  value,
  onChange,
}: PropsInterface) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  //Add listener for whenever the user clicks outside the drawer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Add listener for whenever the user press esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const formatted = value
    ? value.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <div ref={wrapperRef}>
      <label className="block text-sm tracking-wide after:content-['*'] after:text-red-400 after:ml-1 uppercase">
        {labelTitle}
      </label>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`
          mt-2 w-full shadow p-2 outline-none text-left focus:ring-2 focus:ring-easyDark/30 cursor-pointer ${
            error ? "placeholder-primary text-primary" : ""
          }
  `}
      >
        <span className={formatted || error ? "text-primary" : "text-gray-400"}>
          {formatted || "Select a date"}
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 rounded-md bg-white shadow-lg border border-gray-200">
          <DayPicker
            className="p-2"
            animate
            mode="single"
            navLayout="around"
            startMonth={new Date()}
            endMonth={new Date(2026, 0)}
            timeZone="Australia/Sydney"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              console.log(date);
              setOpen(false);
            }}
            disabled={(date) => {
              const isAvailable = date.getDay() <= 1 && date > new Date(); //TODO: Send this to business rules
              return !isAvailable;
            }}
            weekStartsOn={1}
            classNames={{
              today: "text-gray-300",
              selected: "bg-primary text-white",
              disabled: "text-gray-300",
              chevron: "fill-primary",
            }}
          />
        </div>
      )}

      <ErrorLabel field={error} />
    </div>
  );
}
