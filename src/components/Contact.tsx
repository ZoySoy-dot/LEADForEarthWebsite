export default function Contact() {
  return (
    <section id="contact" style={{ backgroundColor: "#f7faf7" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            Contact Us
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            Let&apos;s Connect
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-lg">
            Whether you want to partner with us, join a program, or simply learn more —
            we&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div className="space-y-8">
            <div
              className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-sm"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: "#e8f5e9" }}
              >
                ✉️
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1" style={{ color: "#1a5c2a" }}>
                  Email Us
                </h4>
                <p className="text-gray-500 text-sm mb-2">
                  Reach out and we&apos;ll get back to you within 2 business days.
                </p>
                <a
                  href="mailto:leadforearth@dlsu.edu.ph"
                  className="font-semibold hover:underline"
                  style={{ color: "#2d8c3e" }}
                >
                  leadforearth@dlsu.edu.ph
                </a>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-sm">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: "#e8f5e9" }}
              >
                📍
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1" style={{ color: "#1a5c2a" }}>
                  Find Us
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  De La Salle University<br />
                  2401 Taft Avenue, Malate<br />
                  Manila, Philippines 1004
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-sm">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: "#e8f5e9" }}
              >
                🌐
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1" style={{ color: "#1a5c2a" }}>
                  Follow Our Journey
                </h4>
                <p className="text-gray-500 text-sm mb-2">
                  Stay updated with our latest programs and initiatives.
                </p>
                <div className="flex gap-4">
                  {["Facebook", "Instagram", "LinkedIn"].map((platform) => (
                    <span
                      key={platform}
                      className="text-sm font-medium cursor-pointer hover:underline"
                      style={{ color: "#2d8c3e" }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: "#1a5c2a" }}>
              Send Us a Message
            </h3>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dela Cruz"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your inquiry..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                style={{ backgroundColor: "#1a5c2a" }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
