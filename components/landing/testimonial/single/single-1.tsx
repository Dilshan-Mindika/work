import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ReactNode } from "react";

type TestimonialSingle1Types = {
  rating: number;
  children: ReactNode;
  avatar?: string;
  name: string;
  title?: string;
};

export default function TestimonialSingle1({
  children,
  rating,
  avatar,
  name,
  title,
}: TestimonialSingle1Types) {
  return (
    <section className="mx-auto max-w-screen-xl my-20 px-5">
      <div className="w-full max-w-[550px] flex flex-col items-center text-center">
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i <= rating ? "fill-primary" : "fill-muted"
              }`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div>
          <p className="text-sm first-letter:text-2xl text-muted-foreground">
            {children}
          </p>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={avatar || "https://avatar.iran.liara.run/public"}
            />
          </Avatar>
          <div className=" text-left">
            <p className="font-medium leading-[14px]">{name}</p>
            <span className="text-xs">{title}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
