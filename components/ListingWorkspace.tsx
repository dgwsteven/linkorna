"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Languages,
  ListChecks,
  Search,
  ShoppingBag,
  Sparkles,
  Wand2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EmployeeTaskForm } from "@/components/EmployeeTaskForm";
import { FormSubmitButton } from "@/components/FormSubmitButton";

const marketplaces = [
  "Amazon Germany",
  "Amazon EU",
  "Shopify",
  "eBay Germany",
  "Otto Market",
  "Kaufland.de",
  "Etsy",
  "Zalando",
  "TikTok Shop",
  "Temu",
  "Allegro",
  "Cdiscount",
  "Other"
];

const listingLanguages = ["German", "English", "Chinese", "Marketplace default", "Other"];

const positioningOptions = ["Practical value", "Premium quality", "Price-performance", "Giftable product", "Professional / B2B"];

const listingChecklist = [
  "SEO title and keyword structure",
  "Bullet points and product description",
  "Marketplace-specific tone and compliance",
  "FAQ, search terms and localization notes"
];

const diagnosisByMarketplace: Record<string, string[]> = {
  "Amazon Germany": [
    "标题需要包含核心关键词",
    "五点描述要突出材质、适配性和使用场景",
    "避免夸大医疗、认证或绝对化承诺",
    "后端关键词应覆盖德语长尾搜索"
  ],
  "Amazon EU": [
    "Keep title readable across EU marketplaces",
    "Use benefit-led bullets with compliance-safe wording",
    "Prepare localization notes for German, English and French",
    "Separate backend keywords by country"
  ],
  Shopify: [
    "Lead with brand story and use case",
    "Product page should include specs, FAQ and trust cues",
    "SEO meta title needs clear product category",
    "Description can be more persuasive than marketplace copy"
  ],
  "eBay Germany": [
    "Title should be direct and search-heavy",
    "Condition, compatibility and shipping details must be clear",
    "Use concise German buyer language",
    "Highlight return and warranty information"
  ],
  "Otto Market": [
    "German product data must be clear and structured",
    "Compliance and delivery information should be explicit",
    "Use trust-oriented wording rather than aggressive sales copy",
    "Product attributes need to support marketplace filtering"
  ],
  "Kaufland.de": [
    "Title should balance keywords and readability",
    "Attributes, shipping and warranty details are important",
    "German buyer language should be direct and practical",
    "Highlight product compatibility and package contents"
  ],
  Etsy: [
    "Lead with handmade, design or gift use case where relevant",
    "Use descriptive long-tail keywords",
    "Explain material, size and personalization clearly",
    "Add buyer-friendly FAQ and care notes"
  ],
  Zalando: [
    "Fashion attributes must be precise",
    "Fit, material and care information are critical",
    "Tone should be brand-safe and customer-facing",
    "Avoid unsupported performance or sustainability claims"
  ],
  "TikTok Shop": [
    "Use short benefit-led hooks",
    "Content should support video and live-selling claims",
    "Avoid overly technical descriptions",
    "Focus on visual use cases and quick buyer objections"
  ],
  Temu: [
    "Copy should be concise and price-value focused",
    "Highlight practical features and package contents",
    "Avoid premium brand tone",
    "Keep variation and specification wording simple"
  ],
  Allegro: [
    "Copy should be clear, price-value oriented and attribute-rich",
    "Use practical buyer benefits",
    "Clarify package contents, delivery and returns",
    "Localize key terms for Polish marketplace expectations"
  ],
  Cdiscount: [
    "French marketplace copy should be concise and structured",
    "Use clear title, feature bullets and product specifications",
    "Avoid over-claiming quality or compliance",
    "Include delivery, warranty and compatibility details"
  ],
  Other: [
    "Clarify target platform before final wording",
    "Keep title, bullets and description modular",
    "Prepare keywords and FAQ for later adaptation",
    "Avoid platform-specific claims until channel is confirmed"
  ]
};

