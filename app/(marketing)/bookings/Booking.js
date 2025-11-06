"use client";

import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import ErrorLabel from "@/components/ErrorLabel";
import SelectInput from "./components/SelectInput";
import Input from "../../../components/Input";
import TextArea from "@/components/TextArea";
import {
  emailValidator,
  fullNameValidator,
  phoneNumberValidator,
} from "@/lib/utils/regexValidators";
import { useFeedbackModal } from "@/store/useFeedbackModal";
import { useLoadingModal } from "@/store/useLoadingModal";
import { useEffect, useState } from "react";
import { bookingDateValidation } from "@/lib/business/booking/bookingDateValidation";

export default function Booking() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const {
    setOpenModal,
    setSuccessTitle,
    setSuccessMessage,
    setErrorMessage,
    setButtonText,
    setOnClick,
    redirectToHomempage,
    setClearErrors,
  } = useFeedbackModal();
  const { setLoading } = useLoadingModal();
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    try {
      async function fetchAvailableTreatments() {
        const response = await fetch("/api/v1/treatments?fields=name");

        if (!response.ok) {
          throw new Error("Treatments api request went wrong!");
        }
        const data = await response.json();

        if (!data.treatments) {
          throw new Error("No treatment found!");
        }

        const treatments = data.treatments.map((t) => t.name);
        setTreatments(treatments);
      }

      fetchAvailableTreatments();
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      if (isSubmitting) return;

      setLoading(true);
      const res = await fetch(`/api/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error((await res.json()).message);
      }

      setSuccessTitle("Booking Confirmed!");
      setSuccessMessage(
        "Your request has been submitted successfully. Please check your email within 24 hours for payment details to secure your appointment. We look forward to seeing you soon."
      );
      setButtonText("Go to Homepage");
      setOnClick(redirectToHomempage);
      setClearErrors();
    } catch (err) {
      setErrorMessage(Error(err).message);
    } finally {
      setLoading(false);
      setOpenModal();
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

  function setFirstAvailableDate() {
    const today = new Date();
    const availableDate = new Date(today.setDate(today.getDate() + 1));
    return availableDate.toLocaleDateString("en-CA");
  }

  function selectInputValidation(selection, errMessage) {
    if (selection == "default") return errMessage;
  }

  return (
    <section className="relative max-w-5xl bg-white shadow-xl p-6 lg:px-12 lg:py-12 ">
      <div className="uppercase text-sm">
        <p>
          Please complete the form below to arrange your initial consultation.
        </p>
        <p className="mb-8">
          During your consultation, we’ll confirm suitability, discuss potential
          risks, and outline a personalised plan tailored to your goals.
        </p>
      </div>

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
            required: "Please enter your full name",
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
            required: "Email is required",
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
            validate: (selection) =>
              selectInputValidation(selection, "Please select a valid service"),
          })}
          errors={errors.service}
          options={treatments}
        />

        <Input
          labelTitle="Prefered Date"
          inputType="date"
          hookFormArgs={register("preferedDate", {
            required: "Please choose a date",
            validate: (pickedDate) => bookingDateValidation(pickedDate),
          })}
          errors={errors.preferedDate}
          minDate={setFirstAvailableDate()}
        />

        <SelectInput
          labelTitle="Prefered time"
          hookFormArgs={register("preferedTime", {
            required: "Please select a preferred time",
            validate: (selection) =>
              selectInputValidation(selection, "Please select a valid time"),
          })}
          errors={errors.preferedTime}
          options={availableTimes}
        />

        <div className="xl:col-span-2">
          <TextArea
            title="Anything you’d like us to know?"
            placeholder="Optional information"
            hookFormArgs={register("notes")}
            className="xl:col-span-2"
          />
        </div>

        <div className="xl:col-span-2 text-sm tracking-wider">
          <label className="flex items-start gap-3 cursor-pointer align-middle">
            <input
              type="checkbox"
              className="cursor-pointer h-[16px] w-[16px] aspect-square appearance-none rounded border border-primary
                checked:bg-primary checked:border-primary 
                "
              {...register("consent", {
                required: "You must accept to continue",
              })}
            />
            <p className="uppercase text-sm text-primary">
              I understand this request is for an initial consultation to assess
              suitability. All medical treatments carry potential risks and side
              effects.
            </p>
          </label>
          <ErrorLabel field={errors.consent} />
        </div>

        <div className="xl:col-span-2 flex items-center justify-between gap-3 pt-2">
          <Button buttonType="primary" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Request Booking"}
          </Button>
        </div>
      </form>
    </section>
  );
}
