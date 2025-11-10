export default function Footer() {
  return (
    <footer className="w-full text-gray-600 py-4 px-6 md:px-20 uppercase">
      <div className="mx-auto text-center text-xs">
        <p>
          © {new Date().getFullYear()} Aesthetics By Dr Hendler. All rights
          reserved.{" "}
          <span className="text-primary">
            Website developed by{" "}
            <a
              className="underline tracking-wider"
              href="https://www.evan-tx.dev/"
              target="_blank"
            >
              evan-tx.dev
            </a>
          </span>
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

        <p>
          All procedures are performed by qualified health practitioners.
          Results vary between individuals. Please consult with our team to
          discuss your needs and suitability.
        </p>
      </div>
    </footer>
  );
}
