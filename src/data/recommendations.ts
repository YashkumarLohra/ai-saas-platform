import { Recommendation } from "@/types";

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "presentation-ai-1",
    name: "SlideGenius AI",
    description: "An AI-powered presentation maker that instantly generates professional slides, layouts, and copy from a simple text prompt.",
    reasons: [
      "Automatically creates visually appealing slide layouts.",
      "Generates speaking notes and tailored copy.",
      "Easy export to PowerPoint and Google Slides."
    ],
    bestFor: "College students and professionals needing quick slide decks.",
    pricing: "Free Tier Available"
  },
  {
    id: "presentation-ai-2",
    name: "DeckCraft Pro",
    description: "Advanced presentation tool featuring deep customization, branded templates, and AI-driven data visualization.",
    reasons: [
      "Excellent AI charting for complex data.",
      "Strict adherence to brand/school guidelines.",
      "Real-time collaboration features."
    ],
    bestFor: "Complex presentations with lots of data or charts.",
    pricing: "$12/month (Student Discount Available)"
  },
  {
    id: "presentation-ai-3",
    name: "VisualPitch",
    description: "Focuses on highly visual, storytelling-driven presentations with beautiful stock imagery integration.",
    reasons: [
      "Curates stunning images automatically.",
      "Focuses on storytelling flow.",
      "Minimalist, modern templates out-of-the-box."
    ],
    bestFor: "Design-focused or creative assignments.",
    pricing: "Freemium"
  }
];
