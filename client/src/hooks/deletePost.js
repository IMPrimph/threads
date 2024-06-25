/* eslint-disable react-hooks/rules-of-hooks */

const deletePost = async (post, toast) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.error) {
      toast("Error", data.error, "error");
      return;
    }

    toast("Success", "Post deleted successfully", "success");
  } catch (error) {
    toast("Error", error, "error");
  }
};

export default deletePost;
