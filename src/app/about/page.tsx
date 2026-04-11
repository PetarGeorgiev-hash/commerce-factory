import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//TODO replace brand with actual brand name and add more styling and actual content about the brand
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            About Our BRAND
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to our BRAND, where innovation meets quality. We are
            passionate about delivering exceptional products and experiences
            that enrich the lives of our customers.
          </p>
          <p>
            Founded with a vision to redefine excellence in our industry, our
            BRAND has grown through a commitment to craftsmanship,
            sustainability, and customer satisfaction. Every item we create is
            designed with care, using the finest materials and the latest
            techniques.
          </p>
          <p>
            Our mission is to provide timeless value, fostering a community of
            loyal users who trust our BRAND for reliability and style. Whether
            you&apos;re exploring our latest offerings or learning more about
            our story, we&apos;re here to connect with you.
          </p>
          <p>
            Thank you for choosing our BRAND. We look forward to serving you and
            building a brighter future together.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
