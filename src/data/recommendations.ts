import { Recommendation } from "@/types/index";

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "presentation-ai-1",
    slug: "slide-genius-ai",
    name: "SlideGenius AI",
    description: "An AI-powered presentation maker that instantly generates professional slides, layouts, and copy from a simple text prompt.",
    category: "Presentation Generation",
    reasons: [
      "Automatically creates visually appealing slide layouts.",
      "Generates speaking notes and tailored copy.",
      "Easy export to PowerPoint and Google Slides."
    ],
    bestFor: "College students and professionals needing quick slide decks.",
    pricing: "Free Tier Available",
    features: ["Text-to-slide generation", "AI image generation", "PowerPoint export", "Collaboration tools"],
    pros: ["Extremely fast generation", "No design skills required", "Generous free tier"],
    cons: ["Limited custom layout controls", "Templates can look slightly repetitive"]
  },
  {
    id: "presentation-ai-2",
    slug: "deckcraft-pro",
    name: "DeckCraft Pro",
    description: "Advanced presentation tool featuring deep customization, branded templates, and AI-driven data visualization.",
    category: "Data Visualization & Pitch Decks",
    reasons: [
      "Excellent AI charting for complex data.",
      "Strict adherence to brand/school guidelines.",
      "Real-time collaboration features."
    ],
    bestFor: "Complex presentations with lots of data or charts.",
    pricing: "$12/month (Student Discount Available)",
    features: ["AI Data-to-chart processing", "Brand kit enforcement", "Real-time co-editing", "Advanced animations"],
    pros: ["Highly customizable", "Great for data-heavy assignments", "Strong team features"],
    cons: ["Steeper learning curve", "No free plan available (only trial)"]
  },
  {
    id: "presentation-ai-3",
    slug: "visual-pitch",
    name: "VisualPitch",
    description: "Focuses on highly visual, storytelling-driven presentations with beautiful stock imagery integration.",
    category: "Storytelling & Visuals",
    reasons: [
      "Curates stunning images automatically.",
      "Focuses on storytelling flow.",
      "Minimalist, modern templates out-of-the-box."
    ],
    bestFor: "Design-focused or creative assignments.",
    pricing: "Freemium",
    features: ["Automated image sourcing", "Storyboarding mode", "Web-based interactive presentations", "Video embedding"],
    pros: ["Beautiful aesthetics out of the box", "Interactive elements engage audiences", "Great for portfolios"],
    cons: ["Not easily exported to PDF/PPT without formatting loss", "Can be resource-heavy on older devices"]
  },
  {
    id: "video-ai-1",
    slug: "video-craft-ai",
    name: "VideoCraft AI",
    description: "An AI video generation platform that helps you create engaging videos and handles background removal effortlessly.",
    category: "Video Creation",
    reasons: [
      "Extremely fast video rendering.",
      "Flawless background removal.",
      "High-quality automated captions."
    ],
    bestFor: "Content creators needing quick video edits.",
    pricing: "$20/month",
    features: ["Text-to-video", "Background removal", "Auto-captioning", "Voiceovers"],
    pros: ["Easy to use", "Great background removal", "High-quality voices"],
    cons: ["Slightly expensive", "Limited export formats"]
  },
  {
    id: "coding-ai-1",
    slug: "code-pilot-ai",
    name: "CodePilot AI",
    description: "An intelligent coding assistant that helps you write, debug, and review code faster in any IDE.",
    category: "Coding & Development",
    reasons: [
      "Deeply understands your codebase.",
      "Provides highly accurate coding suggestions.",
      "Helps write unit tests automatically."
    ],
    bestFor: "Software engineers and students learning coding.",
    pricing: "Free for students / $10/month",
    features: ["Code completion", "Bug detection", "Test generation", "Code review"],
    pros: ["Excellent context awareness", "Supports all major languages", "Fast responses"],
    cons: ["Can occasionally hallucinate complex logic", "Requires internet connection"]
  }
];