const outputByMarketplace: Record<string, { label: string; body: string }[]> = {
  "Amazon Germany": [
    {
      label: "SEO title",
      body: "Verstellbarer Laptopstaender aus Aluminium, faltbar, ergonomischer Notebook Halter fuer Schreibtisch, Silber, kompatibel mit 10-15.6 Zoll"
    },
    {
      label: "Bullet points",
      body:
        "Stabiler Aluminiumrahmen; sechs Hoehenstufen; faltbares Design; verbessert Luftzirkulation; geeignet fuer Homeoffice, Buero und Reisen."
    },
    {
      label: "Product description",
      body:
        "Dieser faltbare Laptopstaender wurde fuer moderne Arbeitsplaetze entwickelt. Er hilft, den Bildschirm angenehmer zu positionieren und den Schreibtisch sauber organisiert zu halten."
    },
    {
      label: "Backend keywords",
      body: "laptop staender, notebook halter, ergonomisch, aluminium, faltbar, schreibtisch zubehoer"
    }
  ],
  "Amazon EU": [
    {
      label: "SEO title",
      body: "Foldable Aluminum Laptop Stand, Adjustable Ergonomic Notebook Riser for Desk, Compatible with 10-15.6 inch Laptops"
    },
    {
      label: "Bullet points",
      body:
        "Stable aluminum build; adjustable viewing angles; compact foldable design; improves airflow; suitable for home office, travel and daily desk use."
    },
    {
      label: "Product description",
      body:
        "A lightweight laptop riser designed for hybrid workspaces, helping users create a cleaner and more comfortable desk setup."
    },
    {
      label: "Backend keywords",
      body: "laptop stand, notebook riser, ergonomic desk accessory, aluminum laptop holder, foldable office stand"
    }
  ],
  Shopify: [
    {
      label: "Product page headline",
      body: "A cleaner, more comfortable desk starts with a better laptop angle."
    },
    {
      label: "Feature blocks",
      body: "Adjustable height, foldable aluminum body, travel-ready profile, improved airflow and a stable daily-work setup."
    },
    {
      label: "Product description",
      body:
        "Designed for focused work, this laptop stand brings practical ergonomics into everyday desks without adding bulk. It folds flat, sets up quickly and fits most common laptop sizes."
    },
    {
      label: "SEO meta",
      body: "Foldable aluminum laptop stand for ergonomic desk setups, home office and travel."
    }
  ],
  "eBay Germany": [
    {
      label: "Listing title",
      body: "Laptopstaender Aluminium Faltbar Verstellbar Notebook Halter Schreibtisch 10-15.6 Zoll"
    },
    {
      label: "Item highlights",
      body: "Faltbar, stabil, verstellbar, kompatibel mit gaengigen Notebookgroessen, ideal fuer Buero und Homeoffice."
    },
    {
      label: "Description",
      body:
        "Praktischer Aluminium Laptopstaender fuer den taeglichen Gebrauch. Bitte pruefen Sie vor dem Kauf die Groesse Ihres Notebooks."
    },
    {
      label: "Buyer notes",
      body: "Include shipping time, return policy, package contents and compatibility range."
    }
  ],
  "Otto Market": [
    {
      label: "Product title",
      body: "Faltbarer Laptopstaender aus Aluminium, verstellbarer Notebook Halter fuer Buero und Homeoffice"
    },
    {
      label: "Key product attributes",
      body: "Material: Aluminium; Farbe: Silber; Nutzung: Schreibtisch, Homeoffice, Reise; Kompatibilitaet: 10-15.6 Zoll."
    },
    {
      label: "Product description",
      body:
        "Ein stabiler und platzsparender Laptopstaender fuer den taeglichen Arbeitsplatz. Die verstellbare Konstruktion unterstuetzt eine angenehmere Bildschirmposition und laesst sich einfach zusammenklappen."
    },
    {
      label: "Buyer FAQ",
      body: "Passt der Staender fuer 15-Zoll-Laptops? Ja, er ist fuer viele gaengige Laptopgroessen bis 15.6 Zoll geeignet."
    }
  ],
  "Kaufland.de": [
    {
      label: "SEO title",
      body: "Laptopstaender Aluminium verstellbar faltbar Notebook Halter fuer Schreibtisch und Homeoffice"
    },
    {
      label: "Selling points",
      body: "Faltbares Design; stabile Aluminiumstruktur; mehrere Hoehenstufen; platzsparend; geeignet fuer Buero, Studium und Reisen."
    },
    {
      label: "Product description",
      body:
        "Dieser Laptopstaender eignet sich fuer Nutzer, die ihren Arbeitsplatz schnell und ordentlich organisieren moechten. Er ist leicht, faltbar und fuer viele gaengige Notebookgroessen geeignet."
    },
    {
      label: "Specification block",
      body: "Material, Farbe, kompatible Laptopgroesse, Gewicht, Lieferumfang, Verpackungsmasse und Pflegehinweise."
    }
  ],
  Etsy: [
    {
      label: "Listing title",
      body: "Minimalist Foldable Laptop Stand, Aluminum Desk Riser, Modern Home Office Gift"
    },
    {
      label: "Buyer story",
      body: "A clean and practical desk accessory for people who want a more organized home office without bulky equipment."
    },
    {
      label: "Description",
      body:
        "This foldable laptop stand combines a simple aluminum look with everyday function. It is suitable for work desks, study corners and travel setups."
    },
    {
      label: "Tags and keywords",
      body: "laptop stand, desk gift, home office, aluminum riser, minimalist desk, work from home, office accessory."
    }
  ],
  Zalando: [
    {
      label: "Product title",
      body: "Foldable Aluminum Laptop Stand - Silver"
    },
    {
      label: "Attribute copy",
      body: "Material, color, dimensions, weight, use case, included items and care instructions must be precise."
    },
    {
      label: "Product description",
      body:
        "A lightweight foldable laptop stand designed for daily desk use, travel and compact workspaces."
    },
    {
      label: "Compliance notes",
      body: "Avoid unsupported sustainability, ergonomic or health claims unless documents are available."
    }
  ],
  "TikTok Shop": [
    {
      label: "Short hook",
      body: "Turn any desk into a cleaner work setup in seconds."
    },
    {
      label: "Benefit bullets",
      body: "Folds flat, raises your screen, keeps airflow open, and fits easily into a laptop bag."
    },
    {
      label: "Product script",
      body:
        "If your laptop sits too low, this foldable stand helps create a more comfortable angle without taking over your desk."
    },
    {
      label: "Creator notes",
      body: "Show before/after desk angle, folding motion, laptop compatibility and travel packing."
    }
  ],
  Temu: [
    {
      label: "Product title",
      body: "Adjustable Foldable Aluminum Laptop Stand for Desk and Travel"
    },
    {
      label: "Selling points",
      body: "Lightweight, foldable, adjustable, stable, space-saving and suitable for office, school and home use."
    },
    {
      label: "Description",
      body: "A practical laptop holder for everyday desk use. Easy to fold, easy to carry and simple to set up."
    },
    {
      label: "Specification notes",
      body: "Add size, weight, color, compatible laptop range and package contents."
    }
  ],
  Allegro: [
    {
      label: "Product title",
      body: "Regulowana skladana podstawka pod laptopa aluminiowa do biurka"
    },
    {
      label: "Selling points",
      body: "Lekka konstrukcja, skladany format, stabilne ustawienie, kilka poziomow wysokosci, do domu i biura."
    },
    {
      label: "Product description",
      body: "Praktyczna podstawka pod laptopa do codziennej pracy przy biurku. Pomaga uporzadkowac stanowisko pracy i latwo sie sklada."
    },
    {
      label: "Specification block",
      body: "Material, kolor, rozmiar, kompatybilnosc, zawartosc zestawu, waga i informacje o dostawie."
    }
  ],
  Cdiscount: [
    {
      label: "Product title",
      body: "Support ordinateur portable pliable en aluminium, reglable pour bureau"
    },
    {
      label: "Feature bullets",
      body: "Structure aluminium; design pliable; hauteur reglable; rangement facile; compatible avec plusieurs tailles d'ordinateur."
    },
    {
      label: "Product description",
      body:
        "Un support pratique pour organiser un espace de travail plus confortable a la maison, au bureau ou en deplacement."
    },
    {
      label: "Specification block",
      body: "Dimensions, poids, couleur, materiau, compatibilite, contenu du colis et conditions de livraison."
    }
  ],
  Other: [
    {
      label: "Modular title",
      body: "Foldable Aluminum Laptop Stand for Desk, Office and Travel"
    },
    {
      label: "Core benefits",
      body: "Adjustable, foldable, lightweight, stable and easy to carry."
    },
    {
      label: "Reusable description",
      body: "A practical laptop stand designed to improve desk organization and daily working comfort."
    },
    {
      label: "Adaptation notes",
      body: "Choose a target platform before final SEO, keyword density and compliance wording."
    }
  ]
};

