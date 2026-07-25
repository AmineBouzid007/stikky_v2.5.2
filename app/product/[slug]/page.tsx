import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { ProductDetail } from "@/components/shop/product-detail";
import { getAllProducts as getAllStaticProducts } from "@/lib/products";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";

// Prebuild routes from the local catalog for fast static generation; any
// product added later straight to the database still resolves on demand.
export function generateStaticParams() {
  return getAllStaticProducts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image_url],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <ProductDetail product={product} related={related} />
      <FooterSection />
    </main>
  );
}
