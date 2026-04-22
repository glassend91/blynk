"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

type Testimonial = {
  id: string;
  name: string;
  location: string;
  plan?: string;
  rating: number;
  avatarUrl?: string;
  quote: string;
  published: boolean;
};

export default function WhatOurCustomersSay() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get<{
          success: boolean;
          data: Testimonial[];
        }>("/testimonials?published=true");
        if (data?.success && data.data) {
          setTestimonials(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Automatic carousel effect
  useEffect(() => {
    if (testimonials.length <= 3) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (testimonials.length - 2));
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-[#401B60]/10">
        <p className="text-[#6F6C90]">Loading testimonials...</p>
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-cover bg-center bg-[#401B60]/10 overflow-hidden">
      <div className="mx-auto max-w-[1434px] px-4 md:px-32 py-12 md:py-[150px]">
        <div className="flex flex-col items-center gap-8 md:gap-12 md:flex-row md:items-center md:justify-center md:gap-[266px]">
          <div className="w-full max-w-[609px]">
            <h2 className="text-black font-bold text-[28px] leading-[40px] md:text-[36px] md:leading-[72px]">
              What Our Customers Say
            </h2>
            <p className="mt-2 text-[#6F6C90] text-[14px] leading-[22px] md:text-[18px] md:leading-[27px]">
              Real stories from real customers who&apos;ve experienced the Blynk
              difference
            </p>
          </div>

          <div className="w-full max-w-[559px] flex flex-col items-center gap-1">
            <Stars
              width={263}
              height={52}
              fill="currentColor"
              className="text-[#F9C01D]"
            />
            <div className="text-black text-[16px] leading-[28px] md:text-[20px] md:leading-[46px] font-bold text-center">
              4.8 average rating from 1,000+ customers
            </div>
          </div>
        </div>

        <div className="mt-[50px] relative overflow-hidden">
          <div 
            className="flex gap-[30px] transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${activeIndex * (100 / 3 + 1)}%)` 
            }}
          >
            {testimonials.map((t, idx) => (
              <div key={t.id} className="w-full md:w-[calc(33.333%-20px)] flex-shrink-0">
                <TestimonialCard
                  variant={idx % 2 === 0 ? "light" : "primary"}
                  quote={t.quote}
                  name={t.name}
                  location={t.location}
                  tag={t.plan || "Customer"}
                  avatar={t.avatarUrl || "https://api.builder.io/api/v1/image/assets/TEMP/0b2ead6403749147a735cc279d7d7cfad4e3f7a4?width=88"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------- Subcomponents ------- */

function TestimonialCard(props: {
  variant: "light" | "primary";
  quote: string;
  name: string;
  location: string;
  tag: string;
  avatar: string;
}) {
  const primary = props.variant === "primary";
  return (
    <div
      className={[
        "flex w-full max-w-[458px] h-auto md:h-[284px] flex-col justify-center items-start rounded-[24px] border px-5 py-6 md:px-[30px] md:py-[44px]",
        primary
          ? "bg-[#401B60] border-[#401B60]"
          : "bg-white border-[rgba(64,27,96,0.05)]",
      ].join(" ")}
    >
      <div className="md:hidden">
        <Stars width={120} height={24} fill={primary ? "#F9C01D" : "#F9C01D"} />
      </div>
      <div className="hidden md:block">
        <Stars width={158} height={31} fill={primary ? "#F9C01D" : "#F9C01D"} />
      </div>
      <p
        className={[
          "mt-4 text-[14px] leading-[22px] md:text-[16px] md:leading-[24px]",
          primary ? "text-white" : "text-[#6F6C90]",
        ].join(" ")}
      >
        {props.quote}
      </p>

      <div className="mt-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Image
            src={props.avatar}
            alt={props.name}
            width={44}
            height={44}
            className="h-[44px] w-[44px] rounded-full object-cover"
          />
          <div>
            <div
              className={[
                "text-[15px] leading-[22px] md:text-[16px] md:leading-[24px] font-bold",
                primary ? "text-white" : "text-black",
              ].join(" ")}
            >
              {props.name}
            </div>
            <div
              className={[
                "text-[13px] leading-[20px] md:text-[14px] md:leading-[21px]",
                primary ? "text-white" : "text-black",
              ].join(" ")}
            >
              {props.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "inline-block h-2 w-2 rounded-full",
              primary ? "bg-white" : "bg-[#401B60]",
            ].join(" ")}
          />
          <span
            className={[
              "text-[12px] leading-[18px] md:text-[14px] md:leading-[21px] font-bold",
              primary ? "text-white" : "text-[#401B60]",
            ].join(" ")}
          >
            {props.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

function Stars({
  width,
  height,
  className,
  fill = "#F9C01D",
}: {
  width: number;
  height: number;
  fill?: string;
  className?: string;
}) {
  // Compact five-star SVG used in both header and cards
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 263 52"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {[0, 53, 106, 159, 212].map((x) => (
        <path
          key={x}
          transform={`translate(${x} 0)`}
          d="M22.6468 8.9562C23.5449 6.19227 27.4551 6.19227 28.3532 8.9562L30.5516 15.7222C30.9532 16.9582 32.1051 17.7951 33.4047 17.7951H40.5189C43.4251 17.7951 44.6334 21.514 42.2822 23.2222L36.5268 27.4038C35.4753 28.1677 35.0353 29.5218 35.437 30.7579L37.6354 37.5238C38.5334 40.2878 35.37 42.5861 33.0188 40.8779L27.2634 36.6963C26.2119 35.9324 24.7881 35.9324 23.7366 36.6963L17.9812 40.8779C15.63 42.5861 12.4666 40.2878 13.3646 37.5238L15.563 30.7579C15.9647 29.5218 15.5247 28.1677 14.4732 27.4038L8.71775 23.2222C6.36661 21.514 7.57494 17.7951 10.4811 17.7951H17.5953C18.8949 17.7951 20.0468 16.9582 20.4484 15.7222L22.6468 8.9562Z"
          fill={fill}
        />
      ))}
    </svg>
  );
}
