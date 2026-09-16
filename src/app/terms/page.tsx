import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SkipLink from "@/components/SkipLink";
import { TERMS_EFFECTIVE_DATE, TERMS_VERSION } from "@/lib/terms";

export const metadata: Metadata = {
  title: "Report Submission Terms | LEADForEarth",
  description:
    "The terms that apply when you submit a #LEADforEarth report, including responsibility for photo consent and accuracy of reported figures.",
};

function Section({
  num,
  title,
  children,
  emphasis,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <section
      className="rounded-3xl p-6 sm:p-8"
      style={{
        backgroundColor: emphasis ? "var(--surface-accent)" : "var(--surface)",
        boxShadow: emphasis ? "none" : "var(--shadow-card)",
      }}
    >
      <h2
        className="text-lg sm:text-xl font-bold tracking-tight mb-4"
        style={{ color: "var(--text-heading)" }}
      >
        <span style={{ color: "var(--brand-mid)" }}>{num}.</span> {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--text-body)" }}>
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="pt-[68px] focus:outline-none"
        style={{ backgroundColor: "var(--surface-page)" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em] mb-3"
              style={{ color: "var(--brand-mid)" }}
            >
              #LEADforEarth
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
              style={{ color: "var(--text-heading)" }}
            >
              Report Submission Terms
            </h1>
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
              Last updated {TERMS_EFFECTIVE_DATE} (version {TERMS_VERSION})
            </p>
          </div>

          <div className="space-y-5">
            <Section num="1" title="Agreement">
              <p>
                By submitting a report through this website, you agree to these terms on behalf of
                yourself and the institution you represent. If you do not agree, do not submit a
                report. You confirm that you are authorised by your institution to file this report
                and to accept these terms for it.
              </p>
            </Section>

            <Section num="2" title="Who may submit">
              <p>
                Report submission is limited to representatives of member institutions of the
                Lasallian East Asia District participating in the LEADForEarth campaign. You must
                sign in with a Google account, which we use to verify that submissions come from a
                real person and to contact you about your report.
              </p>
            </Section>

            <Section num="3" title="Accuracy of what you submit">
              <p>
                You are responsible for the accuracy of everything you enter. Figures, participant
                counts, and environmental measurements are self reported by your institution and are
                not independently verified or audited by the LEADForEarth committee. You confirm
                that the information is accurate and complete to the best of your knowledge at the
                time of submission. The committee may aggregate, summarise, or publish your figures
                as part of district wide reporting, and does so in reliance on your confirmation.
              </p>
            </Section>

            <Section num="4" title="Photographs, documents, and the people in them" emphasis>
              <p className="font-semibold" style={{ color: "var(--brand)" }}>
                This is the most important section, so please read it carefully.
              </p>
              <p>
                By uploading any photograph, document, or other file, you confirm all of the
                following:
              </p>
              <p>(a) Your institution owns the file or has the right to share it.</p>
              <p>
                (b) You have obtained every consent required under the laws of your country from
                each identifiable person appearing in it, including consent for that image to be
                published publicly on this website and on the LEADForEarth campaign&apos;s social
                media.
              </p>
              <p>
                (c) Where any identifiable person is a minor, you have obtained consent from that
                minor&apos;s parent or legal guardian in the form your institution&apos;s own
                safeguarding policy requires, and your institution holds records of that consent.
              </p>
              <p>
                (d) The file contains no confidential student records, no personal contact details
                of third parties, and nothing that would breach your institution&apos;s privacy
                obligations.
              </p>
              <p>
                Your institution remains solely responsible for these consents. LEADForEarth does
                not collect, hold, or verify them, and relies entirely on your confirmation above.
                If a consent turns out not to have been obtained, that is a matter between your
                institution and the person concerned.
              </p>
            </Section>

            <Section num="5" title="Publication">
              <p>
                Submitted reports are reviewed by the committee before publication. We may publish
                your report, in whole or in part, on this website, in district materials, and on
                campaign social media. We may edit reports for length, clarity, or formatting, and
                we may decline to publish or later remove any report or file at our sole discretion
                and without notice or explanation. Publication is not guaranteed by submission.
              </p>
            </Section>

            <Section num="6" title="Personal data">
              <p>
                We collect your name, role, email address, and optionally your phone number,
                together with the content of your report. We use this to process and publish
                reports, to contact you about your submission, and to compile district level
                summaries. Files you upload are stored with Cloudinary, a third party service, and
                served from its network. We do not sell your data.
              </p>
              <p>
                You may ask us to correct or delete your submission by writing to{" "}
                <a
                  href="mailto:LeadForEarth@gmail.com"
                  className="font-medium hover:underline"
                  style={{ color: "var(--brand-mid)" }}
                >
                  LeadForEarth@gmail.com
                </a>
                , and we will act on reasonable requests, though reports already aggregated into
                published district totals may not be individually removable from those totals.
              </p>
            </Section>

            <Section num="7" title="The service is provided as is">
              <p>
                This website is provided on an &quot;as is&quot; and &quot;as available&quot; basis,
                without warranty of any kind, whether express or implied. We do not warrant that the
                site will be uninterrupted, error free, or secure, that submitted data will never be
                lost or corrupted, or that any figure published on the site is accurate. The site is
                operated on a voluntary basis by a student and staff committee, not as a commercial
                service.
              </p>
            </Section>

            <Section num="8" title="Limitation of liability">
              <p>
                To the fullest extent permitted by law, LEADForEarth, the Lasallian East Asia
                District, its member institutions, and the committee&apos;s members, volunteers, and
                organisers shall not be liable for any loss or damage of any kind arising out of or
                connected with your use of this website or your submission of a report. This
                includes, without limitation, indirect, incidental, special, consequential, or
                punitive damages, loss of data, loss of reputation, and loss of profits, whether the
                claim arises in contract, tort, negligence, or otherwise, and whether or not we were
                advised of the possibility of such loss.
              </p>
              <p>
                Where liability cannot lawfully be excluded, our total aggregate liability to you
                for all claims is limited to the greater of the amount you paid to use this service,
                which is nil, or the minimum amount permitted by applicable law.
              </p>
              <p>
                Nothing in these terms excludes or limits liability for death or personal injury
                caused by negligence, for fraud or fraudulent misrepresentation, or for anything
                else that cannot lawfully be excluded.
              </p>
            </Section>

            <Section num="9" title="Your indemnity to us">
              <p>
                You agree to indemnify and hold harmless LEADForEarth, the Lasallian East Asia
                District, and the committee&apos;s members and volunteers against any claim, demand,
                loss, liability, or expense, including reasonable legal fees, arising from content
                you submit, from your breach of these terms, or in particular from any claim by a
                person appearing in a file you uploaded that their image was used without the
                consent required under section 4.
              </p>
            </Section>

            <Section num="10" title="Changes">
              <p>
                We may update these terms at any time. The version shown on this page when you
                submit is the version that applies to that submission, and we keep a record of which
                version you accepted.
              </p>
            </Section>

            <Section num="11" title="Governing law">
              <p>
                These terms are governed by the laws of the Republic of the Philippines, and the
                courts of the Philippines have exclusive jurisdiction over any dispute, without
                regard to conflict of law principles.
              </p>
            </Section>

            <Section num="12" title="Contact">
              <p>
                Questions about these terms:{" "}
                <a
                  href="mailto:LeadForEarth@gmail.com"
                  className="font-medium hover:underline"
                  style={{ color: "var(--brand-mid)" }}
                >
                  LeadForEarth@gmail.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
