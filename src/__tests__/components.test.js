import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { allProducts } from "../components/Products/data";
import MenuExperience from "../components/Menu/MenuSection";
import CartDrawer from "../components/Cart/CartDrawer";
import CheckoutPage from "../components/Checkout/CheckoutPage";

function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>
  );
}

describe("MenuExperience renders product grid", () => {
  test("renders all products with names and prices", () => {
    renderWithProviders(
      <MenuExperience heading="Test menu" products={allProducts} id="menu" />
    );
    expect(screen.getByRole("region", { name: /bakery menu/i })).toBeInTheDocument();
    allProducts.forEach((p) => {
      const name = p.name.trim();
      const headings = screen.getAllByRole("heading", { name: new RegExp(name, "i") });
      expect(headings.length).toBeGreaterThan(0);
    });
    const buttons = screen.getAllByRole("button", { name: /add .* to cart/i });
    expect(buttons.length).toBeGreaterThanOrEqual(allProducts.length);
  });

  test("filters products by category", () => {
    renderWithProviders(
      <MenuExperience heading="Test menu" products={allProducts} id="menu" />
    );
    const sweetsTab = screen.getByRole("tab", { name: /sweets/i });
    fireEvent.click(sweetsTab);
    expect(sweetsTab.getAttribute("aria-selected")).toBe("true");
    const count = screen.getByRole("status");
    expect(count.textContent).toMatch(/treat/);
  });
});

describe("CartDrawer opens and closes", () => {
  test("drawer is initially hidden and present in the DOM", () => {
    const { container } = renderWithProviders(
      <>
        <CartDrawer />
      </>
    );
    const dialog = container.querySelector('[role="dialog"][aria-label="Shopping cart"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute("aria-hidden")).toBe("true");
  });

  test("openCart() on add-to-cart reveals the drawer with item", () => {
    const product = allProducts[0];
    const { container } = renderWithProviders(
      <>
        <MenuExperience heading="x" products={[product]} id="menu" />
        <CartDrawer />
      </>
    );
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`Add ${product.name} to cart`, "i") })
    );
    const dialog = container.querySelector('[role="dialog"][aria-label="Shopping cart"]');
    expect(dialog.getAttribute("aria-hidden")).toBe("false");
    expect(dialog.textContent).toContain(product.name);
    expect(dialog.textContent).toMatch(/Your Cart \(1\)/);
  });

  test("close button hides drawer", () => {
    const product = allProducts[0];
    const { container } = renderWithProviders(
      <>
        <MenuExperience heading="x" products={[product]} id="menu" />
        <CartDrawer />
      </>
    );
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`Add ${product.name} to cart`, "i") })
    );
    fireEvent.click(screen.getByRole("button", { name: /close cart/i }));
    const dialog = container.querySelector('[role="dialog"][aria-label="Shopping cart"]');
    expect(dialog.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Checkout validation", () => {
  test("submitting an empty form blocks order and surfaces errors", () => {
    renderWithProviders(<CheckoutPage />, { route: "/checkout" });
    const submit = screen.getByRole("button", { name: /place order|cart is empty/i });
    expect(submit).toBeInTheDocument();
    fireEvent.click(submit);
    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  test("requires date + slot via FulfillmentPicker", () => {
    renderWithProviders(<CheckoutPage />, { route: "/checkout" });
    const submit = screen.getByRole("button", { name: /place order|cart is empty/i });
    fireEvent.click(submit);
    expect(screen.getByText(/pick a date/i)).toBeInTheDocument();
  });
});