"use client";

import { useState } from "react";
import Link from "next/link";
import Headings from "@/components/primary/Headings";
import Button from "@/components/primary/Button";
import { Calendar, ChevronLeft } from "lucide-react";

export default function BookingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
    consent: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.phone || !form.service) {
      setError("Please complete the required fields.");
      return;
    }
    if (!form.consent) {
      setError("Please confirm you have read the information notice.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Request failed");
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        notes: "",
        consent: false,
      });
    } catch (err) {
      setError(err.message || "We couldn't send your request right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const availableTimes = [
    "08:30 am",
    "08:45 am",
    "09:00 am",
    "09:15 am",
    "09:30 am",
    "09:45 am",
    "10:00 am",
    "10:15 am",
    "10:30 am",
    "10:45 am",
    "11:00 am",
    "11:15 am",
    "11:30 am",
    "11:45 am",
    "12:00 pm",
    "12:15 pm",
    "12:30 pm",
    "12:45 pm",
    "01:00 pm",
    "01:15 pm",
    "01:30 pm",
    "01:45 pm",
    "02:00 pm",
    "02:15 pm",
    "02:30 pm",
    "02:45 pm",
    "03:00 pm",
    "03:15 pm",
    "03:30 pm",
    "03:45 pm",
    "04:00 pm",
    "04:15 pm",
    "04:30 pm",
    "04:45 pm",
    "05:00 pm",
    "05:15 pm",
    "05:30 pm",
    "05:45 pm",
    "06:00 pm",
    "06:15 pm",
    "06:30 pm",
    "06:45 pm",
    "07:00 pm",
    "07:15 pm",
    "07:30 pm",
    "07:45 pm",
    "08:00 pm",
  ];

  return (
    <section className=" bg-white text-easyDark dark:bg-background dark:text-easyWhite">
      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3">
          <Headings headingType="h1" className="tracking-wide">
            Book a Consultation
          </Headings>
        </div>

        <span className="text-gray-500 dark:text-easyWhite">
          Please complete the form below to arrange your initial consultation.
          <span className="text-primary-300 font-bold ml-1">
            You will receive an email confirmation within 24 hours.
          </span>
        </span>
        <p className="mb-8">
          During your consultation, we’ll confirm suitability, discuss potential
          risks, and outline a personalised plan tailored to your goals.
        </p>

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            Thank you — your request has been sent. We’ll get back to you
            shortly.
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium ">
              Full name *
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 dark:placeholder:text-gray-100"
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 dark:placeholder:text-gray-100"
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium ">
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              value={form.phone}
              onChange={onChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 dark:placeholder:text-gray-100"
              placeholder="+61 ..."
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium ">
              Preferred service *
            </label>
            <select
              id="service"
              name="service"
              value={form.service}
              onChange={onChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-900/10"
            >
              {/* TODO: Adjust to consume API with available procedures */}
              <option value="">Select an option</option>
              <option value="Consultation Only">Consultation Only</option>
              <option value="Anti-wrinkle Injections">
                Anti-wrinkle Injections
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium ">
              Preferred date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 dark:placeholder:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium ">
              Preferred time
            </label>

            <select
              id="time"
              name="time"
              value={form.time}
              onChange={onChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-gray-900/10 dark:placeholder:text-gray-100"
            >
              <option value="">Prefered time</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium ">
              Anything you’d like us to know?
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={form.notes}
              onChange={onChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="Optional"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-start gap-3 text-sm  cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={onChange}
                className="h-[16px] w-[16px] aspect-square appearance-none rounded border border-primary-300 
                checked:bg-primary-300 checked:border-primary-500 
                dark:border-white"
                required
              />
              <span>
                I understand this request is for an initial consultation to
                assess suitability. All medical treatments carry potential risks
                and side effects.
              </span>
            </label>
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
            <Button buttonType="primary" className="px-6" disabled={submitting}>
              {submitting ? "Sending..." : "Submit request"}
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
}
