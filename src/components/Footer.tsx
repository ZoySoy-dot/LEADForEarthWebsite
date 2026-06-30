import Image from "next/image";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "What We Do", href: "#what-we-do" },
    { label: "Contact", href: "#contact" },
  ],
  Programs: [
    { label: "Environmental Education", href: "#what-we-do" },
    { label: "Eco-Action Projects", href: "#what-we-do" },
    { label: "Leadership Formation", href: "#what-we-do" },
    { label: "EcoCamp", href: "#what-we-do" },
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
                  src="/leadforearth-logo.png"
                  alt="LEADForEarth Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold">LEADForEarth</span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-6">
              A Lasallian youth-led environmental initiative empowering communities
              to lead for a more sustainable and just world.
            </p>
            <a
              href="mailto:leadforearth@dlsu.edu.ph"
              className="text-sm font-medium text-green-300 hover:text-white transition-colors duration-200"
            >
              ✉ leadforearth@dlsu.edu.ph
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
          <p className="text-green-600 text-xs text-center md:text-right">
            A program of the Lasallian East Asia District &nbsp;|&nbsp; De La Salle University, Manila
          </p>
        </div>
      </div>
    </footer>
  );
}
