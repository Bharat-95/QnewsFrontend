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

const NewsPost = () => {
  const { newsId } = useParams();
  const { language } = useLanguage();
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

  useEffect(() => {
    if (newsId) {
      const langPath = language === "te" ? "newsTe" : "newsEn";
      const userEmail = localStorage.getItem("email");

      axios
        .get(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/${langPath}/${newsId}`, {
          params: { userEmail },
        })
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

          // Ensure likedBy is an array before calling includes
          setHasLiked(Array.isArray(likedBy) && likedBy.includes(userEmail));

          if (ratings) {
            const averageRating = ratings.total / ratings.count;
            setAverageRating(averageRating);
          }

          if (category) {
            axios
              .get(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/related`)
              .then((response) => {
                setRelatedNews(response.data.data);
                console.log("related", response.data.data);
              })
              .catch((error) =>
                console.log("Error fetching related news:", error)
              );
          }
        })
        .catch((error) => console.log("Error fetching news:", error));
    }
  }, [newsId, language]);

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
      .put(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/comment`, {
        userEmail,
        firstName,
        lastName,
        comment: newComment,
      })
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
      .put(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/reply`, {
        commentId,
        userEmail,
        firstName,
        lastName,
        reply: replyText,
      })
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
        .put(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/comment/unlike`, {
          commentId,
          userEmail,
        })
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
        .put(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/comment/like`, {
          commentId,
          userEmail,
        })
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

    setRating(selectedRating); // Set the rating to the selected value
    setIsRated(true); // Disable the stars after rating

    axios
      .put(`https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/rate`, {
        userEmail,
        newsId,
        rating: selectedRating,
      })
      .then((res) => {
        setAverageRating(res.data.averageRating); // Update the average rating
        setIsRated(false); // Allow for state change again (if needed)
      })
      .catch((error) => {
        console.log("Error submitting rating:", error);
        setIsRated(false); // Reset the loading state in case of error
      });
  };

  return (
    <div className="lg:mx-10 md:mx-5 mx-4 lg:my-[32px] md:my-20 my-4 flex justify-between">
      <div className="lg:w-[60%] md:w-[60%] space-y-4">
        {newsData ? (
          <>
            <div className="lg:w-[806px] md:w-[450px] w-[100%] lg:h-[500px] md:h-[300px] h-[300px]">
              <Image
                alt="No Image Found"
                src={newsData.image}
                width={900}
                height={500}
                className="lg:w-[806px] md:w-[450px] w-[100%] rounded-md lg:h-[500px] md:h-[300px] h-[300px]"
              />
            </div>
            <div className="text-[24px] line-clamp-2 font-semibold">
              {language === "te" ? newsData.headlineTe : newsData.headlineEn}
            </div>
            <div className="flex justify-between font-light text-gray-500">
              <div className="flex items-center gap-10">
                <div>{formatDate(newsData.createdAt)}</div>{" "}
                <div> {timeAgo(newsData.createdAt)}</div>
              </div>
              <div className="flex gap-4">
                <button>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                      // Check if this star is part of the average rating
                      const starFill = averageRating - index;
                      const isRated = rating > 0; // Check if the user has rated

                      // Determine the color of the star:
                      let fillColor = "gray"; // Default color is gray for unfilled stars

                      if (isRated) {
                        // If the user has rated, fill stars with gold
                        fillColor = index < rating ? "gold" : "gray";
                      } else if (starFill >= 1) {
                        // If showing average rating, fill stars with gold
                        fillColor = "gold";
                      }

                      return (
                        <FaStar
                          key={index}
                          size={24}
                          color={fillColor}
                          className="cursor-pointer"
                          onClick={
                            !isRated ? () => handleRating(index + 1) : undefined
                          } // Disable click after rating
                          style={{
                            clipPath:
                              starFill >= 1
                                ? "none"
                                : `inset(0 ${
                                    Math.max(0, 1 - starFill) * 100
                                  }% 0 0)`,
                          }}
                        />
                      );
                    })}
                  </div>
                </button>

                <button
                  className="flex items-center space-x-2"
                  onClick={handleLike}
                >
                  <FaHeart size={24} color={hasLiked ? "red" : "gray"} />
                </button>
                <button onClick={toggleComments}>
                  <LuMessageCircle size={24} color="gray" />
                </button>
              </div>
            </div>
            {showComments && (
              <div className="h-96 overflow-y-scroll border border-black rounded-md shadow-md p-4 m-2 bg-gray-200">
                <div className="text-xl mb-3">{comments.length} Comments</div>
                <div className="mb-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="2"
                    className="w-full p-2 border border-gray-300"
                  ></textarea>
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                  >
                    {language === "te" ? "ప్రస్తావించు" : "Comment"}
                  </button>
                </div>
                {comments?.map((comment, index) => (
                  <div
                    key={comment?.commentId || index}
                    className="border p-2 mb-2"
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
                        <span className="text-sm text-gray-500 ml-2">
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
                            className="w-full p-2 border border-gray-300"
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
                        className="text-blue-500 text-sm mt-2"
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
            <div className="text-[18px] leading-relaxed">
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
      <div className="lg:w-[30%] md:w-[30%] md:block lg:block hidden space-y-10">
        <h3 className="font-bold  text-xl flex justify-center">Related News</h3>
        <div className="">
          {relatedNews.length > 0 ? (
            relatedNews.map((newsItem) => (
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

                <div className="text-lg font-semibold line-clamp-2 rounded-md flex justify-center">
                {language === "te" ? newsItem.headlineTe : newsItem.headlineEn}
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
