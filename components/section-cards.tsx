"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import {
  fetchUserCount,
  fetchCustomerCount,
  fetchBarangCount,
  fetchOrderCount,
} from "@/lib/api"; // ⬅️ Import fungsi API dari lib

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalCustomer, setTotalCustomer] = useState<number | null>(null);
  const [totalBarang, setTotalBarang] = useState<number | null>(null);
  const [totalOrder, setTotalOrder] = useState<number | null>(null);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingBarang, setLoadingBarang] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    async function getData() {
      const count = await fetchUserCount();
      setTotalUsers(count);
      setLoadingUsers(false);
    }

    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      const count = await fetchCustomerCount();
      setTotalCustomer(count);
      setLoadingCustomer(false);
    }

    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      const count = await fetchBarangCount();
      setTotalBarang(count);
      setLoadingBarang(false);
    }

    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      const count = await fetchOrderCount();
      setTotalOrder(count);
      setLoadingOrder(false);
    }

    getData();
  }, []);

  const cardsData = [
    {
      href: "dashboard-full/user",
      description: "Total Pengguna",
      title: loadingUsers
        ? "Loading..."
        : totalUsers !== null
        ? totalUsers.toString()
        : "Error",
      badge: {
        variant: "green",
        icon: <IconTrendingUp size={16} aria-hidden="true" />,
        text: "+12.5%",
        className: "bg-green-500 text-white",
      },
      footerMain: (
        <>
          Trending up this month <IconTrendingUp size={16} aria-hidden="true" />
        </>
      ),
      footerSub: "Visitors for the last 6 months",
    },
    {
      href: "dashboard-full/customer",
      description: "Customer Baru",
      title: loadingCustomer
        ? "Loading..."
        : totalCustomer !== null
        ? totalCustomer.toString()
        : "Error",
      badge: {
        variant: "destructive",
        icon: <IconTrendingDown size={16} aria-hidden="true" />,
        text: "-20%",
        className: "",
      },
      footerMain: (
        <>
          Down 20% this period <IconTrendingDown size={16} aria-hidden="true" />
        </>
      ),
      footerSub: "Acquisition needs attention",
    },
    {
      href: "dashboard-full/barang",
      description: "Jumlah Barang",
      title: loadingBarang
        ? "Loading..."
        : totalBarang !== null
        ? totalBarang.toString()
        : "Error",
      badge: {
        variant: "green",
        icon: <IconTrendingUp size={16} aria-hidden="true" />,
        text: "+12.5%",
        className: "bg-green-500 text-white",
      },
      footerMain: (
        <>
          Strong user retention <IconTrendingUp size={16} aria-hidden="true" />
        </>
      ),
      footerSub: "Engagement exceed targets",
    },
    {
      href: "dashboard-full/order",
      description: "Pemesanan",
      title: loadingOrder
        ? "Loading..."
        : totalOrder !== null
        ? totalOrder.toString()
        : "Error",
      badge: {
        variant: "green",
        icon: <IconTrendingUp size={16} aria-hidden="true" />,
        text: "+4.5%",
        className: "bg-green-500 text-white",
      },
      footerMain: (
        <>
          Steady performance increase{" "}
          <IconTrendingUp size={16} aria-hidden="true" />
        </>
      ),
      footerSub: "Meets growth projections",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardsData.map((card, idx) => {
        const CardContent = (
          <Card className="@container/card" key={idx}>
            <CardHeader>
              <CardDescription>{card.description}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.title ?? "—"}
              </CardTitle>
              <CardAction>
                <Badge
                  variant={card.badge.variant}
                  className={card.badge.className}
                  aria-label={`${card.badge.text} trending`}
                >
                  {card.badge.icon}
                  {card.badge.text}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerMain}
              </div>
              <div className="text-muted-foreground">{card.footerSub}</div>
            </CardFooter>
          </Card>
        );

        if (card.href) {
          return (
            <Link
              key={idx}
              href={card.href}
              aria-label={`Navigate to ${card.description}`}
            >
              {CardContent}
            </Link>
          );
        }
        return CardContent;
      })}
    </div>
  );
}
