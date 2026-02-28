"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/languagecontext";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";

const Page = () => {
  const router = useRouter();
  const { translations } = useLanguage();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [headlineEn, setHeadlineEn] = useState("");
  const [headlineTe, setHeadlineTe] = useState("");
  const [newsEn, setNewsEn] = useState(EditorState.createEmpty()); // Initialize editor state
  const [newsTe, setNewsTe] = useState(EditorState.createEmpty()); // Initialize editor state
  const [category, setCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const compressImageFile = async (file) => {
    if (!file) return file;

    // Keep already-small images as-is.
    if (file.size <= 900 * 1024) return file;

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / img.width);
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.82;
    let blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

    while (blob && blob.size > 900 * 1024 && quality > 0.45) {
      quality -= 0.08;
      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
    }

    if (!blob) return file;
    return new File([blob], `${Date.now()}-news.jpg`, { type: "image/jpeg" });
  };

  const handleInlineStyleClick = (style) => {
    const newState = RichUtils.toggleInlineStyle(newsEn, style);
    setNewsEn(newState); // Update the English editor state
  };

  const handleTeInlineStyleClick = (style) => {
    const newState = RichUtils.toggleInlineStyle(newsTe, style);
    setNewsTe(newState); // Update the Telugu editor state
  };

  const categories = [
    translations.selectcategory,
    translations.spadex,
    translations.home,
    translations.districts,
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

  const districts = [
    translations.adilabad,
    translations.bhadradri,
    translations.hanumakonda,
    translations.hyderabad,
    translations.jagitial,
    translations.jangoan,
    translations.bupalpally,
    translations.gadwal,
    translations.kamareddy,
    translations.karimnagar,
    translations.khammam,
    translations.bheem,
    translations.mahabubabad,
    translations.mahabubnagar,
    translations.mancherial,
    translations.medak,
    translations.malkajgiri,
    translations.mulugu,
    translations.nagarkurnool,
    translations.nalgonda,
    translations.narayanpet,
    translations.nirmal,
    translations.nizamabad,
    translations.peddapalli,
    translations.sircilla,
    translations.rangareddy,
    translations.sangareddy,
    translations.siddipet,
    translations.suryapet,
    translations.vikarabad,
    translations.wanaparthy,
    translations.warangal,
    translations.yadadri,
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && ["Employee", "Admin", "SuperAdmin"].includes(role)) {
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

    if (category === translations.districts && !selectedDistrict) {
      alert(translations.selectdistrict);
      setIsLoading(false);
      return;
    }

    const compressedImage = await compressImageFile(image);

    const formData = new FormData();
    formData.append("headlineEn", headlineEn);
    formData.append("headlineTe", headlineTe);
    formData.append("newsEn", stateToHTML(newsEn.getCurrentContent())); // Use getPlainText to get the editor content
    formData.append("newsTe", stateToHTML(newsTe.getCurrentContent())); // Send HTML for newsTe
    formData.append(
      "category",
      category === translations.districts ? selectedDistrict : category
    );
    formData.append("employeeId", employeeId);
    formData.append("image", compressedImage);

    try {
      const response = await fetch(
        "/api/newsEn",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("News added successfully!");
        // Reset form fields
        setHeadlineEn("");
        setHeadlineTe("");
        setNewsEn(EditorState.createEmpty());
        setNewsTe(EditorState.createEmpty());
        setCategory("");
        setSelectedDistrict("");
        setEmployeeId("");
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
      <div className="p-10 w-[90%] md:w-[80%]">
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

            {/* Toolbar for RichUtils */}
            <div className="flex mb-2">
              <button
                type="button"
                onClick={() => handleInlineStyleClick("BOLD")}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleInlineStyleClick("ITALIC")}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => handleInlineStyleClick("UNDERLINE")}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                U
              </button>
            </div>
            <div className="w-full border bg-orange-50 p-2 border-orange-300 h-[1000px] rounded-md">

            <Editor
              editorState={newsEn} // Bind the editor state to the component
              onChange={setNewsEn} // Update editor state
              placeholder={translations.newsEn}
             className="w-full border bg-orange-50 border-orange-300 h-[1000px] rounded-md"
            />
            </div>
          </div>

          {/* Editor for Telugu News */}
          <div>
            <label className="block text-[18px] mb-2">
              {translations.newsTe} :
            </label>

            {/* Toolbar for RichUtils */}
            <div className="flex mb-2">
              <button
                type="button"
                onClick={() => handleTeInlineStyleClick("BOLD")}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => handleTeInlineStyleClick("ITALIC")}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => handleTeInlineStyleClick("UNDERLINE")}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                U
              </button>
            </div>

            <div className="w-full border bg-orange-50 p-2 border-orange-300 h-[1000px] rounded-md">

            <Editor
              editorState={newsTe} // Bind the editor state to the component
              onChange={setNewsTe} // Update editor state
              placeholder={translations.newsTe}
             
            
            />
            </div>
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

          {/* Conditional rendering for districts */}
          {category === translations.districts && (
            <div>
              <label className="block text-[18px] mb-2">
                {translations.districts} :
              </label>
              <select
                className="w-full border bg-orange-50 border-orange-300 p-2 rounded-md"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                required
              >
                <option value="">{translations.selectdistrict}</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          )}

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
