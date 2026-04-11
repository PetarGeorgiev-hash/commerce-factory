import ContactForm from "@/components/ContactPage/ContactForm";
import SocialMediaFooter from "@/components/LandingPage/SocialMediaFooter";

export default function ContactPage() {
  //TODO replace with actual number
  const phoneNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          We&apos;d love to hear from you. Get in touch with us today!
        </p>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Email Form */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Call us</h2>
              <p className="text-muted-foreground text-lg">
                Phone:{" "}
                <a
                  href={`tel:+1${phoneNumber}`}
                  className="text-primary hover:underline"
                >
                  +1 ({phoneNumber.toString().slice(0, 3)}){" "}
                  {phoneNumber.toString().slice(3, 6)}-
                  {phoneNumber.toString().slice(6)}
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-6 text-2xl font-semibold">Follow us</h2>
              <p className="text-muted-foreground mb-4">
                Connect with us on social media for updates and news
              </p>
              <div className="flex gap-6">
                {/* Social icons inline - you can reuse from SocialMediaFooter */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SocialMediaFooter />
    </main>
  );
}
