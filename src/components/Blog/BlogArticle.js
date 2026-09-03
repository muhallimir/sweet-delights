import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost } from "./blogData";
import { CheckoutWrap, Card, Title, BackLink } from "../Checkout/CheckoutElements";

const BlogArticle = () => {
  const { slug } = useParams();
  const post = getPost(slug);
  const [copied, setCopied] = useState("");

  if (!post) {
    return (
      <CheckoutWrap>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <BackLink as={Link} to="/">← Back to home</BackLink>
          <Title>Post not found</Title>
          <p><Link to="/" style={{ color: "#e3c987" }}>Back to recipes</Link></p>
        </div>
      </CheckoutWrap>
    );
  }

  const share = async () => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied("Link copied! Share away.");
    } catch (e) {
      setCopied(url);
    }
  };

  return (
    <CheckoutWrap>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <BackLink as={Link} to="/">← Back to recipes</BackLink>
        <Card>
          <div style={{ fontSize: ".85rem", opacity: 0.7 }}>{post.date} · {post.read}</div>
          <Title style={{ fontSize: "2rem" }}>{post.title}</Title>
          <img src={post.img} alt={post.title} style={{ width: "100%", borderRadius: ".9rem", margin: "1rem 0" }} />
          <p style={{ opacity: 0.9, fontStyle: "italic" }}>{post.excerpt}</p>
          {post.content.map((para, idx) => (
            <p key={idx} style={{ lineHeight: 1.7, opacity: 0.92 }}>{para}</p>
          ))}
          <div style={{ display: "flex", gap: ".8rem", alignItems: "center", marginTop: "1.2rem", flexWrap: "wrap" }}>
            <button type="button" onClick={share} style={{ borderRadius: 999, border: "1px solid #e3c987", background: "transparent", color: "#e3c987", padding: ".6rem 1.2rem", cursor: "pointer" }}>
              Copy share link
            </button>
            <Link to="/" style={{ color: "#e3c987" }}>← All posts</Link>
          </div>
          {copied ? <p role="status" style={{ color: "#c8f0d2" }}>{copied}</p> : null}
        </Card>
      </div>
    </CheckoutWrap>
  );
};

export default BlogArticle;
