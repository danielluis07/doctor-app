import { getPatient } from "@/queries/patients/get-patient";
import Image from "next/image";
import placeholder from "@/public/placeholder-logo.jpg";
import { auth } from "@/auth";
import {
  Bike,
  Calendar,
  ClipboardList,
  Mail,
  MapPin,
  NotebookText,
  Phone,
  Pill,
  Syringe,
  TriangleAlert,
  User,
} from "lucide-react";

const PatientPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getPatient(id);

  if (!data) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 p-6 flex items-center justify-center bg-gray-200">
              <div className="relative w-48 h-48 rounded-full overflow-hidden">
                <Image
                  src={data?.user.image || placeholder}
                  alt="patient"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {data?.user.name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start mb-4">
                  <Mail className="text-blue-600 mr-3 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-base">{data?.user.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <Phone className="text-blue-600 mr-3 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-base">{data?.user.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <MapPin className="text-blue-600 mr-3 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-base">
                      {`${data?.user.address}, ${data?.user.address2 || ""}` ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <MapPin className="text-blue-600 mr-3 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      City/State/Zip
                    </p>
                    <p className="text-base">
                      {`${data?.user.city}, ${data?.user.state} ${data?.user.postalCode}` ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <User className="text-blue-600 mr-3 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-base">
                      {data?.patient?.gender || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <Calendar className="text-blue-600 mr-3 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </p>
                    <p className="text-base">
                      {data?.patient?.dateOfBirth || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-8 py-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Medical Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start mb-4">
                <Pill className="text-blue-600 mr-3 mt-1 shrink-0" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Medicine</p>
                  <p className="text-base">
                    {data?.patient?.medicine || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <TriangleAlert
                  className="text-blue-600 mr-3 mt-1 shrink-0"
                  size={24}
                />
                <div>
                  <p className="text-sm font-medium text-gray-600">Allergies</p>
                  <p className="text-base">
                    {data?.patient?.alergies || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <NotebookText
                  className="text-blue-600 mr-3 mt-1 shrink-0"
                  size={24}
                />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Family History
                  </p>
                  <p className="text-base">
                    {data?.patient?.familyHistory || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <Syringe
                  className="text-blue-600 mr-3 mt-1 shrink-0"
                  size={24}
                />
                <div>
                  <p className="text-sm font-medium text-gray-600">Vaccine</p>
                  <p className="text-base">{data?.patient?.vaccine || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <Bike className="text-blue-600 mr-3 mt-1 shrink-0" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lifestyle</p>
                  <p className="text-base">
                    {data?.patient?.lifeStyle || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <ClipboardList
                  className="text-blue-600 mr-3 mt-1 shrink-0"
                  size={24}
                />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Medical History
                  </p>
                  <p className="text-base">
                    {data?.patient?.medicalHistory || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
