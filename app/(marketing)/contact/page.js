"use client";

import Headings from "@/components/Headings";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { Instagram, Mail, MapPinned, Phone, Send } from "lucide-react";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { usePathname } from "next/navigation";
import { useLoadingModal } from "@/store/useLoadingModal";
import { useFeedbackModal } from "@/store/useFeedbackModal";

export default function Contact() {
  const {
    register,
    handleSubmit,
    isSubmitting,
    reset,
    formState: { errors },
  } = useForm();
  const { setLoading } = useLoadingModal();
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

  const urlPath = usePathname();

  const isDedicatedPath = urlPath == "/contact" && true;

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      setLoading(true);

      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        <div className="shadow w-full h-full grayscale">
          <iframe
            title="Clinic Location Map"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Parlour%20Box%2C%20entrance%20at%20rear%2C%20Wairoa%20Avenue%2C%20North%20Bondi%20NSW%2C%20Australia&zoom=16&maptype=roadmap"
            width="100%"
            height="100%"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="shadow p-6">
          <p className="uppercase font-light mb-1">
            Get in contact with us through the form bellow{" "}
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
            <div className="flex items-center gap-1 cursor-pointer mb-1 hover:underline">
              <MapPinned className="w-3 h-3" />
              <p>38 Wairoa Ave, North Bondi NSW 2026 (entrance at rear)</p>
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
