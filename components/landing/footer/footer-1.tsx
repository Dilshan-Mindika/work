"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { footerData } from "@/lib/config/settings";
import { FooterLink } from "@/components/landing/footer-link";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/lib/config/locales";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer1() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("GuestFooter");

  const handleLocaleChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <motion.footer
      className="border-t mt-[24px] md:mt-[55px] py-[55px] md:py-[110px]"
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="mx-auto lg:px-10 md:px-5 2xl:px-0 max-w-screen-xl flex md:flex-row flex-col md:space-y-0 space-y-[38px] items-center md:items-start justify-between">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <motion.div
            role="button"
            whileInView={{ scale: 1 }}
            initial={{ scale: 0.9 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link href="/">
              <Logo className="w-[100px] h-[35px]" />
            </Link>
          </motion.div>
          <p className="mt-5 max-w-[320px] font-medium text-sm">
            {t("Description")} Copyright © {new Date().getFullYear()} - All
            rights reserved
          </p>

          <Button size="sm" variant="secondary" className="mt-2 group">
            Build with{" "}
            <div className=" relative w-4 h-4 ml-2 group-hover:scale-[1.02] group-hover:-rotate-6 duration-300">
              <Image src="/icon.png" alt="" fill />
            </div>{" "}
            Founderflow
          </Button>
        </div>

        {FooterContent.map((data, idx) => (
          <motion.div
            key={idx}
            className="text-center md:text-left"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
          >
            <p className="text-[14px] leading-[14px] uppercase opacity-80">
              {t(`${data.title}.Title`)}
            </p>
            <nav className="mt-5 flex flex-col md:items-start items-center space-y-2">
              {data.links.map((item, linkIdx) => (
                <FooterLink {...item} parentTitle={data.title} key={linkIdx} />
              ))}
            </nav>
          </motion.div>
        ))}
      </div>
      <div className="mx-auto lg:px-10 md:px-5 2xl:px-0 max-w-screen-xl mt-[55px] md:mt-[120px] flex md:flex-row justify-between space-y-3 md:space-y-0 flex-col md:text-left items-center">
        <p className="text-xs opacity-80">{t("BottomText")}</p>
        <Select onValueChange={handleLocaleChange} defaultValue={locale}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Locale" />
          </SelectTrigger>
          <SelectContent>
            {locales.dropdown.map((data, idx) => (
              <SelectItem key={idx} value={data.value}>
                {data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.footer>
  );
}

const FooterContent = [
  {
    title: "Links",
    links: footerData.Links,
  },
  {
    title: "Legal",
    links: [
      {
        label: "Terms of Services",
        href: "/terms",
        external: true,
      },
      {
        label: "Privacy Policy",
        href: "/policy",
        external: true,
      },
    ],
  },
  {
    title: "More",
    links: footerData.More,
  },
];
