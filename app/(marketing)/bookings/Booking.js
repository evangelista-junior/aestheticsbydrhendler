"use client";

import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/ui/ErrorLabel";
import SelectInput from "./components/SelectInput";
import Input from "../../../components/ui/Input";
import { Check, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TextArea from "@/components/ui/TextArea";
import {
  emailValidator,
  fullNameValidator,
  phoneNumberValidator,
} from "@/utils/regexValidators";
import FeedbackModal from "@/components/ui/FeedbackModal";

export default function Booking() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const [responseErrors, setResponseErrors] = useState();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        let resErrors = (await res.json()).message;
        setResponseErrors(resErrors);
        throw new Error(
          "Failed to book your appointment, please contact us or try later."
        );
      }
    } catch (err) {
    } finally {
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
    <section className="relative max-w-5xl bg-white shadow-xl p-6 lg:px-12 lg:py-12 ">
      <span>
        Please complete the form below to arrange your initial consultation.
      </span>
      <p className="mb-8">
        During your consultation, we’ll confirm suitability, discuss potential
        risks, and outline a personalised plan tailored to your goals.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-2 gap-3"
      >
        <Input
          labelTitle="Full Name"
          inputPlaceholder="Jane Doe"
          inputAutoComplete="name"
          inputType="text"
          hookFormArgs={register("name", {
            required: "Please enter your full name.",
            pattern: {
              value: fullNameValidator,
              message: "Please enter your full name",
            },
          })}
          errors={errors.name}
        />

        <Input
          labelTitle="Email"
          inputPlaceholder="jane@example.com"
          inputAutoComplete="email"
          inputType="email"
          hookFormArgs={register("email", {
            required: "Email is required.",
            pattern: {
              value: emailValidator,
              message: "Please enter a valid email, e.g. name@example.com",
            },
          })}
          errors={errors.email}
        />

        <Input
          labelTitle="Mobile Number"
          inputPlaceholder="0412 345 678"
          inputAutoComplete="phone"
          inputType="phone"
          hookFormArgs={{
            ...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: phoneNumberValidator,
                message: "Please follow the right format (e.g. 0412 345 678)",
              },
            }),
          }}
          errors={errors.phone}
        />

        <SelectInput
          labelTitle="Desired Service"
          hookFormArgs={register("service", {
            required: "Please select a service",
          })}
          errors={errors.service}
          options={["Consultation Only", "Anti-wrinkle Treatment"]}
        />

        <Input
          labelTitle="Prefered Date"
          inputType="date"
          hookFormArgs={register("preferedDate", {
            required: "Please choose a date",
          })}
          errors={errors.preferedDate}
        />

        <SelectInput
          labelTitle="Prefered time"
          hookFormArgs={register("preferedTime", {
            required: "Please select a preferred time",
          })}
          errors={errors.preferedTime}
          options={availableTimes}
        />

        <div className="xl:col-span-2">
          <TextArea
            title="Anything you’d like us to know?"
            placeholder="Optional information."
            hookFormArgs={register("notes")}
            className="xl:col-span-2"
          />
        </div>

        <div className="xl:col-span-2 text-sm tracking-wider">
          <label className="flex items-start gap-3 cursor-pointer align-middle">
            <input
              type="checkbox"
              className="cursor-pointer h-[16px] w-[16px] aspect-square appearance-none rounded border border-primary-300
                checked:bg-primary-300 checked:border-primary-400 
                "
              {...register("consent", {
                required: "You must accept to continue",
              })}
            />
            <span>
              I understand this request is for an initial consultation to assess
              suitability. All medical treatments carry potential risks and side
              effects.
            </span>
          </label>
          <ErrorLabel field={errors.consent} />
        </div>

        <div className="xl:col-span-2 flex items-center justify-between gap-3 pt-2">
          <Button buttonType="primary" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Request Booking"}
          </Button>
        </div>
      </form>

      {isSubmitSuccessful && ( //TODO: useState
        <FeedbackModal
          successTitle="Thank you!"
          successMessage="Your booking request has been received. You’ll receive an email
                within 24 hours with payment details to secure your appointment.
                We look forward to welcoming you soon."
          errorMessage="We couldn’t process your request at the moment. Please try again later or contact our team for assistance."
        />
      )}
    </section>
  );
}