const strategyByPositioning: Record<string, Record<string, string>> = {
  "Practical value": {
    English: "Lead with daily usefulness, simple setup, compatibility and clear buyer benefits.",
    German: "Alltagsnutzen, einfache Anwendung, Kompatibilitaet und klare Vorteile in den Vordergrund stellen.",
    Chinese: "突出日常实用性、易用性、适配范围和明确购买理由。"
  },
  "Premium quality": {
    English: "Emphasize material quality, finish, durability and a more refined brand tone.",
    German: "Materialqualitaet, Verarbeitung, Langlebigkeit und einen hochwertigeren Markenton betonen.",
    Chinese: "强调材质、做工、耐用性和更高端的品牌语气。"
  },
  "Price-performance": {
    English: "Focus on value, included features, practical durability and why the offer is worth the price.",
    German: "Preis-Leistung, enthaltene Funktionen, praktische Haltbarkeit und Angebotswert hervorheben.",
    Chinese: "突出性价比、功能完整度、实用耐用性和价格理由。"
  },
  "Giftable product": {
    English: "Frame the product as useful, easy to understand and suitable for gifting occasions.",
    German: "Das Produkt als nuetzlich, leicht verstaendlich und gut als Geschenk geeignet positionieren.",
    Chinese: "将产品定位为好理解、实用、适合送礼的商品。"
  },
  "Professional / B2B": {
    English: "Use a precise, reliability-focused tone with specifications, use cases and procurement confidence.",
    German: "Praezise, verlaesslichkeitsorientierte Sprache mit Spezifikationen, Einsatzfaellen und Einkaufssicherheit verwenden.",
    Chinese: "使用更专业、可靠导向的语气，强调规格、应用场景和采购确定性。"
  }
};

