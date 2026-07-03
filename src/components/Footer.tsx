import Image from "next/image";

const footerLinks = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#what-we-do" },
    { label: "Contact", href: "#contact" },
  ],
  "The Campaign": [
    { label: "Guidelines", href: "#guidelines" },
    { label: "Participating Schools", href: "#schools" },
    { label: "Submit a Report", href: "/report" },
    { label: "#LEADforEarth", href: "#home" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0d3d1a" }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl p-1.5">
                <Image
                  src="/logos/logo-icon.png"
                  alt="LEADForEarth Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold">LEADForEarth</span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-6">
              A monthly, district-wide environmental campaign uniting Lasallian
              schools across East Asia under one shared hashtag: #LEADforEarth.
            </p>
            <a
              href="mailto:LeadForEarth@gmail.com"
              className="text-sm font-medium text-green-300 hover:text-white transition-colors duration-200"
            >
              ✉ LeadForEarth@gmail.com
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-bold text-sm uppercase tracking-widest text-green-400 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-green-300 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-green-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-green-500 text-sm">
            &copy; {new Date().getFullYear()} LEADForEarth. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Image
              src="/logos/La-Star-Salle_White.png"
              alt="Lasallian East Asia District"
              width={110}
              height={40}
              className="object-contain opacity-90"
            />
            <Image
              src="/logos/LEAD%20%40%2015.png"
              alt="LEAD @ 15"
              width={52}
              height={52}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
