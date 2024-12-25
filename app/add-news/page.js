"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/languagecontext";

const Page = () => {
  const router = useRouter();
  const { translations } = useLanguage();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [headlineEn, setHeadlineEn] = useState("");
  const [headlineTe, setHeadlineTe] = useState("");
  const [newsEn, setNewsEn] = useState("");
  const [newsTe, setNewsTe] = useState("");
  const [category, setCategory] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const categories = [
    translations.selectcategory,
    translations.home,
    translations.hyderabad,
    translations.politics,
    translations.telangana,
    translations.india,
    translations.world,
    translations.business,
    translations.health,
    translations.sports,
    translations.film,
    translations.others,
  ];

  

  const tags = [
    translations.selecttag,
    translations.home,
    translations.hyderabad,
    translations.politics,
    translations.telangana,
    translations.india,
    translations.business,
    translations.health,
    translations.world,
    translations.sports,
    translations.film,
    translations.others,
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && role === "Employee") {
      setIsAuthorized(true);
    } else {
      router.push("/unauthorized");
    }
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("headlineEn", headlineEn);
    formData.append("headlineTe", headlineTe);
    formData.append("newsEn", newsEn);
    formData.append("newsTe", newsTe);
    formData.append("category", category);
    formData.append("employeeId", employeeId);
    formData.append("tag", tag);
    formData.append("image", image);

    try {
      const response = await fetch("https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("News added successfully!");
        // Reset form fields
        setHeadlineEn("");
        setHeadlineTe("");
        setNewsEn("");
        setNewsTe("");
        setCategory("");
        setEmployeeId("");
        setTags("");
        setImage("");
      } else {
        alert("Failed to add news.");
      }
    } catch (error) {
      console.error("Error adding news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  my-10">
      <div className="  p-10  w-[90%] md:w-[80%]">
        <div className="text-center text-[24px] font-bold py-5">
          {translations.addnews} :
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[18px] mb-2">
              {translations.headlineEn} :
            </label>
            <input
              type="text"
              placeholder={translations.headlineEn}
              value={headlineEn}
              className="w-full border  bg-orange-50 border-orange-300 p-2 rounded-md"
              onChange={(e) => setHeadlineEn(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[18px] mb-2">
              {translations.headlineTe} :
            </label>
            <input
              type="text"
              placeholder={translations.headlineTe}
              value={headlineTe}
              className="w-full border bg-orange-50 border-orange-300 p-2 rounded-md"
              onChange={(e) => setHeadlineTe(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[18px] mb-2">
              {translations.newsEn} :
            </label>
            <textarea
              type="text"
              value={newsEn}
              placeholder={translations.newsEn}
              className="w-full border bg-orange-50 border-orange-300 p-2 rounded-md"
              onChange={(e) => setNewsEn(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[18px] mb-2">
              {translations.newsTe} :
            </label>
            <textarea
              type="text"
              value={newsTe}
              placeholder={translations.newsTe}
              className="w-full border bg-orange-50 border-orange-300 p-2 rounded-md"
              onChange={(e) => setNewsTe(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[18px] mb-2">
              {translations.category} :
            </label>
            <select
              className="w-full border bg-orange-50 border-orange-300 p-2 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-[18px] mb-2">
              {translations.employeeid} :
            </label>
            <input
              type="text"
              value={employeeId}
              placeholder={translations.employeeid}
              className="w-full border bg-orange-50 border-orange-300 p-2 rounded-md"
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>


          <div>
            <label className="block text-[18px] mb-2">
              {translations.image} :
            </label>
            <input
              type="file"
              className="w-full  p-2 rounded-md"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? translations.loading : translations.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
