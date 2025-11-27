"use client";

import Headings from "@/components/Headings";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { Instagram, Mail, MapPinned, Send } from "lucide-react";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import staticMap from "@/public/images/static_map.png";
import { useLoadingModal } from "@/store/useLoadingModal";
import { useFeedbackModal } from "@/store/useFeedbackModal";
import { apiRequest } from "@/lib/server/useApi";
import { useState } from "react";
import Image from "next/image";

export default function Contact() {
  const {
    register,
    handleSubmit,
    isSubmitting,
    reset,
    formState: { errors },
  } = useForm();
  const { setLoading } = useLoadingModal();
  const [mapLoaded, setMapLoaded] = useState(false);
  const {
    setOpenModal,
    setSuccessTitle,
    setSuccessMessage,
    setErrorMessage,
    setButtonText,
    setOnClick,
    setCloseModal,
    setClearErrors,
  } = useFeedbackModal();

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      setLoading(true);

      const res = await apiRequest("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error((await res.json()).message);
      }

      reset();
      setClearErrors();
      setSuccessTitle("Request sent successfully!");
      setSuccessMessage(
        "Thank you for reaching out. Your request has been submitted and our team will get back to you shortly."
      );
      setButtonText("Close");
      setOnClick(() => setCloseModal());
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setButtonText("Try Again");
      setOnClick(() => setCloseModal());
    } finally {
      setLoading(false);
      setOpenModal();
    }
  };

  return (
    <section id="contact" className="w-full py-12 px-6 lg:py-24 lg:px-12 ">
      <Headings className="tracking-wider uppercase font-light mb-6 text-center">
        how to find us
      </Headings>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
        <div className="shadow w-full h-full">
          {!mapLoaded ? (
            <div
              className="relative cursor-pointer"
              onClick={() => setMapLoaded(true)}
            >
              <Image
                src={staticMap}
                alt="Static image of the clinic location map."
                className="w-full h-auto"
              />
              <div className="absolute inset-0 z-20 bg-white/50 flex justify-center items-center">
                <div className="flex items-center bg-white text-primary rounded p-3 gap-1 pointer-events-none shadow-md">
                  <MapPinned className="w-10 h-10 p-2" />
                  <p className="uppercase font-light p-1 whitespace-nowrap">
                    Click to explore the map
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              title="Clinic Location Map"
              width="100%"
              height="100%"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Level%201%2097%20Bondi%20Rd%2C%20Bondi%20NSW%202026%2C%20Australia&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              className="border-0 grayscale"
            />
          )}
        </div>

        <div className="shadow p-6">
          <p className="uppercase font-light mb-1">
            Get in contact with us through the form below{" "}
            <br className="hidden lg:block 2xl:hidden" />
            or follow us on Instagram
          </p>
          <address className="not-italic tracking-wider text-sm mb-3 px-2">
            <div className="flex items-center gap-1 cursor-pointer mb-1 hover:underline">
              <Mail className="w-3 h-3" />
              <a href="mailto:info@aestheticsbydrhendler.com.au">
                info@aestheticsbydrhendler.com.au
              </a>
            </div>
            <div className="flex items-center gap-1 cursor-pointer mb-1 hover:underline">
              <Instagram className="w-3 h-3" />
              <a href="https://www.instagram.com/aestheticsbydrhendler">
                @aestheticsbydrhendler
              </a>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <MapPinned className="w-3 h-3" />
              <p>
                Level 1, 97 Bondi Rd, Bondi NSW 2026, Australia (entry via
                Nimbus Co)
              </p>
            </div>
          </address>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
          >
            <Input
              labelTitle="Full Name"
              inputPlaceholder="Jane Doe"
              inputAutoComplete="name"
              inputType="text"
              hookFormArgs={register("name", {
                required: "Please enter your full name.",
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
                  message: "Please enter your full name",
                },
              })}
              errors={errors.name}
            />

            <Input
              labelTitle="Mobile Number"
              inputPlaceholder="0412 345 678"
              inputAutoComplete="phone"
              inputType="phone"
              hookFormArgs={register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^(?:\+61|0)?4\d{8}$/,
                  message: "Please follow the right format (e.g. 0412 345 678)",
                },
              })}
              errors={errors.phone}
            />

            <Input
              labelTitle="Email"
              inputPlaceholder="jane@example.com"
              inputAutoComplete="email"
              inputType="email"
              hookFormArgs={register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email, e.g. name@example.com",
                },
              })}
              errors={errors.email}
            />

            <TextArea
              title="How can we help you?"
              placeholder="Please provide your details and message so we can offer you the best service."
              hookFormArgs={register("message", {
                required: "Message is required!",
              })}
              errors={errors.message}
              isRequired
            />

            <Button buttonType="dark" type="submit" disabled={isSubmitting}>
              <Send aria-hidden="true" focusable="false" className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
