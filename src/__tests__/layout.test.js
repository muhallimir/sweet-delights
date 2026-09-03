import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import CheckoutPage from "../components/Checkout/CheckoutPage";
import TrackPage from "../components/Track/TrackPage";
import AdminPage from "../components/Admin/AdminPage";
import NotFound from "../components/NotFound/NotFound";
import BlogArticle from "../components/Blog/BlogArticle";
import Home from "../App";

function renderRoute(ui) {
  return render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>
  );
}

describe("layout landmarks and a11y", () => {
  test("home renders a skip-link as the first focusable element", () => {
    const { container } = renderRoute(<Home />);
    const skip = container.querySelector("a.sr-only");
    expect(skip).not.toBeNull();
    expect(skip.getAttribute("href")).toBe("#menu");
    expect(skip.textContent.toLowerCase()).toContain("skip");
  });

  test("home renders nav and footer landmarks", () => {
    const { container } = renderRoute(<Home />);
    expect(container.querySelector("nav")).not.toBeNull();
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(container.textContent.toLowerCase()).toMatch(/opening hours|mon – sat|sunday/);
  });

  test("checkout uses main + form with labeled inputs", () => {
    const { container } = renderRoute(<CheckoutPage />);
    const main = container.querySelector("main");
    expect(main).not.toBeNull();
    const form = main.querySelector("form");
    expect(form).not.toBeNull();
    expect(form.getAttribute("aria-label")).toBe("Checkout form");
    const requiredInputs = main.querySelectorAll("input#co-name, input#co-phone, textarea#co-address");
    expect(requiredInputs.length).toBe(3);
    requiredInputs.forEach((el) => {
      const id = el.id;
      const label = main.querySelector(`label[for='${id}']`);
      expect(label).not.toBeNull();
    });
  });

  test("track page uses main + form", () => {
    const { container } = renderRoute(<TrackPage />);
    const main = container.querySelector("main");
    expect(main).not.toBeNull();
    const form = main.querySelector("form");
    expect(form).not.toBeNull();
    expect(form.getAttribute("aria-label")).toBe("Order tracking form");
    expect(main.querySelector("input#track-id")).not.toBeNull();
  });

  test("blog article has back link", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blog/perfect-leche-flan"]}>
        <BlogArticle match={{ params: { slug: "perfect-leche-flan" } }} />
      </MemoryRouter>
    );
    expect(container.querySelector("a[href='/']")).not.toBeNull();
  });

  test("admin page renders heading", () => {
    const { container } = renderRoute(<AdminPage />);
    expect(container.textContent.toLowerCase()).toContain("admin");
    expect(container.querySelector("main")).not.toBeNull();
  });

  test("not-found page renders for unknown route", () => {
    const { container } = renderRoute(<NotFound />);
    expect(container.querySelector("main")).not.toBeNull();
  });
});