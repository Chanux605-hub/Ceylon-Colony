import React, { useState } from "react";
import Navbar from "../Components/User/navbar";
import Footer from "../Components/User/Footer";

import BlogHero from "../HarvestManagement/Blog/BlogHero.jsx";
import BlogList from "../HarvestManagement/Blog/BlogList.jsx";
import BlogDetail from "../HarvestManagement/Blog/BlogDetail.jsx";

export default function BlogPage() {
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  return (
    <>
      <Navbar />
      <BlogHero />
      <div className="min-h-screen bg-gray-50">
        {!selectedBlogId ? (
          <BlogList onSelectBlog={setSelectedBlogId} />
        ) : (
          <BlogDetail
            blogId={selectedBlogId}
            onBack={() => setSelectedBlogId(null)}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
