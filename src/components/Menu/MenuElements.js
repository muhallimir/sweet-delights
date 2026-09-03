import styled from "styled-components";

export const MenuSection = styled.section`
  width: 100%;
  background-color: black;
  padding: 5rem clamp(1rem, 4vw, calc((1300px - 100%) / 2));
  color: #fff;
`;

export const MenuHeading = styled.h2`
  font-size: clamp(2rem, 2.5vw, 2.5rem);
  text-align: center;
  margin-bottom: 1rem;
`;

export const MenuSub = styled.p`
  text-align: center;
  opacity: 0.8;
  margin: 0 0 2rem;
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  padding: 0 1.25rem;
  margin-bottom: 1.5rem;
`;

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

export const TabButton = styled.button`
  border: 1px solid
    ${({ active }) => (active ? "#e3c987" : "rgba(255,255,255,.22)")};
  background: ${({ active }) => (active ? "#e3c987" : "transparent")};
  color: ${({ active }) => (active ? "#111" : "#fff")};
  font-weight: 700;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    border-color: #e3c987;
    color: ${({ active }) => (active ? "#111" : "#e3c987")};
    outline: 2px solid #e3c987;
    outline-offset: 2px;
  }
`;

export const SearchInput = styled.input`
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: #111;
  color: #fff;
  padding: 0.55rem 1rem;
  min-width: min(280px, 80vw);
  font-size: 1rem;
  &:focus {
    outline: 2px solid #e3c987;
    border-color: #e3c987;
  }
`;

export const SortSelect = styled.select`
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: #111;
  color: #fff;
  padding: 0.55rem 0.9rem;
  font-size: 0.95rem;
  cursor: pointer;
  &:focus {
    outline: 2px solid #e3c987;
    border-color: #e3c987;
  }
`;

export const ResultCount = styled.p`
  text-align: center;
  opacity: 0.75;
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
`;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
`;

export const EmptyState = styled.div`
  text-align: center;
  opacity: 0.85;
  padding: 2rem 1rem;
`;
