import { Recommendation } from "@/types/index";

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "presentation-ai-1",
    slug: "slide-genius-ai",
    name: "SlideGenius AI",
    description: "An AI-powered presentation maker that instantly generates professional slides, layouts, and copy from a simple text prompt.",
    longDescription: "SlideGenius AI is a comprehensive presentation platform designed to remove the friction from deck creation. By simply typing a prompt, the underlying AI models generate fully structured slides complete with context-aware copywriting, matching stock photography, and beautifully balanced layouts. It's built specifically for users who need to produce high-quality slide decks rapidly without wrestling with formatting tools.",
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
    cons: ["Limited custom layout controls", "Templates can look slightly repetitive"],
    websiteUrl: "https://example.com/slide-genius-ai"
  },
  {
    id: "presentation-ai-2",
    slug: "deckcraft-pro",
    name: "DeckCraft Pro",
    description: "Advanced presentation tool featuring deep customization, branded templates, and AI-driven data visualization.",
    longDescription: "DeckCraft Pro goes beyond simple slide generation by offering an enterprise-grade design experience. Its AI specializes in ingesting raw data (like CSVs or spreadsheets) and automatically converting it into stunning, brand-compliant charts and graphs. With a robust template engine that enforces strict corporate or school guidelines, it ensures every presentation looks professionally designed by a human team.",
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
    cons: ["Steeper learning curve", "No free plan available (only trial)"],
    websiteUrl: "https://example.com/deckcraft-pro"
  },
  {
    id: "presentation-ai-3",
    slug: "visual-pitch",
    name: "VisualPitch",
    description: "Focuses on highly visual, storytelling-driven presentations with beautiful stock imagery integration.",
    longDescription: "VisualPitch rethinks presentations by prioritizing cinematic storytelling over bullet points. Its AI engine scours vast libraries of high-quality, royalty-free stock imagery and video to perfectly match the emotional tone of your script. It builds interactive, web-based presentations that feel more like modern scrolling websites than traditional static slide decks.",
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
    cons: ["Not easily exported to PDF/PPT without formatting loss", "Can be resource-heavy on older devices"],
    websiteUrl: "https://example.com/visual-pitch"
  },
  {
    id: "video-ai-1",
    slug: "video-craft-ai",
    name: "VideoCraft AI",
    description: "An AI video generation platform that helps you create engaging videos and handles background removal effortlessly.",
    longDescription: "VideoCraft AI is a complete suite for modern video creators. Instead of relying on complex timelines, users can generate video sequences from text prompts or let the AI automatically edit existing footage. Its standout feature is its flawless, green-screen-less background removal technology and seamless auto-captioning, making it ideal for social media content production.",
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
    cons: ["Slightly expensive", "Limited export formats"],
    websiteUrl: "https://example.com/video-craft-ai"
  },
  {
    id: "coding-ai-1",
    slug: "code-pilot-ai",
    name: "CodePilot AI",
    description: "An intelligent coding assistant that helps you write, debug, and review code faster in any IDE.",
    longDescription: "CodePilot AI integrates directly into your workflow to act as a tireless pair programmer. By deeply indexing your entire codebase, it understands your architectural patterns and variable context, allowing it to provide highly accurate, multi-line code completions. It can also instantly generate unit tests and perform security-focused code reviews before you commit.",
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
    cons: ["Can occasionally hallucinate complex logic", "Requires internet connection"],
    websiteUrl: "https://example.com/code-pilot-ai"
  }
];
