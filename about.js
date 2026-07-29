const contactEl = document.querySelector("#corrections-contact");

async function loadCorrectionsContact() {
  try {
    const response = await fetch("./data/site.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const config = await response.json();
    if (!config.correctionsUrl) return;

    const link = document.createElement("a");
    link.href = config.correctionsUrl;
    link.textContent = "Report a correction on X";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    contactEl.replaceChildren(
      link,
      document.createTextNode("."),
    );
    contactEl.hidden = false;
  } catch (error) {
    console.error("Unable to load site configuration:", error);
  }
}

loadCorrectionsContact();
