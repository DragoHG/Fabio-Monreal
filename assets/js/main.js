(() => {
  const root = document.documentElement;
  const params = new URLSearchParams(window.location.search);

  if (params.get("preview") === "print") {
    root.classList.add("print-preview");
  }
})();
