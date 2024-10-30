import Image from "next/image";
import hero from "@/public/hero.jpg";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col md:flex-row h-screen items-center justify-between px-4 md:px-10 py-16">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Doctor's Appointment Easily
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Find the right doctor for you and book an appointment in just a few
            clicks.
          </p>
          <Link href={"/auth/sign-up"}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl">
              Sign Up Now
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <Image
            priority
            src={hero}
            alt="Doctor Appointment"
            width={500}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
