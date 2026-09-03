import {
  MAX_PHOTO_BYTES,
  validatePhotoFile,
  validatePhotoReview,
  addPhotoReview,
  getPhotoReviews,
} from "../utils/photoReviews";

describe("photo review utils", () => {
  beforeEach(() => {
    try {
      localStorage.clear();
    } catch (e) {}
  });

  test("MAX_PHOTO_BYTES is 200 KB", () => {
    expect(MAX_PHOTO_BYTES).toBe(200 * 1024);
  });

  test("validatePhotoFile rejects empty", () => {
    expect(validatePhotoFile(null)).toMatch(/pick/i);
    expect(validatePhotoFile(undefined)).toMatch(/pick/i);
  });

  test("validatePhotoFile rejects non-image", () => {
    const fakeFile = { type: "application/pdf", size: 1000, name: "a.pdf" };
    expect(validatePhotoFile(fakeFile)).toMatch(/image/i);
  });

  test("validatePhotoFile rejects oversize", () => {
    const fakeFile = { type: "image/png", size: 300 * 1024, name: "big.png" };
    expect(validatePhotoFile(fakeFile)).toMatch(/200 KB/i);
  });

  test("validatePhotoFile accepts small image", () => {
    const fakeFile = { type: "image/jpeg", size: 50 * 1024, name: "ok.jpg" };
    expect(validatePhotoFile(fakeFile)).toBe("");
  });

  test("validatePhotoReview requires name, rating, caption", () => {
    const e = validatePhotoReview({ name: "", rating: "0", text: "" });
    expect(e.name).toBeTruthy();
    expect(e.rating).toBeTruthy();
    expect(e.caption).toBeTruthy();
  });

  test("validatePhotoReview rejects bad rating", () => {
    const e = validatePhotoReview({ name: "Maria", rating: "9", text: "good" });
    expect(e.rating).toBeTruthy();
    const e2 = validatePhotoReview({ name: "Maria", rating: "abc", text: "good" });
    expect(e2.rating).toBeTruthy();
  });

  test("validatePhotoReview accepts valid", () => {
    const e = validatePhotoReview({ name: "Maria", rating: "5", text: "great photo" });
    expect(Object.keys(e)).toHaveLength(0);
  });

  test("addPhotoReview stores record with data URL", () => {
    const next = addPhotoReview("prod-1", {
      name: "Ana",
      rating: 5,
      text: "loved it",
      caption: "test caption",
      dataUrl: "data:image/png;base64,AAAA",
    });
    expect(next).toHaveLength(1);
    expect(next[0].name).toBe("Ana");
    expect(next[0].dataUrl).toMatch(/^data:image/);
    expect(next[0].caption).toBe("test caption");
  });

  test("getPhotoReviews returns [] when empty", () => {
    expect(getPhotoReviews("nope")).toEqual([]);
  });

  test("getPhotoReviews returns previously added list", () => {
    addPhotoReview("p2", { name: "Jo", rating: 4, text: "nice", dataUrl: "data:image/png;base64,BBBB" });
    const list = getPhotoReviews("p2");
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe("Jo");
  });
});