import Headings from "@/components/primary/Headings";
import Button from "@/components/primary/Button";

export default function Footer() {
  return (
    <section className="w-full bg-background text-gray-600 dark:text-foreground py-4 px-6 md:px-20">
      <div className="mx-auto text-center text-xs">
        <p className="mb-1">
          All procedures are performed by qualified health practitioners.
          Results vary between individuals. Please consult with our team to
          discuss your needs and suitability.
        </p>
        <p>
          © {new Date().getFullYear()} Aesthetics By Dr Hendler. All rights
          reserved.
        </p>
        <p>
          Registered with AHPRA. This website complies with AHPRA advertising
          guidelines.{" "}
          <a href="/privacy-policy" className="underline hover:text-primary">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="/terms-of-use" className="underline hover:text-primary">
            Terms of Use
          </a>
        </p>
      </div>
    </section>
  );
}