function localizedOutput(marketplace: string, language: string, positioning: string) {
  const strategy = strategyByPositioning[positioning] ?? strategyByPositioning["Practical value"];

  if (language === "German") {
    return [
      { label: "Listing strategy", body: strategy.German },
      {
        label: "SEO title",
        body: `${marketplace}: Verstellbarer Laptopstaender aus Aluminium, faltbar, ergonomischer Notebook Halter fuer Schreibtisch`
      },
      {
        label: "Bullet points",
        body:
          "Stabile Aluminiumkonstruktion; faltbares Design; mehrere Hoehenstufen; platzsparend; geeignet fuer Homeoffice, Buero und Reisen."
      },
      {
        label: "Product description",
        body:
          "Dieser Laptopstaender hilft, den Arbeitsplatz sauberer und praktischer zu organisieren. Die faltbare Konstruktion ist leicht zu transportieren und fuer viele gaengige Notebookgroessen geeignet."
      },
      { label: "Keywords and FAQ", body: "laptop staender, notebook halter, ergonomisch, faltbar; FAQ zu Kompatibilitaet, Groesse, Material und Lieferumfang." }
    ];
  }

  if (language === "Chinese") {
    return [
      { label: "Listing strategy", body: strategy.Chinese },
      {
        label: "SEO title",
        body: `${marketplace}：可折叠铝合金笔记本支架，适合办公桌、居家办公和旅行使用`
      },
      {
        label: "Bullet points",
        body:
          "铝合金结构稳定；可折叠收纳；多档高度调节；节省桌面空间；适合办公室、学习桌和差旅场景。"
      },
      {
        label: "Product description",
        body:
          "这款笔记本支架适合需要整理桌面、改善屏幕角度和提高日常办公便利性的用户。轻便可折叠，适合多种常见笔记本尺寸。"
      },
      { label: "Keywords and FAQ", body: "笔记本支架、电脑支架、铝合金支架、办公桌配件；FAQ 包括适配尺寸、材质、包装内容和使用场景。" }
    ];
  }
  return [
    { label: "Listing strategy", body: strategy.English },
    {
      label: "SEO title",
      body: `${marketplace}: Foldable Aluminum Laptop Stand, Adjustable Ergonomic Notebook Riser for Desk and Travel`
    },
    {
      label: "Bullet points",
      body:
        "Stable aluminum build; foldable design; adjustable viewing angles; space-saving setup; suitable for home office, daily desk use and travel."
    },
    {
      label: "Product description",
      body:
        "This foldable laptop stand is designed for users who want a cleaner and more practical desk setup. It is lightweight, easy to carry and compatible with many common laptop sizes."
    },
    { label: "Keywords and FAQ", body: "laptop stand, notebook riser, aluminum holder, foldable desk accessory; FAQ should cover compatibility, size, material and package contents." }
  ];
}

