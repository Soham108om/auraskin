import { Product } from '../types';

export const products: Product[] = [
  {
    id: "p1",
    name: "Hydra-Nectar Cleansing Milk",
    category: "Face Wash",
    description: "A silky, low-foaming cleansing milk that gently lifts impurities while preserving the skin's moisture barrier.",
    longDescription: "Formulated with soothing chamomile and moisturizing squalane, our Hydra-Nectar Cleansing Milk dissolves makeup, daily pollution, and excess sebum without stripping the skin. It leaves the complexion feeling clean, soft, and balanced, ready for the next steps in your ritual.",
    ingredients: ["Water (Aqua)", "Squalane", "Glycerin", "Chamomile Extract", "Centella Asiatica Extract", "Panthenol", "Coco-Glucoside", "Cetearyl Alcohol", "Ethylhexylglycerin"],
    skinType: ["Dry", "Sensitive", "Normal", "Combination"],
    concern: ["Dryness", "Sensitivity", "Dullness"],
    benefits: ["Gently removes impurities", "Replenishes skin lipids", "Calms redness and irritation"],
    rating: 4.8,
    reviewsCount: 124,
    price: 1299,
    discount: 0,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop"
    ],
    size: "150ml",
    sizes: ["150ml","250ml","400ml"],
    scents: ["Signature Chamomile","Fresh Lavender","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r1_1", user: "Eleanor V.", rating: 5, comment: "The most luxurious cleanser I have ever used. My dry skin feels so soft after washing, no tightness at all.", date: "2026-05-12", verified: true },
      { id: "r1_2", user: "Marcus K.", rating: 4.5, comment: "Excellent for double cleansing. It washes away easily and feels incredibly soothing.", date: "2026-06-01", verified: true }
    ],
    faqs: [
      { question: "Can this remove waterproof makeup?", answer: "Yes, it gently breaks down light makeup and sunscreen. For heavy waterproof mascara, we recommend double cleansing with a makeup remover first." },
      { question: "Is this suitable for acne-prone skin?", answer: "Absolutely. It is non-comedogenic and very gentle, ensuring it won't irritate active breakouts." }
    ]
  },
  {
    id: "p2",
    name: "C-Luminescence Radiance Serum",
    category: "Vitamin C Serum",
    description: "A potent 15% Vitamin C serum enhanced with Ferulic Acid and Vitamin E to brighten dark spots and protect against environmental stressors.",
    longDescription: "Unveil a glowing complexion with our C-Luminescence Radiance Serum. Utilizing a stable, pure form of L-Ascorbic Acid combined with Ferulic Acid, it works synergistically to neutralize free radicals, visibly fade hyperpigmentation, boost collagen production, and even out skin tone.",
    ingredients: ["Water (Aqua)", "L-Ascorbic Acid (15%)", "Tocopherol (Vitamin E)", "Ferulic Acid", "Hyaluronic Acid", "Ethoxydiglycol", "Panthenol", "Phenoxyethanol"],
    skinType: ["Normal", "Dry", "Combination", "Oily"],
    concern: ["Dullness", "Dark Spots", "Aging"],
    benefits: ["Brightens overall skin tone", "Fades acne marks and sun spots", "Boosts environmental defense"],
    rating: 4.9,
    reviewsCount: 318,
    price: 2499,
    discount: 10,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop"
    ],
    size: "30ml",
    sizes: ["30ml","60ml","100ml"],
    scents: ["Signature Citrus","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r2_1", user: "Sofia R.", rating: 5, comment: "I've tried many Vit C serums, but this one gave me visible brightness in just two weeks! Smells fresh and absorbs fast.", date: "2026-04-20", verified: true },
      { id: "r2_2", user: "Devon M.", rating: 4.8, comment: "Faded my stubborn hyperpigmentation marks. Highly recommend layering it under sunscreen.", date: "2026-05-18", verified: true }
    ],
    faqs: [
      { question: "Should I use this in the AM or PM?", answer: "We highly recommend using it in the morning (AM) under sunscreen to double your defense against UV rays." },
      { question: "How should I store this serum?", answer: "To prevent oxidation, store it in a cool, dark place away from direct sunlight, and keep the cap tightly sealed." }
    ]
  },
  {
    id: "p3",
    name: "Niacinamide-10 Pore Refiner",
    category: "Niacinamide Serum",
    description: "A clean, lightweight 10% Niacinamide serum with 1% Zinc PCA to regulate sebum, tighten pores, and refine skin texture.",
    longDescription: "Engineered to clarify oily and congested skin, this lightweight Niacinamide-10 serum targets excess oil production, minimizes the appearance of enlarged pores, and strengthens the skin's moisture barrier. Zinc PCA is added to calm blemishes and reduce redness.",
    ingredients: ["Water (Aqua)", "Niacinamide (10%)", "Zinc PCA (1%)", "Hyaluronic Acid", "Allantoin", "Xanthan Gum", "Phenoxyethanol"],
    skinType: ["Oily", "Combination", "Normal"],
    concern: ["Acne", "Dullness"],
    benefits: ["Regulates oil production", "Visibly shrinks pores", "Calms active breakouts and redness"],
    rating: 4.7,
    reviewsCount: 245,
    price: 1199,
    discount: 15,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
    ],
    size: "30ml",
    sizes: ["30ml","60ml","100ml"],
    scents: ["Signature Tea Tree","Fragrance Free"],
    isNewArrival: true,
    reviews: [
      { id: "r3_1", user: "Clara T.", rating: 5, comment: "My skin is normally an oil slick by midday, but this has regulated it completely. My pores look much smaller.", date: "2026-06-11", verified: true }
    ],
    faqs: [
      { question: "Can I use Niacinamide with Vitamin C?", answer: "Yes, you can layer them. However, if you have sensitive skin, we recommend using Vitamin C in the morning and Niacinamide at night." }
    ]
  },
  {
    id: "p4",
    name: "Retinol-A Renewal Concentrate",
    category: "Retinol Serum",
    description: "An advanced 0.5% pure Retinol night serum blended with peptides and ceramides to target fine lines, wrinkles, and uneven texture.",
    longDescription: "Accelerate cellular turnover and restore youthful vitality with our Retinol-A Renewal Concentrate. Formulated in a nourishing, lipid-rich base containing ceramides and peptides, this night treatment delivers active Retinol deeply into the skin with minimal irritation, revealing smoother, firmer, and clearer skin.",
    ingredients: ["Water (Aqua)", "Caprylic/Capric Triglyceride", "Glycerin", "Pure Retinol (0.5%)", "Ceramide NP", "Palmitoyl Tripeptide-1", "Hyaluronic Acid", "Lecithin", "Polysorbate 20"],
    skinType: ["Normal", "Dry", "Combination", "Oily"],
    concern: ["Aging", "Dullness"],
    benefits: ["Reduces fine lines and wrinkles", "Improves skin elasticity", "Evens out skin texture"],
    rating: 4.8,
    reviewsCount: 198,
    price: 2799,
    discount: 5,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
    ],
    size: "30ml",
    sizes: ["30ml","60ml"],
    scents: ["Signature Botanical","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r4_1", user: "Gwen S.", rating: 5, comment: "I was scared of retinol peeling, but this nourishing formula is incredibly gentle. My fine lines are noticeably softer.", date: "2026-03-30", verified: true }
    ],
    faqs: [
      { question: "How often should I apply this?", answer: "Start with 2-3 nights per week to build tolerance. Gradually increase frequency as your skin adjusts." },
      { question: "Is this safe to use during pregnancy?", answer: "We advise against using products containing Retinol during pregnancy or breastfeeding." }
    ]
  },
  {
    id: "p5",
    name: "Ceramide-Barrier Rich Cream",
    category: "Moisturizer",
    description: "A deeply nourishing, whipped face cream featuring 3 essential ceramides, fatty acids, and cholesterol to rebuild dry, compromised skin.",
    longDescription: "Our Ceramide-Barrier Rich Cream is the ultimate recovery treatment for dry, sensitive, or compromised skin. Specially designed with a bio-identical lipid complex, it immediately locks in moisture, repairs the protective skin barrier, and defends against cold weather or harsh actives.",
    ingredients: ["Water (Aqua)", "Glycerin", "Caprylic/Capric Triglyceride", "Ceramide NP", "Ceramide AP", "Ceramide EOP", "Phytosphingosine", "Cholesterol", "Shea Butter", "Squalane", "Hyaluronic Acid"],
    skinType: ["Dry", "Sensitive", "Normal"],
    concern: ["Dryness", "Sensitivity"],
    benefits: ["Restores damaged skin barrier", "Locks in deep moisture for 24h", "Soothes flakiness and tightness"],
    rating: 4.9,
    reviewsCount: 412,
    price: 1899,
    discount: 10,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop"
    ],
    size: "50ml",
    sizes: ["50ml","100ml","150ml"],
    scents: ["Signature Oatmeal","Calming Lavender","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r5_1", user: "Amelia H.", rating: 5, comment: "Saved my skin after I overused exfoliating acids! The texture is rich but doesn't feel heavy or greasy.", date: "2026-05-24", verified: true }
    ],
    faqs: [
      { question: "Is this suitable for oily skin?", answer: "It is designed for dry and normal skin types. If you have oily skin, you might prefer a lightweight gel-cream." }
    ]
  },
  {
    id: "p6",
    name: "Solar-Shield Fluid SPF 50+",
    category: "Sunscreen SPF50",
    description: "An ultra-light, invisible daily sunscreen fluid that offers broad-spectrum SPF 50+ protection with a satin, weightless finish.",
    longDescription: "Say goodbye to thick, greasy sunscreens. Our Solar-Shield Fluid SPF 50+ is a advanced, fast-absorbing sunscreen that leaves zero white cast and creates a breathable, velvet-matte base. Enriched with green tea extract to shield skin against environmental pollutants.",
    ingredients: ["Water (Aqua)", "Dibutyl Adipate", "Diethylamino Hydroxybenzoyl Hexyl Benzoate", "Ethylhexyl Triazone", "Niacinamide", "Green Tea Extract", "Adenosine", "Allantoin", "Tocopherol"],
    skinType: ["All", "Sensitive", "Oily", "Dry", "Combination", "Normal"],
    concern: ["Sun Protection", "Aging"],
    benefits: ["Broad-spectrum UVA/UVB protection", "No white cast or sticky residue", "Sits beautifully under makeup"],
    rating: 4.8,
    reviewsCount: 389,
    price: 1499,
    discount: 0,
    image: "https://images.unsplash.com/photo-1598440947572-c51f33f07a50?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598440947572-c51f33f07a50?q=80&w=600&auto=format&fit=crop"
    ],
    size: "50ml",
    sizes: ["50ml","100ml"],
    scents: ["Signature Aloe","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r6_1", user: "Toby L.", rating: 5, comment: "Finally, a sunscreen that doesn't burn my eyes or make me look like a ghost. Feels like absolutely nothing on my skin.", date: "2026-06-28", verified: true }
    ],
    faqs: [
      { question: "Is this chemical or mineral?", answer: "This is a modern organic (chemical) sunscreen utilizing next-generation UV filters for high stability and zero white cast." }
    ]
  },
  {
    id: "p7",
    name: "Jasmine Infusion Hydrating Toner",
    category: "Toner",
    description: "A soothing, alcohol-free toner infused with Jasmine water and beta-glucan to hydrate, balance pH, and calm stressed skin.",
    longDescription: "Our Jasmine Infusion Hydrating Toner prepares and plumps the skin. Real jasmine flower distillate calms inflammation while beta-glucan delivers deep hydration that lasts. Ideal for restoring pH balance immediately after cleansing.",
    ingredients: ["Jasmine Flower Water", "Glycerin", "Beta-Glucan", "Licorice Root Extract", "Hyaluronic Acid", "Centella Asiatica Extract", "Panthenol", "Allantoin"],
    skinType: ["Dry", "Sensitive", "Normal", "Combination"],
    concern: ["Dryness", "Sensitivity"],
    benefits: ["Intensely hydrates and plumps", "Calms skin redness", "Restores optimal pH balance"],
    rating: 4.6,
    reviewsCount: 88,
    price: 1099,
    discount: 10,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop"
    ],
    size: "120ml",
    sizes: ["120ml","200ml","300ml"],
    scents: ["Jasmine Infusion","Fragrance Free"],
    isNewArrival: true,
    reviews: [
      { id: "r7_1", user: "Leah F.", rating: 4.8, comment: "Smells divine and feels so refreshing. I layer it 3 times for extra plumpness.", date: "2026-07-02", verified: true }
    ],
    faqs: [
      { question: "Can I apply this with my hands?", answer: "Yes! In fact, we recommend pressing it directly into your skin with clean hands to minimize product waste from cotton pads." }
    ]
  },
  {
    id: "p8",
    name: "Rosewater Dew Mist",
    category: "Face Mist",
    description: "A refreshing, fine-mist spray formulated with pure rose hydrosol and aloe vera to revive dry, dull skin anytime.",
    longDescription: "Instantly hydrate and refresh your skin throughout the day with the Rosewater Dew Mist. Emitting a micro-fine cloud, it infuses skin with moisture, refreshes makeup, and delivers a boost of antioxidants from organic rose petals.",
    ingredients: ["Rose Flower Water", "Aloe Barbadensis Leaf Juice", "Glycerin", "Witch Hazel Distillate", "Sodium PCA", "Panthenol", "Phenoxyethanol"],
    skinType: ["All", "Dry", "Normal", "Combination", "Oily", "Sensitive"],
    concern: ["Dryness", "Dullness"],
    benefits: ["Instant hydration boost", "Refreshes makeup throughout the day", "Calms skin on contact"],
    rating: 4.5,
    reviewsCount: 76,
    price: 899,
    discount: 0,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1598440947572-c51f33f07a50?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop"
    ],
    size: "80ml",
    sizes: ["80ml","150ml"],
    scents: ["Rose Hydrosol","Fragrance Free"],
    reviews: [
      { id: "r8_1", user: "Naomi W.", rating: 5, comment: "I keep this on my desk. It keeps my skin from drying out under office AC. Smells like fresh roses.", date: "2026-06-15", verified: true }
    ],
    faqs: [
      { question: "Does this contain artificial perfume?", answer: "No, the fragrance comes 100% naturally from steam-distilled organic rose water." }
    ]
  },
  {
    id: "p9",
    name: "Squalane & Rose Gold Facial Oil",
    category: "Face Oil",
    description: "A luxurious, fast-absorbing facial oil combining pure sugarcane squalane and rosehip oil to seal in moisture and impart a radiant glow.",
    longDescription: "Transform dry, dull skin with our Squalane & Rose Gold Facial Oil. By combining the ultra-lightweight hydration of pure squalane with the cellular-regenerative nutrients of cold-pressed Rosehip Oil, this blend creates a powerful barrier seal without feeling heavy or blocking pores.",
    ingredients: ["Sugarcane Squalane", "Rosehip Seed Oil", "Jojoba Seed Oil", "Vitamin E (Tocopherol)", "Sunflower Seed Oil", "Gold Leaf (24K)", "Geranium Essential Oil"],
    skinType: ["Dry", "Normal", "Combination", "Sensitive"],
    concern: ["Dryness", "Aging", "Dullness"],
    benefits: ["Locks in serums and moisturizers", "Restores deep, healthy glow", "Improves elasticity and texture"],
    rating: 4.9,
    reviewsCount: 156,
    price: 1999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601612628452-9e99ced43524?q=80&w=600&auto=format&fit=crop"
    ],
    size: "30ml",
    sizes: ["30ml","60ml"],
    scents: ["Rosehip & Geranium","Fragrance Free"],
    reviews: [
      { id: "r9_1", user: "Victoria D.", rating: 5, comment: "Fabulous face oil! It absorbs incredibly fast and leaves my face looking radiant. Love the subtle gold flecks.", date: "2026-05-19", verified: true }
    ],
    faqs: [
      { question: "Will this clog my acne-prone skin?", answer: "Squalane is non-comedogenic and mimics skin's natural sebum, so it is highly unlikely to clog pores compared to heavy oils." }
    ]
  },
  {
    id: "p10",
    name: "Matcha Detoxifying Clay Mask",
    category: "Clay Mask",
    description: "A creamy clay mask formulated with Uji Matcha and Kaolin clay to deep-clean pores and draw out toxins without drying the skin.",
    longDescription: "Our Matcha Detoxifying Clay Mask offers a spa-like pore purification. French green clay and white Kaolin draw out excess oils, blackheads, and skin pollutants, while organic Uji Matcha green tea delivers a concentrated dosage of antioxidants to soothe skin and reduce redness.",
    ingredients: ["Water (Aqua)", "Kaolin Clay", "Bentonite", "Glycerin", "Matcha Green Tea Powder", "Green Tea Extract", "Allantoin", "Centella Asiatica Extract", "Phenoxyethanol"],
    skinType: ["Oily", "Combination", "Normal"],
    concern: ["Acne", "Dullness"],
    benefits: ["Unclogs pores and removes blackheads", "Soothes acne inflammation", "Smooths skin texture"],
    rating: 4.7,
    reviewsCount: 172,
    price: 1399,
    discount: 15,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop"
    ],
    size: "80g",
    sizes: ["80g","150g"],
    scents: ["Uji Matcha","Fragrance Free"],
    reviews: [
      { id: "r10_1", user: "Lucas M.", rating: 5, comment: "Best clay mask ever. Doesn't crack or dry out my face completely, yet leaves it feeling so clean and fresh.", date: "2026-06-20", verified: true }
    ],
    faqs: [
      { question: "How long should I leave it on?", answer: "Leave it on for 10-15 minutes until it is semi-dry, then rinse gently with warm water." }
    ]
  },
  {
    id: "p11",
    name: "Midnight Hydration Sleeping Mask",
    category: "Sleeping Mask",
    description: "An overnight gel-mask enriched with hyaluronic acid, squalane, and melatonin to deeply hydrate and repair skin while you sleep.",
    longDescription: "Restore lost moisture overnight. The Midnight Hydration Sleeping Mask works during the skin's peak recovery hours. This gel-water mask locks in moisture like a protective sleeve, infusing your cells with nourishing squalane and barrier-supportive ceramides so you wake up to incredibly plump, dew-kissed skin.",
    ingredients: ["Water (Aqua)", "Glycerin", "Squalane", "Hyaluronic Acid", "Ceramide NP", "Melatonin", "Allantoin", "Avena Sativa (Oat) Kernel Extract", "Dimethicone"],
    skinType: ["Dry", "Normal", "Combination", "Sensitive"],
    concern: ["Dryness", "Dullness"],
    benefits: ["Plumps and hydrates overnight", "Locks in evening skincare layers", "Calms and repairs tired skin"],
    rating: 4.8,
    reviewsCount: 204,
    price: 1599,
    discount: 5,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop"
    ],
    size: "70ml",
    sizes: ["70ml","120ml"],
    scents: ["Soothing Lavender","Fragrance Free"],
    isNewArrival: true,
    reviews: [
      { id: "r11_1", user: "Fiona J.", rating: 5, comment: "I wake up with the plumpest, softest skin when I use this. It doesn't transfer to my pillow sheet either!", date: "2026-06-30", verified: true }
    ],
    faqs: [
      { question: "Do I wash this off?", answer: "No, leave it on overnight. Simply wash your face as normal the following morning." }
    ]
  },
  {
    id: "p12",
    name: "Peptide-Complex Eye Treatment",
    category: "Eye Cream",
    description: "A nourishing eye cream with a multi-peptide blend, caffeine, and vitamin C to visibly firm skin, reduce puffiness, and brighten dark circles.",
    longDescription: "Revitalize tired eyes with our Peptide-Complex Eye Treatment. Engineered specifically for the thin, delicate skin surrounding the eyes, this cream combines micro-peptides to support natural collagen, caffeine to drain fluid buildup and puffiness, and stable Vitamin C to fade dark shadows.",
    ingredients: ["Water (Aqua)", "Glycerin", "Acetyl Tetrapeptide-5", "Palmitoyl Tripeptide-5", "Caffeine", "Vitamin C (3-O-Ethyl Ascorbic Acid)", "Shea Butter", "Niacinamide", "Avocado Oil"],
    skinType: ["All", "Dry", "Normal", "Combination", "Oily", "Sensitive"],
    concern: ["Aging", "Dark Spots"],
    benefits: ["Reduces under-eye puffiness", "Fades dark circles", "Smoothes fine lines (crow's feet)"],
    rating: 4.7,
    reviewsCount: 142,
    price: 1799,
    discount: 10,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop"
    ],
    size: "15ml",
    sizes: ["15ml","30ml"],
    scents: ["Fragrance Free"],
    reviews: [
      { id: "r12_1", user: "Helen E.", rating: 4, comment: "I notice a real difference in morning puffiness. It hydrates the under-eye area wonderfully, preventing concealer creasing.", date: "2026-05-04", verified: true }
    ],
    faqs: [
      { question: "Is this safe for sensitive eyes?", answer: "Yes, it is ophthalmologist-tested, fragrance-free, and specifically formulated to be non-irritating." }
    ]
  },
  {
    id: "p13",
    name: "Shea Butter Lip Conditioning Balm",
    category: "Lip Balm",
    description: "A premium lip treatment packed with organic shea butter and oils to deeply moisturize and restore chapped lips with a glassy gloss.",
    longDescription: "Drench your lips in luxury. Our Shea Butter Lip Conditioning Balm features a dense, buttery texture that melts onto lips. Formulated with botanical seed oils and premium shea butter, it heals flakes, locks in moisture, and leaves a subtle, healthy shine.",
    ingredients: ["Castor Seed Oil", "Shea Butter", "Beeswax", "Jojoba Esters", "Candelilla Wax", "Almond Oil", "Tocopherol", "Natural Vanilla Extract"],
    skinType: ["All", "Dry", "Sensitive"],
    concern: ["Dryness"],
    benefits: ["Heals cracked, dry lips", "Provides a long-lasting moisture barrier", "Leaves a gorgeous, non-sticky glossy finish"],
    rating: 4.8,
    reviewsCount: 231,
    price: 699,
    discount: 0,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop"
    ],
    size: "10g",
    sizes: ["10g","20g"],
    scents: ["Vanilla Bean","Rose Petal","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r13_1", user: "Zoe B.", rating: 5, comment: "Like a pillow for your lips! I apply a thick layer before bed and wake up with the softest lips.", date: "2026-06-25", verified: true }
    ],
    faqs: [
      { question: "Is this sticky?", answer: "Not at all. It feels like a rich, nourishing oil-balm that absorbs comfortably." }
    ]
  },
  {
    id: "p14",
    name: "Velvet-Silk Body Lotion",
    category: "Body Lotion",
    description: "A fast-absorbing, barrier-supporting body lotion containing niacinamide, oats, and sweet almond oil to soften skin.",
    longDescription: "Extend luxury care to your entire body. Our Velvet-Silk Body Lotion provides continuous hydration while strengthening your skin's protective barrier. Formulated with soothing colloidal oats to calm itchiness and Niacinamide to improve tone and texture.",
    ingredients: ["Water (Aqua)", "Sweet Almond Oil", "Glycerin", "Caprylic/Capric Triglyceride", "Niacinamide", "Colloidal Oatmeal Extract", "Shea Butter", "Cetearyl Alcohol", "Panthenol"],
    skinType: ["All", "Dry", "Sensitive"],
    concern: ["Dryness", "Sensitivity"],
    benefits: ["Deeply moisturizes without grease", "Soothes itching and irritation", "Improves overall body skin tone"],
    rating: 4.7,
    reviewsCount: 112,
    price: 1199,
    discount: 5,
    image: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?q=80&w=600&auto=format&fit=crop"
    ],
    size: "200ml",
    sizes: ["200ml","400ml","600ml"],
    scents: ["Sweet Almond","Calming Lavender","Fragrance Free"],
    reviews: [
      { id: "r14_1", user: "Oliver P.", rating: 4.5, comment: "Incredible lotion. It melts into the skin instantly and keeps me hydrated all day long.", date: "2026-05-14", verified: true }
    ],
    faqs: [
      { question: "Does it have a strong scent?", answer: "It has a very light, natural almond and vanilla scent that is subtle and non-irritating." }
    ]
  },
  {
    id: "p15",
    name: "Eucalyptus & Sea Salt Body Wash",
    category: "Body Wash",
    description: "An invigorating sulfate-free body wash infused with natural sea salt and organic eucalyptus oil to refresh the senses.",
    longDescription: "Turn your daily shower into a spa ritual. Combining refreshing steam-distilled eucalyptus oils with purifying fine sea salt, this botanical body wash gently cleanses away oils and dirt, leaving skin feeling exceptionally clean, refreshed, and soft.",
    ingredients: ["Water (Aqua)", "Coco-Betaine", "Sodium Lauroyl Methyl Isethionate", "Sea Salt", "Eucalyptus Globulus Leaf Oil", "Glycerin", "Aloe Vera Extract", "Citric Acid"],
    skinType: ["All"],
    concern: ["Dullness"],
    benefits: ["Gentle, non-stripping cleanser", "Invigorating aromatherapy scent", "Removes dead surface cells"],
    rating: 4.6,
    reviewsCount: 95,
    price: 999,
    discount: 0,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop"
    ],
    size: "250ml",
    sizes: ["250ml","500ml"],
    scents: ["Eucalyptus Mint","Fragrance Free"],
    reviews: [
      { id: "r15_1", user: "Sarah M.", rating: 5, comment: "The smell is like an upscale steam room. It leaves my skin feeling super clean and energized.", date: "2026-06-18", verified: true }
    ],
    faqs: [
      { question: "Does it contain sulfates?", answer: "No, it is 100% sulfate-free, using gentle plant-derived surfactants that won't strip skin." }
    ]
  },
  {
    id: "p16",
    name: "Botanical Micro-Exfoliating Scrub",
    category: "Face Scrub",
    description: "A gentle physical and chemical exfoliant containing jojoba esters and bamboo powder to sweep away dead skin.",
    longDescription: "Brighten and smooth your complexion with our Botanical Micro-Exfoliating Scrub. Formulated with perfectly spherical, biodegradable jojoba esters and ultra-fine bamboo powder, it gently buff away flaky skin, while natural fruit acids dissolve dead cells, revealing polished radiance.",
    ingredients: ["Water (Aqua)", "Jojoba Esters", "Bamboo Stem Powder", "Glycerin", "Lactic Acid", "Salicylic Acid", "Green Tea Extract", "Xanthan Gum"],
    skinType: ["Normal", "Dry", "Combination", "Oily"],
    concern: ["Dullness", "Dark Spots"],
    benefits: ["Sweeps away rough skin flakes", "Deeply cleanses congested pores", "Promotes cellular turnover"],
    rating: 4.7,
    reviewsCount: 114,
    price: 1299,
    discount: 10,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop"
    ],
    size: "60g",
    sizes: ["60g","120g"],
    scents: ["Fresh Green Tea","Fragrance Free"],
    reviews: [
      { id: "r16_1", user: "James O.", rating: 4.8, comment: "Finally, a face scrub that isn't like sandpaper. The particles are extremely fine, and my skin feels baby soft after using it.", date: "2026-05-11", verified: true }
    ],
    faqs: [
      { question: "How many times a week should I use this?", answer: "We recommend using it 1 to 2 times a week, preferably in the evening after cleansing." }
    ]
  },
  {
    id: "p17",
    name: "Salicylic-Clarifying Acne Gel",
    category: "Acne Gel",
    description: "A fast-acting, targeted spot treatment gel containing 2% Salicylic Acid (BHA), tea tree, and niacinamide to clear acne blemishes.",
    longDescription: "Kick blemishes to the curb. Our Salicylic-Clarifying Acne Gel penetrates deeply into pores to clear blockages, reduce active acne size, and calm swelling. Combined with niacinamide to help prevent dark spot marks left behind by healed pimples.",
    ingredients: ["Water (Aqua)", "Alcohol Denat.", "Niacinamide", "Salicylic Acid (2%)", "Tea Tree Leaf Oil", "Centella Asiatica Extract", "Allantoin", "Ammonium Acryloyldimethyltaurate/VP Copolymer"],
    skinType: ["Oily", "Combination", "Normal"],
    concern: ["Acne"],
    benefits: ["Clears active acne blemishes", "Unclogs pores and blackheads", "Fades post-acne dark marks"],
    rating: 4.7,
    reviewsCount: 165,
    price: 999,
    discount: 5,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop"
    ],
    size: "15ml",
    sizes: ["15ml","30ml"],
    scents: ["Tea Tree Herb","Fragrance Free"],
    isNewArrival: true,
    reviews: [
      { id: "r17_1", user: "Maya R.", rating: 5, comment: "This is magic in a bottle. My breakouts flatten overnight. Excellent for stubborn maskne.", date: "2026-06-19", verified: true }
    ],
    faqs: [
      { question: "Will this dry out my skin?", answer: "It is a targeted spot treatment, so apply it directly to active blemishes only, which minimizes dryness on surrounding skin." }
    ]
  },
  {
    id: "p18",
    name: "Phyto-Brightening Day Cream",
    category: "Brightening Cream",
    description: "A nourishing day moisturizer containing alpha-arbutin, licorice root, and light-reflecting minerals for an instant luminous finish.",
    longDescription: "Reveal your skin's inner radiance. Our Phyto-Brightening Day Cream combines powerful natural brighteners like Alpha Arbutin and Licorice Extract to inhibit melanin production and clear hyperpigmentation, while delivering all-day lightweight hydration.",
    ingredients: ["Water (Aqua)", "Glycerin", "Caprylic/Capric Triglyceride", "Alpha-Arbutin", "Licorice Root Extract", "Niacinamide", "Shea Butter", "Titanium Dioxide", "Mica", "Phenoxyethanol"],
    skinType: ["Normal", "Dry", "Combination", "Oily"],
    concern: ["Dark Spots", "Dullness"],
    benefits: ["Fades dark spots and hyperpigmentation", "Gives an instant luminous glow", "Hydrates and protects throughout the day"],
    rating: 4.8,
    reviewsCount: 147,
    price: 1899,
    discount: 10,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop"
    ],
    size: "50ml",
    sizes: ["50ml","100ml"],
    scents: ["Licorice Botanical","Fragrance Free"],
    reviews: [
      { id: "r18_1", user: "Diana V.", rating: 4.8, comment: "It leaves my skin looking so glowy and healthy even before I put on makeup. Helps fade my sun spots too.", date: "2026-05-22", verified: true }
    ],
    faqs: [
      { question: "Does it contain SPF?", answer: "No, this is a brightening moisturizer only. We highly recommend layering our Solar-Shield Fluid SPF 50+ on top of it in the morning." }
    ]
  },
  {
    id: "p19",
    name: "Overnight Recovery Sleeping Elixir",
    category: "Night Repair Cream",
    description: "A rich restorative night cream packed with squalane, retinol alternative bakuchiol, and botanical peptides to renew skin overnight.",
    longDescription: "Reset your skin's appearance while you sleep. The Overnight Recovery Sleeping Elixir is infused with Bakuchiol (a gentle, plant-derived Retinol alternative), squalane, and structural peptides. It deeply repairs cellular damage, boosting collagen synthesis so you wake up to firm, smooth, and rested skin.",
    ingredients: ["Water (Aqua)", "Glycerin", "Sugarcane Squalane", "Bakuchiol", "Ceramide NP", "Copper Tripeptide-1", "Hyaluronic Acid", "Rosehip Seed Oil", "Panthenol"],
    skinType: ["All", "Dry", "Sensitive", "Normal", "Combination"],
    concern: ["Aging", "Dryness", "Dullness"],
    benefits: ["Smoothes fine lines and wrinkles", "Improves skin firmness and elasticity", "Deeply restores depleted lipids"],
    rating: 4.9,
    reviewsCount: 183,
    price: 2299,
    discount: 15,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop"
    ],
    size: "50ml",
    sizes: ["50ml","100ml"],
    scents: ["Signature Bakuchiol","Fragrance Free"],
    isBestSeller: true,
    reviews: [
      { id: "r19_1", user: "Nina L.", rating: 5, comment: "I've been using this for a month, and my skin feels so much firmer and smoother. No irritation like standard retinol.", date: "2026-06-03", verified: true }
    ],
    faqs: [
      { question: "Is Bakuchiol safe for sensitive skin?", answer: "Yes, Bakuchiol offers retinol-like benefits without the typical dryness, redness, or skin flaking, making it excellent for sensitive skin." }
    ]
  },
  {
    id: "p20",
    name: "The Signature Ritual Collection",
    category: "Gift Box",
    description: "A beautifully curated, limited-edition gift set containing four of AuraSkin's best sellers for the ultimate luxury routine.",
    longDescription: "Experience the ultimate skincare ritual. The Signature Ritual Collection houses four travel-sized best sellers: Hydra-Nectar Cleansing Milk, C-Luminescence Radiance Serum, Ceramide-Barrier Rich Cream, and Solar-Shield Fluid SPF 50+. Beautifully packaged in an ivory-and-gold aesthetic box.",
    ingredients: ["See individual products for details."],
    skinType: ["All"],
    concern: ["Dryness", "Dullness", "Sun Protection"],
    benefits: ["Complete 4-step daily routine", "Excellent introduction to the brand", "Stunning, premium gift packaging"],
    rating: 5.0,
    reviewsCount: 64,
    price: 3999,
    discount: 20,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"
    ],
    size: "Set of 4",
    sizes: ["Set of 4","Set of 6"],
    scents: ["Luxury Botanical"],
    isBestSeller: true,
    reviews: [
      { id: "r20_1", user: "Cynthia G.", rating: 5, comment: "Gave this to my sister and she absolutely loved it. The packaging feels incredibly expensive and the products work perfectly together.", date: "2026-06-25", verified: true }
    ],
    faqs: [
      { question: "What are the sizes inside?", answer: "It contains Cleansing Milk (50ml), Radiance Serum (15ml), Ceramide Cream (20ml), and Solar-Shield Sunscreen (15ml)." }
    ]
  }
];
