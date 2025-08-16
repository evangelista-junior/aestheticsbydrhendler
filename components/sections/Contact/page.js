"use client";
import Headings from "@/components/Primary/Headings/page";
import { useForm } from "react-hook-form";
import InputForm from "./components/InputForm/page";
import Button from "@/components/Primary/Button/page";
import { Send } from "lucide-react";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //TODO: ajustar a funçao e requirements
  const onSubmit = (data) => console.log(`!!!!! ${data}`);

  return (
    <section className="w-full py-16 px-6 bg-easyWhite text-gray-600 lg:px-20">
      <Headings
        headingType="h2"
        className="uppercase font-extralight tracking-widest italic mb-4 text-center"
      >
        Contact Us
      </Headings>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10 w-full">
        <div className="mb-6">
          <div className="flex flex-col gap-3 ">
            <address className="not-italic text-textSecondary space-y-0.5 mb-2">
              <p>
                📞 tel:{" "}
                <a href="tel:+610404058431" className=" hover:underline">
                  +61 404 058 431
                </a>
              </p>
              <p>
                📧 email:{" "}
                <a
                  href="mailto:info@aestheticsbydrhendler.com.au"
                  className=" hover:underline"
                >
                  info@aestheticsbydrhendler.com.au
                </a>
              </p>
              <p>📍 Bondi, Sydney Eastern Suburbs, NSW</p>
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
          <div className="flex flex-col lg:flex-row gap-2">
            <InputForm
              inputName="First Name"
              hookFormSettings={{
                ...register("firstName", { required: true }),
              }}
            />
            <InputForm
              inputName="Last Name"
              hookFormSettings={{ ...register("lastName", { required: true }) }}
            />
          </div>

          <InputForm
            inputName="📞 Phone Number"
            hookFormSettings={{
              ...register("phoneNumber", { required: true }),
            }}
            inputType="tel"
          />
          <InputForm
            inputName="📧 Email"
            hookFormSettings={{ ...register("email", { required: true }) }}
            inputType="email"
          />

          <textarea
            placeholder="Please provide your details and message so we can offer you the best service."
            {...register("message", { required: true })}
            required
            className="
              w-full
              border border-gray-300
              bg-white
              p-2
              text-gray-700
              shadow-sm
              focus:border-primary-300
              focus:ring-2
              focus:ring-primary-200
              focus:outline-none
              transition
              duration-300
              resize-none
              !h-[100px]
            "
          />

          {errors.exampleRequired && <span>This field is required</span>}

          <Button buttonType="dark" type="submit">
            <Send size={20} aria-hidden="true" focusable="false" />
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