export function ListingWorkspace({
  selectedMarketplace = "Amazon Germany",
  selectedLanguage = "Marketplace default",
  selectedPositioning = "Practical value"
}: {
  selectedMarketplace?: string;
  selectedLanguage?: string;
  selectedPositioning?: string;
}) {
  const router = useRouter();
  const marketplace = marketplaces.includes(selectedMarketplace) ? selectedMarketplace : "Amazon Germany";
  const language = listingLanguages.includes(selectedLanguage) ? selectedLanguage : "Marketplace default";
  const positioning = positioningOptions.includes(selectedPositioning) ? selectedPositioning : "Practical value";
  const listingDiagnosis = diagnosisByMarketplace[marketplace];
  const platformOutput = outputByMarketplace[marketplace];
  const outputSections =
    language === "Marketplace default" || language === "Other"
      ? [
          { label: "Listing strategy", body: strategyByPositioning[positioning].English },
          ...platformOutput
        ]
      : localizedOutput(marketplace, language, positioning);

  const pushListingUrl = (next: { marketplace?: string; language?: string; positioning?: string }) => {
    const params = new URLSearchParams({
      marketplace: next.marketplace ?? marketplace,
      language: next.language ?? language,
      positioning: next.positioning ?? positioning
    });
    router.push(`/employees/listing?${params.toString()}`);
  };

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-navy text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-navy">Listing Scope</h2>
              <p className="text-sm text-steel">Marketplace copy this employee prepares.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {listingChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-md bg-mist p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-bold leading-5 text-graphite">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Listing Settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Target marketplace</span>
              <select
                form="listing-task-form"
                name="marketplaceSelector"
                className="field"
                value={marketplace}
                onChange={(event) => {
                  pushListingUrl({ marketplace: event.currentTarget.value });
                }}
              >
                {marketplaces.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Listing language</span>
              <select
                form="listing-task-form"
                name="languageSelector"
                className="field"
                value={language}
                onChange={(event) => {
                  pushListingUrl({ language: event.currentTarget.value });
                }}
              >
                {listingLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label">Positioning</span>
              <select
                form="listing-task-form"
                name="positioningSelector"
                className="field"
                value={positioning}
                onChange={(event) => {
                  pushListingUrl({ positioning: event.currentTarget.value });
                }}
              >
                {positioningOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </aside>

      <EmployeeTaskForm id="listing-task-form" employeeId="listing" className="rounded-lg border border-line bg-white shadow-panel">
        <input type="hidden" name="marketplace" value={marketplace} />
        <input type="hidden" name="language" value={language} />
        <input type="hidden" name="positioning" value={positioning} />
        <div className="border-b border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-navy">Product Listing Brief</h2>
              <p className="text-sm text-steel">Enter product facts and generate marketplace-ready listing copy.</p>
            </div>
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
              Business employee
            </span>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="label">Product name</span>
            <input name="productName" className="field" placeholder="Example: Foldable aluminum laptop stand" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Target country</span>
              <select name="targetCountry" className="field">
                <option>Germany</option>
                <option>Austria</option>
                <option>Switzerland</option>
                <option>European Union</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label">Product category</span>
            <select name="productCategory" className="field">
              <option>Electronics accessories</option>
              <option>Phone and tablet accessories</option>
              <option>Computer and office accessories</option>
              <option>Smart home devices</option>
              <option>LED lighting</option>
              <option>Small home appliances</option>
              <option>Home and kitchen</option>
              <option>Kitchen tools and gadgets</option>
              <option>Home organization</option>
              <option>Cleaning supplies</option>
              <option>Bathroom accessories</option>
              <option>Garden and balcony products</option>
              <option>Beauty and personal care</option>
              <option>Hair tools</option>
              <option>Nail and makeup accessories</option>
              <option>Health and wellness accessories</option>
              <option>Pet products</option>
              <option>Pet toys</option>
              <option>Pet grooming</option>
              <option>Pet travel accessories</option>
              <option>Sports and outdoor</option>
              <option>Fitness accessories</option>
              <option>Camping and travel gear</option>
              <option>Bicycle accessories</option>
              <option>Tools and hardware</option>
              <option>DIY accessories</option>
              <option>Automotive accessories</option>
              <option>Motorcycle accessories</option>
              <option>Furniture and home living</option>
              <option>Decor and lighting</option>
              <option>Storage and shelving</option>
              <option>Fashion accessories</option>
              <option>Jewelry and watches</option>
              <option>Bags and luggage</option>
              <option>Shoes accessories</option>
              <option>Baby products</option>
              <option>Toys and games</option>
              <option>Party and gift supplies</option>
              <option>Stationery and school supplies</option>
              <option>Packaging and shipping supplies</option>
              <option>Seasonal products</option>
              <option>Other</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="label">Product features and specifications</span>
            <textarea
              name="productFeatures"
              className="field min-h-36 resize-y"
              placeholder="Add material, size, compatibility, package contents, colors, certifications, warranty and usage scenarios."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Target buyer</span>
              <input name="targetBuyer" className="field" placeholder="Example: home office users, Amazon bargain buyers, professional installers" />
            </label>
            <label className="grid gap-2">
              <span className="label">Main selling angle</span>
              <input name="mainSellingAngle" className="field" placeholder="Example: compact travel use, premium material, best value bundle" />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="label">Claims to avoid</span>
            <input name="claimsToAvoid" className="field" placeholder="Example: medical benefit, certified unless proven, waterproof, lifetime warranty" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="label">Main keywords</span>
              <textarea name="mainKeywords" className="field min-h-24 resize-y" placeholder="Example: laptop stand, notebook holder, ergonomic riser" />
            </label>
            <label className="grid gap-2">
              <span className="label">Reference product link</span>
              <textarea name="referenceProductLink" className="field min-h-24 resize-y" placeholder="Paste competitor or benchmark product URL" />
            </label>
          </div>

          <div className="rounded-lg border border-line bg-mist p-4">
            <div className="flex items-center gap-2 text-sm font-black text-navy">
              <ClipboardCheck className="h-4 w-4" />
              Include in listing
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {["SEO title", "Bullet points", "Product description", "Backend keywords", "FAQ", "Localization notes"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm font-bold text-graphite">
                  <input name="includeItems" value={item} type="checkbox" className="h-4 w-4 accent-blue" defaultChecked />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-line p-5">
          <FormSubmitButton idleLabel="Generate Listing" pendingLabel="E-commerce Listing Employee is working..." />
        </div>
      </EmployeeTaskForm>

      {false && (
      <aside className="space-y-4">
        <section className="min-h-[300px] rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-navy">Listing Diagnosis</h3>
          <p className="mt-1 text-sm text-steel">Brief SEO and marketplace guide.</p>
          <div className="mt-4 grid gap-2">
            {listingDiagnosis.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-md border border-line p-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-mist text-xs font-black text-navy">{index + 1}</span>
                <p className="text-sm font-bold leading-5 text-graphite">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-[760px] rounded-lg border border-line border-t-4 border-t-accent bg-white shadow-panel">
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-navy">Output Preview</h3>
              <p className="text-sm text-steel">Marketplace-ready listing package with copy, keywords, specs and FAQ.</p>
              </div>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-3 p-4">
            {outputSections.map((section) => (
              <div key={section.label} className="rounded-md bg-mist p-3">
                <div className="flex items-center gap-2 text-sm font-black text-navy">
                  {section.label.includes("keyword") ? <Search className="h-4 w-4" /> : section.label.includes("Bullet") || section.label.includes("Feature") || section.label.includes("Selling") ? <ListChecks className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {section.label}
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end border-t border-line p-4">
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-navy px-4 text-sm font-black text-white">
                <Languages className="h-4 w-4" />
                Use and Copy
              </button>
              <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md bg-blue px-4 text-sm font-black text-white">
                <Download className="h-4 w-4" />
                Download Word Version
              </button>
            </div>
          </div>
        </section>
      </aside>
      )}
    </div>
  );
}
