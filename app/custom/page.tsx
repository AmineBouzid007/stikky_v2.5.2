"use client";

import { createCustomRequest } from "@/app/actions/custom-requests";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";
import { UploadCloud, Check } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { PageHeader } from "@/components/shop/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ProductType } from "@/lib/types";
import { toast } from "sonner";

export default function CustomPage() {
  const [productType, setProductType] = useState<ProductType>("poster");
  const [size, setSize] = useState("A3");
  const [frame, setFrame] = useState("Solid black frame");

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
  };


  const uploadImage = async () => {
    if (!file) return null;

    const supabase = createClient();

    const extension = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("custom-orders")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("custom-orders")
      .getPublicUrl(filePath);

    return publicUrl;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const imageUrl = await uploadImage();

      await createCustomRequest({
        name,
        phone,
        email,
        product_type: productType,
        size,
        frame_option: frame,
        notes,
        image_url: imageUrl,
        estimated_price: 0,
      });

      setSubmitted(true);

      toast.success(
        "Custom request sent — our design team will contact you within 48h."
      );

    } catch (error: any) {
      console.error(
        "CUSTOM REQUEST FAILED:",
        error
      );

      toast.error(
        error.message || "Failed to send request"
      );

    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />

      <PageHeader
        eyebrow="Custom design"
        title={
          <>
            Send a photo,
            <br />
            <span className="text-muted-foreground">
              we&apos;ll build the proof.
            </span>
          </>
        }
        description="Fully custom posters and stickers, designed around your own reference. You approve the proof before anything goes to print — usually within 2 days."
      />

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        {submitted ? (
          <div className="max-w-xl mx-auto text-center border border-foreground/10 py-20 px-8">
            <div className="w-14 h-14 rounded-full bg-stikky-orange/10 border border-stikky-orange flex items-center justify-center mx-auto mb-6">
              <Check className="w-6 h-6 text-stikky-orange" />
            </div>

            <h2 className="font-display text-3xl mb-4">
              Request received
            </h2>

            <p className="text-muted-foreground mb-8">
              Our design team is on it. Expect a design proof in your inbox within 48 hours — nothing gets printed until you approve it.
            </p>

            <Button asChild variant="outline" className="rounded-full h-12 px-8 border-foreground/20">
              <Link href="/collections">
                Keep browsing
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-12">

            {/* YOUR EXISTING FORM CONTENT STAYS THE SAME */}

            <div className="lg:col-span-2">
              <span className="text-sm font-medium">
                Reference image (optional)
              </span>

              <label
                htmlFor="reference"
                className="mt-3 flex flex-col items-center justify-center gap-3 border border-dashed border-foreground/20 hover:border-stikky-orange transition-colors aspect-square cursor-pointer overflow-hidden"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Reference preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload a photo
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </span>
                  </>
                )}

                <input
                  id="reference"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              {fileName && (
                <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                  {fileName}
                </p>
              )}
            </div>

          </form>
        )}
      </section>

      <FooterSection />
    </main>
  );
}
