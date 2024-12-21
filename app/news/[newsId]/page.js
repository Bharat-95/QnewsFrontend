"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../../context/languagecontext";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaShare } from "react-icons/fa";
import { CgFacebook } from "react-icons/cg";
import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import Speak from "@/components/Speak";
import Add from '../../../public/Nandak Add.png'
import { Ramaraja } from "next/font/google";


const ramaraja = Ramaraja({
  subsets: ["latin", "telugu"],
  weight: "400", 
});



const NewsPost = () => {
  const searchParams = useSearchParams();
  const { newsId } = useParams();
  const urlLanguage = searchParams.get("language");
  const { language, setLanguage, translations } = useLanguage();
  const [newsData, setNewsData] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyInput, setReplyInput] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(3.5);
  const [isRated, setIsRated] = useState(false);
  const [relatedNews, setRelatedNews] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const timeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const nowDate = new Date();
    const difference = nowDate - postDate;

    const secondsDifference = Math.floor(difference / 1000);
    const minutesDifference = Math.floor(difference / (1000 * 60));
    const hoursDifference = Math.floor(difference / (1000 * 60 * 60));
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (secondsDifference < 60) {
      return `${secondsDifference} sec ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} min ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hrs ago`;
    } else if (daysDifference < 30) {
      return `${daysDifference} days ago`;
    } else {
      return postDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };
  const handleShareClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSocialShare = (platform) => {
    const url = window.location.href; // URL of the current page
    const title = newsData.headlineEn; // Title of the post
    const text = `${title} - ${url}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "instagram":
        alert(
          "Instagram does not support direct sharing via URL. Please share the link manually."
        );
        break;
      case "copy":
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert("Link copied to clipboard!");
          })
          .catch((error) => {
            alert("Failed to copy the link.");
          });
        break;
      default:
        break;
    }
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (newsId) {
      const userEmail = localStorage.getItem("email");

      axios
        .get(
          `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}`,
          {
            params: { userEmail },
          }
        )
        .then((res) => {
          const {
            likes,
            likedBy = [],
            comments,
            ratings,
            category,
          } = res.data.data;
          setNewsData(res.data.data);
          setLikes(likes);
          setComments(comments || []);

          setHasLiked(Array.isArray(likedBy) && likedBy.includes(userEmail));

          if (ratings) {
            const averageRating = ratings.total / ratings.count;
            setAverageRating(averageRating);
          }

          if (category) {
            axios
              .get(
                `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/related`
              )
              .then((response) => setRelatedNews(response.data.data))
              .catch((error) =>
                console.log("Error fetching related news:", error)
              );
          }
        })
        .catch((error) => console.log("Error fetching news:", error));

      axios
        .get(
          `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/rating`,
          {
            params: { userEmail },
          }
        )
        .then((res) => {
          if (res.data.hasRated) {
            setRating(res.data.userRating);
            setIsRated(true);
            localStorage.setItem("hasRated_" + newsId, "true"); // Save in localStorage
          }
        })
        .catch((error) => console.log("Error fetching user rating:", error));
    }
  }, [newsId]);

  const handleLike = () => {
    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      alert("Please log in to like the post.");
      return;
    }

    const endpoint = hasLiked
      ? `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/unlike`
      : `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/like`;

    axios
      .put(endpoint, { userEmail, newsId })
      .then(() => {
        setLikes((prevLikes) => (hasLiked ? prevLikes - 1 : prevLikes + 1));
        setHasLiked(!hasLiked);
      })
      .catch((error) =>
        console.log(`Error ${hasLiked ? "unliking" : "liking"} post:`, error)
      );
  };

  const handleCommentSubmit = () => {
    const userEmail = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName") || "Anonymous";
    const lastName = localStorage.getItem("lastName") || "";

    if (!userEmail) {
      alert("Please log in to comment.");
      return;
    }

    if (newComment.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }

    axios
      .put(
        `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/comment`,
        {
          userEmail,
          firstName,
          lastName,
          comment: newComment,
        }
      )
      .then((res) => {
        setNewComment("");
        axios
          .get(
            `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/${
              language === "te" ? "newsTe" : "newsEn"
            }/${newsId}`
          )
          .then((response) => {
            const { comments } = response.data.data;
            setComments(comments || []);
          })
          .catch((error) =>
            console.log("Error fetching latest comments:", error)
          );
      })
      .catch((error) => console.log("Error adding comment:", error));
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleReplyToggle = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReply = (commentId) => {
    const replyText = replyInput[commentId];
    const userEmail = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName") || "Anonymous";
    const lastName = localStorage.getItem("lastName") || "";

    if (!userEmail) {
      alert("Please log in to reply.");
      return;
    }

    if (!replyText || replyText.trim() === "") {
      alert("Reply cannot be empty.");
      return;
    }

    axios
      .put(
        `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/reply`,
        {
          commentId,
          userEmail,
          firstName,
          lastName,
          reply: replyText,
        }
      )
      .then((res) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.commentId === commentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), res.data.reply],
                }
              : comment
          )
        );
        setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
        setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
      })
      .catch((error) => console.log("Error replying to comment:", error));
  };

  const handleCommentLike = (commentId) => {
    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      alert("Please log in to like comments.");
      return;
    }

    const commentIndex = comments.findIndex(
      (comment) => comment.commentId === commentId
    );
    const commentLiked = comments[commentIndex].likedBy.includes(userEmail);

    if (commentLiked) {
      axios
        .put(
          `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/comment/unlike`,
          {
            commentId,
            userEmail,
          }
        )
        .then(() => {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment?.commentId === commentId
                ? {
                    ...comment,
                    likes: comment.likes - 1,
                    likedBy: comment.likedBy.filter(
                      (email) => email !== userEmail
                    ),
                  }
                : comment
            )
          );
        })
        .catch((error) => console.log("Error unliking comment:", error));
    } else {
      axios
        .put(
          `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/comment/like`,
          {
            commentId,
            userEmail,
          }
        )
        .then(() => {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.commentId === commentId
                ? {
                    ...comment,
                    likes: comment.likes + 1,
                    likedBy: [...comment.likedBy, userEmail],
                  }
                : comment
            )
          );
        })
        .catch((error) => console.log("Error liking comment:", error));
    }
  };

  const handleRating = (selectedRating) => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      alert("Please log in to rate.");
      return;
    }

    // Check if the user has already rated this news
    if (localStorage.getItem("hasRated_" + newsId)) {
      alert("You have already rated this news.");
      return;
    }

    axios
      .put(
        `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/rate`,
        {
          userEmail,
          newsId,
          rating: selectedRating,
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRating(selectedRating);
          setAverageRating(res.data.averageRating);
          setIsRated(true);
          localStorage.setItem("hasRated_" + newsId, "true"); // Set the hasRated flag
        } else {
          alert(res.data.message || "You have already rated this news.");
        }
      })
      .catch((error) => console.log("Error submitting rating:", error));
  };

  return (
    <div className="lg:mx-10 md:mx-5 mx-4 lg:my-10 flex justify-between">
      <div className="lg:w-[60%] md:space-y-6 lg:space-y-6 space-y-4">
        {newsData ? (
          <>
            <div className="lg:w-[806px] w-[100%] lg:h-[500px] md:h-[400px] h-[300px]">
              <Image
                alt="No Image Found"
                src={newsData.image}
                width={900}
                height={500}
                className="lg:w-[806px] object-cover  w-[100%] rounded-md lg:h-[500px] md:h-[400px] h-[300px]"
              />
            </div>
            <div className={`line-clamp-2 font-semibold ${language === "te" ? `${ramaraja.className} text-[30px]`:`text-[24px] `}`}>
              {language === "te" ? newsData.headlineTe : newsData.headlineEn}
            </div>
            <div className="flex justify-between font-light text-gray-700">
              
              <div className="lg:flex md:flex hidden items-center lg:gap-10 md:gap-5 gap-2 lg:text-sm md:text-sm text-[10px]">
                <div>{formatDate(newsData.createdAt)}</div>
                <div> {timeAgo(newsData.createdAt)}</div>
              </div>
              
              <div className="flex gap-4 px-2">
              <div> <Speak newsText={language === "te"
                    ? newsData.newsTe
                    : newsData.newsEn} 
                    language={language === "te" ? "te-IN" : "en-IN"}/></div>
                <button>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      const starFill = averageRating - index;
                      let fillColor = "gray";
                      if (starFill >= 1) {
                        fillColor = "gold";
                      } else if (starFill > 0 && starFill < 1) {
                        fillColor = "gold";
                      }
                      if (rating > 0 && index < rating) {
                        fillColor = "gold";
                      }
                      const clipPath =
                        starFill > 0 && starFill < 1
                          ? `inset(0 ${Math.max(0, 1 - starFill) * 100}% 0 0)`
                          : "none";

                      return (
                        <FaStar
                          key={index}
                          color={fillColor}
                          className="lg:text-[24px] md:text-[24px] text-[20px]"
                          onClick={
                            rating === 0
                              ? () => handleRating(index + 1)
                              : undefined
                          }
                          style={{
                            clipPath: clipPath,
                          }}
                        />
                      );
                    })}
                  </div>
                </button>
                <div className="flex gap-4 px-2">
                  <div className="relative">
                    {/* Share Icon */}
                    <button
                      onClick={handleShareClick}
                      className="flex items-center space-x-2"
                    >
                      <FaShare className="lg:text-[24px] md:text-[24px] text-[20px]" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-[35px] right-0 bg-orange-50 shadow-lg rounded-md p-4 w-48">
                        <ul className="space-y-2">
                          <li>
                            <button
                              onClick={() => handleSocialShare("facebook")}
                              className="flex items-center space-x-2 w-full text-blue-600"
                            >
                              <span className="flex items-center gap-2">
                                <CgFacebook size={20} />
                                {translations.facebook}
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleSocialShare("twitter")}
                              className="flex items-center space-x-2 w-full text-blue-400"
                            >
                              <span className="flex items-center gap-2">
                                <RiTwitterXLine size={20} />
                                {translations.twitter}
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleSocialShare("linkedin")}
                              className="flex items-center space-x-2 w-full text-blue-700"
                            >
                              <span className="flex items-center gap-2">
                                <FaLinkedin size={20} />
                                {translations.linkedin}
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleSocialShare("email")}
                              className="flex items-center space-x-2 w-full text-orange-800"
                            >
                              <span className="flex items-center gap-2">
                                <MdEmail size={20} />
                                {translations.email}
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleSocialShare("whatsapp")}
                              className="flex items-center space-x-2 w-full text-green-600"
                            >
                              <span className="flex items-center gap-2">
                                <IoLogoWhatsapp size={20} />
                                {translations.whatsapp}
                              </span>
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={() => handleSocialShare("copy")}
                              className="flex items-center space-x-2 w-full text-gray-800"
                            >
                              <span className="flex items-center gap-2">
                                <FaCopy size={20} />
                                {translations.copy}
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="flex items-center space-x-2"
                  onClick={handleLike}
                >
                  <FaHeart
                    className="lg:text-[24px] md:text-[24px] text-[20px]"
                    color={hasLiked ? "red" : "gray"}
                  />
                </button>
                <button onClick={toggleComments}>
                  <LuMessageCircle
                    className="lg:text-[24px] md:text-[24px] text-[20px]"
                    color="gray"
                  />
                </button>
              </div>
            </div>
            {showComments && (
              <div className="h-96 overflow-y-scroll border border-orange-300 rounded-md shadow-md p-4 m-2 bg-orange-100">
                <div className="text-xl mb-3">{comments.length} Comments</div>
                <div className="mb-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="2"
                    className="w-full bg-orange-50 p-2 border border-orange-300"
                  ></textarea>
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 p-2 bg-orange-500 text-white rounded"
                  >
                    {language === "te" ? "ప్రస్తావించు" : "Comment"}
                  </button>
                </div>
                {comments?.map((comment, index) => (
                  <div
                    key={comment?.commentId || index}
                    className="border border-orange-200 p-2 mb-2"
                  >
                    <div className="flex justify-between">
                      <div>
                        <span className="font-bold">
                          {comment
                            ? `${comment.firstName || "Anonymous"} ${
                                comment.lastName || ""
                              }`
                            : "Anonymous"}
                        </span>
                        <span className="lg:text-sm md:text-sm text-gray-500 ml-2">
                          {comment?.createdAt ? timeAgo(comment.createdAt) : ""}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCommentLike(comment.commentId)}
                        className="flex items-center space-x-2"
                      >
                        <FaHeart
                          size={16}
                          color={
                            comment?.likedBy?.includes(
                              localStorage.getItem("email")
                            )
                              ? "red"
                              : "gray"
                          }
                        />
                        <span>{comment?.likes || 0}</span>
                      </button>
                    </div>
                    <div>{comment?.comment}</div>

                    <div>
                      {comment?.replies?.map((reply) => (
                        <div
                          key={reply.replyId || `reply-${Math.random()}`}
                          className="ml-5 border-t mt-2"
                        >
                          <div className="flex justify-between">
                            <span className="font-bold">
                              {(reply.firstName || "Anonymous") +
                                " " +
                                (reply.lastName || "")}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {timeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <div>{reply.reply}</div>
                        </div>
                      ))}

                      {showReplyInput[comment?.commentId] && (
                        <div className="ml-5 mt-2">
                          <textarea
                            value={replyInput[comment.commentId] || ""}
                            onChange={(e) =>
                              setReplyInput((prev) => ({
                                ...prev,
                                [comment.commentId]: e.target.value,
                              }))
                            }
                            rows="2"
                            className="w-full p-2 border border-orange-300"
                          ></textarea>
                          <button
                            onClick={() => handleReply(comment.commentId)}
                            className="mt-2 p-2 bg-green-500 text-white rounded"
                          >
                            {language === "te" ? "మరలి" : "Reply"}
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => handleReplyToggle(comment.commentId)}
                        className="text-orange-500 text-sm mt-2"
                      >
                        {showReplyInput[comment?.commentId]
                          ? language === "te"
                            ? "మరలిని రద్దు చేయండి"
                            : "Cancel Reply"
                          : language === "te"
                          ? "మరలించు"
                          : "Reply"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={` pt-5 border-orange-300 border-t-[1px] pb-10 leading-relaxed ${language === "te" ? `text-[22px]`:`text-[18px]`}`}>
              {language === "te"
                ? newsData.newsTe.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                : newsData.newsEn.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
            </div>
            
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="lg:w-[30%] md:w-[30%]  lg:block hidden space-y-4">
        <Link href='https://www.nandak.co' className=" rounded-md shadow-md m-20">
          <Image 
          src={Add}
          alt="No Image Found"
          width={500}
          height={500}
          className="rounded-md border border-orange-300"/>
        </Link> 
        <h3 className={`font-bold  text-xl flex justify-center ${language === "te" ? `${ramaraja.className} text-[26px]`:``}`}>{translations.related}</h3>
        <div>
          {relatedNews.length > 0 ? (
            relatedNews
            .slice(0, 3) 
            .map((newsItem) => (
              <Link
                href={`/news/${newsItem.newsId}`}
                key={newsItem.newsId}
                className=" p-4 h-screen overflow-y-scroll rounded-md space-y-4"
              >
                <div className="w-[100%] h-64 relative">
                  <Image
                    alt="no Image Found"
                    src={newsItem.image}
                    layout="fill"
                    objectFit="cover"
                    className="object-cover rounded-md shadow-md"
                  />
                </div>

                <div className={`font-semibold line-clamp-2 rounded-md flex justify-center ${language === "te" ? `${ramaraja.className} text-[24px]`:`text-lg`}`}>
                  {language === "te"
                    ? newsItem.headlineTe
                    : newsItem.headlineEn}
                </div>
                
              </Link>
            ))
          ) : (
            <div>No related news available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPost;
