import Button from "@/components/primary/Button";
import Headings from "@/components/primary/Headings";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What treatments are available?",
    a: `We offer non-surgical aesthetic procedures including wrinkle-relaxing injections and skin rejuvenation treatments. Each treatment is performed by a registered medical doctor. The suitability of any procedure will be assessed during your medical consultation, where we work with you to ensure your plan aligns with your personal goals and preferences.`,
  },
  {
    q: "Are these treatments safe?",
    a: `Your safety is central to everything we do. We use TGA-approved products, follow evidence-based medical protocols, and perform all procedures to the highest standard of care. All medical treatments carry potential risks and side effects, which is why our consultations are designed to provide clear, balanced information to help you make an informed decision.`,
  },
  {
    q: "Will my results look natural?",
    a: `Our approach is to enhance your natural beauty in a way that is effective yet undetectable. While results vary from person to person, our aim is to create subtle, refined outcomes that reflect your individual features based on an agreed treatment plan. We will discuss what is realistic for you during your consultation.`,
  },
  {
    q: "How long do treatments take?",
    a: `Most treatments take around 30 minutes to complete, though this can vary depending on your individual plan. We will give you an estimate during your consultation so you can plan your visit comfortably.`,
  },
  {
    q: "When will I notice results?",
    a: `It depends on the treatment:\n- Wrinkle-relaxing injections may take several days to show changes.\n- Skin rejuvenation treatments may require multiple sessions for gradual improvement.\nNot all patients will have the same experience or timeframe.`,
  },
  {
    q: "How long will results last?",
    a: `Duration varies based on the treatment, your lifestyle, and how your body responds. On average, results may last several months, but this is not guaranteed. We’ll guide you on the best ways to maintain your results if you wish to.`,
  },
  {
    q: "Is there discomfort during treatment?",
    a: `Some procedures may cause mild discomfort. We use gentle techniques, refined through Dr Hendler’s paediatric experience, and when appropriate, numbing agents to help make your experience as comfortable as possible.`,
  },
  {
    q: "What happens at the first appointment?",
    a: `Your first appointment is a thorough consultation. We’ll talk about your goals, medical history, and what you’d like to achieve. You’ll receive personalised recommendations, along with a clear explanation of potential outcomes, risks, and aftercare before deciding whether to proceed.`,
  },
  {
    q: "Do I need an initial medical consultation?",
    a: `Yes. A consultation ensures the treatment is appropriate, safe, and tailored to your needs. Dr Hendler is able to provide this for all new patients.`,
  },
  {
    q: "Can I have treatments while pregnant or breastfeeding?",
    a: `Injectable treatments are not recommended during pregnancy or while breastfeeding.`,
  },
  {
    q: "How much will treatment cost?",
    a: `Treatment costs vary depending on the type of procedure, the amount of product required, and your personalised treatment plan. We can provide an estimate upon enquiry; however, as individual dosing and treatments differ, an exact quote can only be confirmed during your initial assessment.`,
  },
  {
    q: "How do I book?",
    a: `You can book by phone, email, through our secure online booking system, or send us an enquiry via Instagram @aestheticsbydrhendler.`,
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="text-gray-600 bg-white">
      <div className="relative px-4 pt-16 pb-4 xl:px-8 xl:max-w-1/2 mx-auto">
        <Headings
          headingType="h2"
          className="uppercase font-extralight tracking-widest italic mb-8 text-center "
        >
          Frequently Asked Questions
        </Headings>

        <div className="divide-y divide-primary-300">
          {faqs.map((item, idx) => (
            <details key={idx} className="group p-4 transition duration">
              <summary className="cursor-pointer flex items-center uppercase gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center group-open:rotate-45 group-open:text-primary-500 transition-all duration-300">
                  <Plus size={20} aria-hidden="true" focusable="false" />
                </span>
                <h3 className="text-lg tracking-wide font-bold text-gray-700 group-open:tracking-widest group-open:text-primary-500 transition-all duration-300">
                  {item.q}
                </h3>
              </summary>
              <div className="mt-2 text-gray-500 tracking-wide flex flex-col items-center">
                {item.a}

                {item.q === "How do I book?" && (
                  <Button buttonType="outline">Book Here</Button>
                )}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-2 text-xs text-gray-400 text-center">
          Information provided is general in nature and does not replace medical
          advice. A consultation is required to assess suitability and discuss
          potential risks.
        </p>
      </div>
    </section>
  );
}
