import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { POSTS } from "./blogData";

const BlogSection = styled.section`
  background: #0d0d0d;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,.08);
`;

const BlogInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  h2 { color: #e3c987; margin: 0 0 .3rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  @media screen and (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: #161616;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 1rem;
  overflow: hidden;
  img { width: 100%; height: 170px; object-fit: cover; display: block; }
  .body { padding: .9rem 1rem 1.1rem; }
  h3 { margin: 0 0 .3rem; font-size: 1.05rem; }
  h3 a { color: #fff; text-decoration: none; }
  h3 a:hover { color: #e3c987; }
`;

const BlogGrid = () => {
  return (
    <BlogSection id="recipes" aria-label="Recipes blog">
      <BlogInner>
        <h2>Recipes + Kitchen Notes</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>3 posts, full article view, copy-link share.</p>
        <Grid>
          {POSTS.map((p) => (
            <Card key={p.slug}>
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className="body">
                <div style={{ fontSize: ".8rem", opacity: 0.7 }}>{p.date} · {p.read}</div>
                <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
                <p style={{ fontSize: ".9rem", opacity: 0.85 }}>{p.excerpt}</p>
                <Link to={`/blog/${p.slug}`} style={{ color: "#e3c987" }}>Read →</Link>
              </div>
            </Card>
          ))}
        </Grid>
      </BlogInner>
    </BlogSection>
  );
};

export default BlogGrid;
