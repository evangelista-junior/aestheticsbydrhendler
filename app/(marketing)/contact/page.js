"use client";

import Headings from "@/components/Headings";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import { Mail, MapPinned, Phone, Send } from "lucide-react";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { usePathname } from "next/navigation";
import FeedbackModal from "@/components/FeedbackModal";
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
      if (isDedicatedPath) setLoading(true);

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
    <section
      id="contact"
      className="relative w-full py-12 px-6 lg:px-12 backdrop-blur-2xl flex flex-col gap-9 justify-center items-center"
    >
      {isDedicatedPath && ( //TODO: loading
        <Headings
          headingType="h1"
          className="font-light tracking-widest bg-primary-300 text-white -skew-x-12 px-12 py-3"
        >
          Contact us
        </Headings>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-10 w-full">
        <div className="mb-6">
          <div className="flex flex-col gap-3 ">
            <address className="not-italic text-textSecondary space-y-0.5 mb-2">
              <div className="flex items-center gap-3 tracking-wider ">
                <Phone size={20} />
                <a href="tel:+610404058431" className=" hover:underline">
                  +61 404 058 431
                </a>
              </div>
              <div className="flex items-center gap-3 tracking-wider ">
                <Mail size={20} />
                <a
                  href="mailto:info@aestheticsbydrhendler.com.au"
                  className=" hover:underline"
                >
                  info@aestheticsbydrhendler.com.au
                </a>
              </div>
              <div className="flex items-center gap-3 tracking-wider ">
                <MapPinned size={20} />
                <p>Bondi, Sydney Eastern Suburbs, NSW</p>
              </div>
            </address>
          </div>

          <div className="rounded-sm overflow-hidden shadow-2xl w-full h-[300px]">
            <iframe
              title="Clinic Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.123456789!2d151.2767!3d-33.8915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae4a8f60d8f1%3A0x1234567890abcdef!2sBondi%20Beach%2C%20Sydney%20NSW!5e0!3m2!1sen!2sau!4v0000000000000"
              width="100%"
              height="300"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

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
            <Send size={20} aria-hidden="true" focusable="false" />
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
